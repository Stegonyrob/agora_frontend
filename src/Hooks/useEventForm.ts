import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import EventService from "@/core/events/EventService";
import { IEvent } from "@/core/events/IEvent";
import {
  IEventCreateDTO,
  IEventUpdateDTO,
} from "@/core/events/IEventBackendDTO";
import { EventImageService } from "@/core/events/images/EventImageService";
import { log } from "@/core/logging/LoggerService";
import { useCallback, useEffect, useState } from "react";
import { useTagsLoader } from "./useTagsLoader";
import { useTagsUpload } from "./useTagsUpload";

interface UseEventFormProps {
  event?: IEvent;
  show: boolean;
  userId?: number;
}

export const useEventForm = ({
  event,
  show,
  userId: propUserId,
}: UseEventFormProps) => {
  // Estados del formulario
  const [title, setTitle] = useState(event?.title || "");
  const [message, setMessage] = useState(event?.message || "");
  const [imagePreviews, setImagePreviews] = useState<IImagePreview[]>([]);
  const { tags, setTags } = useTagsLoader(event?.tags || []);

  // Sincroniza el estado de tags cuando el modal se abre/cierra o cambia el evento
  // - Si es creación (sin event), limpia tags al abrir
  // - Si es edición (con event), sincroniza tags con event.tags
  useEffect(() => {
    if (show) {
      if (event && Array.isArray(event.tags)) {
        setTags(event.tags);
      } else if (!event) {
        setTags([]);
      }
    }
  }, [show, event, setTags]);
  const { uploadTagsToEvent } = useTagsUpload();
  const [location, setLocation] = useState(event?.location || "");
  const [capacity, setCapacity] = useState(event?.capacity || 0);
  const [eventDate, setEventDate] = useState(() => {
    if (event?.eventDate) {
      return new Date(event.eventDate).toISOString().split("T")[0];
    }
    return "";
  });
  const [eventTime, setEventTime] = useState(() => {
    if (event?.eventTime) {
      return event.eventTime; // Use eventTime directly from backend
    }
    if (event?.eventDate) {
      return (
        new Date(event.eventDate).toISOString().split("T")[1]?.slice(0, 5) || ""
      );
    }
    return "";
  });
  const [link, setLink] = useState(event?.link || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Datos del usuario
  const userId = propUserId || Number(sessionStorage.getItem("userId")) || 0;
  const userName = sessionStorage.getItem("userName") || "";
  const userRole = sessionStorage.getItem("role") || "";

  // Servicios memoizados
  const apiEvent = new EventService();
  const apiEventImage = new EventImageService();

  // Cargar imágenes existentes del evento
  useEffect(() => {
    const loadEventImages = async () => {
      if (event?.id && show) {
        try {
          const eventImages = await apiEventImage.getEventImages(event.id);

          const existingImages: IImagePreview[] = eventImages.map((img) => ({
            url: apiEventImage.buildImageUrlFromFilename(img.imageName || ""),
            isLoading: false,
            isExisting: true,
          }));

          setImagePreviews(existingImages);
        } catch (error) {
          log.error("useEventForm - Error cargando imágenes:", error);
          if (event.images && event.images.length > 0) {
            const fallbackImages: IImagePreview[] = event.images
              .filter(
                (imageUrl): imageUrl is string => typeof imageUrl === "string"
              )
              .map((imageUrl) => ({
                url: imageUrl,
                isLoading: false,
                isExisting: true,
              }));
            setImagePreviews(fallbackImages);
          }
        }
      } else if (event?.images && event.images.length > 0) {
        const existingImages: IImagePreview[] = event.images
          .filter(
            (imageUrl): imageUrl is string => typeof imageUrl === "string"
          )
          .map((imageUrl) => ({
            url: imageUrl,
            isLoading: false,
            isExisting: true,
          }));
        setImagePreviews(existingImages);
      } else {
        setImagePreviews([]);
      }
    };

    loadEventImages();
    setGlobalError(null);
  }, [event?.id, event?.images, show]);

  // Limpiar URLs de objetos
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.url && !preview.isExisting && preview.file) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [imagePreviews]);

  // Manejo de imágenes
  const handleImagesSelected = useCallback((files: File[]) => {
    const newPreviews: IImagePreview[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      isLoading: false,
      file: file,
      isExisting: false,
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const handleRemoveImage = useCallback((idx: number) => {
    setImagePreviews((prev) => {
      const imageToRemove = prev[idx];
      if (
        imageToRemove?.url &&
        !imageToRemove.isExisting &&
        imageToRemove.file
      ) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  // Validación de formulario
  const validateForm = useCallback(() => {
    if (userRole !== "ROLE_ADMIN") {
      log.error(
        "useEventForm - Validación fallida: El usuario no es administrador."
      );
      throw new Error("Solo los administradores pueden crear/editar eventos.");
    }

    if (userId !== 1) {
      log.error(
        "useEventForm - Validación fallida: El usuario no es el administrador principal."
      );
      throw new Error(
        "Solo el usuario administrador (ID: 1) puede crear/editar eventos."
      );
    }

    if (!title.trim() || !message.trim() || !eventDate || !location.trim()) {
      log.error(
        "useEventForm - Validación fallida: Campos obligatorios faltantes.",
        {
          title,
          message,
          eventDate,
          location,
        }
      );
      throw new Error(
        "Título, mensaje, fecha y ubicación son campos obligatorios."
      );
    }

    return true;
  }, [title, message, eventDate, location, userRole, userId]);

  // Reset del formulario
  const resetForm = useCallback(() => {
    setTitle("");
    setMessage("");
    setImagePreviews([]);
    setTags([]);
    setLocation("");
    setCapacity(0);
    setEventDate("");
    setEventTime("");
    setLink("");
  }, []);

  // Submit del formulario
  const submitForm = useCallback(
    async (onSubmit: (event: IEvent) => Promise<void>, onClose: () => void) => {
      if (isSubmitting) {
        log.warn(
          "useEventForm - Proceso de envío ya en curso. Abortando nuevo envío."
        );
        return;
      }

      setIsSubmitting(true);
      setGlobalError(null);

      try {
        validateForm();

        const newImageFiles: File[] = [];
        const existingImageUrls: string[] = [];

        imagePreviews.forEach((preview) => {
          if (preview.file && !preview.isExisting) {
            newImageFiles.push(preview.file);
          } else if (preview.isExisting) {
            existingImageUrls.push(preview.url);
          }
        });

        let resultEvent: IEvent;

        if (event?.id) {
          // EDICIÓN: Actualizar evento sin tags y luego asociar tags
          const updateData: IEventUpdateDTO = {
            title: title.trim(),
            message: message.trim(),
            capacity: Number(capacity) || undefined,
            archived: false,
            eventTime: eventTime || undefined,
          };
          console.log(
            "%cPAYLOAD ENVIADO (UPDATE EVENT):",
            "color: #00e676; font-weight: bold; background: #222; padding:2px 6px; border-radius:3px;",
            JSON.stringify(updateData, null, 2)
          );
          const updatedEventDTO = await apiEvent.updateEvent(
            event.id,
            updateData
          );
          // Asociar tags después de actualizar
          try {
            console.log(
              "%cPAYLOAD DE TAGS ENVIADO AL BACKEND (UPDATE EVENT):",
              "color: #00e676; font-weight: bold; background: #222; padding:2px 6px; border-radius:3px;"
            );
            console.log({ tags });
            await uploadTagsToEvent(event.id, tags);
            console.log(
              "%cTAGS ASOCIADAS (UPDATE EVENT):",
              "color: #00c853; font-weight: bold; background: #222; padding:2px 6px; border-radius:3px;",
              JSON.stringify({ tags }, null, 2)
            );
          } catch (err) {
            log.error("useEventForm - Error asociando tags al evento:", err);
          }
          resultEvent = {
            ...event,
            id: updatedEventDTO.id,
            title: updatedEventDTO.title,
            message: updatedEventDTO.message,
            capacity: updatedEventDTO.capacity,
            isArchived: updatedEventDTO.archived,
            tags: tags,
          };
        } else {
          // CREACIÓN: Crear evento sin tags y luego asociar tags
          const createData: IEventCreateDTO = {
            title: title.trim(),
            message: message.trim(),
            capacity: Number(capacity) || undefined,
            eventDate: eventDate || undefined,
            eventTime: eventTime || undefined,
            archived: false,
          };
          console.log(
            "%cPAYLOAD ENVIADO (CREATE EVENT):",
            "color: #00e676; font-weight: bold; background: #222; padding:2px 6px; border-radius:3px;",
            JSON.stringify(createData, null, 2)
          );
          resultEvent = await apiEvent.createEvent(createData);
          // Asociar tags después de crear
          if (resultEvent.id) {
            console.log(
              "%cTAGS EN useEventForm ANTES DE SUBMIT (CREATE EVENT):",
              "color: #ff9800; font-weight: bold; background: #222; padding:2px 6px; border-radius:3px; font-size: 1.1em;",
              JSON.stringify(tags, null, 2)
            );
            console.log(
              "%cPAYLOAD DE TAGS ENVIADO AL BACKEND (CREATE EVENT):",
              "color: #00e676; font-weight: bold; background: #222; padding:2px 6px; border-radius:3px;"
            );
            try {
              console.log({ tags });
              await uploadTagsToEvent(resultEvent.id, tags);
              console.log(
                "%cTAGS ASOCIADAS (CREATE EVENT):",
                "color: #00c853; font-weight: bold; background: #222; padding:2px 6px; border-radius:3px;",
                JSON.stringify({ tags }, null, 2)
              );
            } catch (err) {
              log.error("useEventForm - Error asociando tags al evento:", err);
            }
          }
        }

        if (newImageFiles.length > 0 && resultEvent.id) {
          try {
            console.log("📤 Subiendo nuevas imágenes:", newImageFiles);
            await apiEventImage.uploadEventImages(
              resultEvent.id,
              newImageFiles
            );
            resultEvent = await apiEvent.fetchEventById(resultEvent.id);
          } catch (imageError: any) {
            log.error("useEventForm - Error subiendo imágenes:", imageError);
            setGlobalError(
              `Evento guardado, pero error subiendo imágenes: ${imageError.message}`
            );
          }
        }

        console.log("✅ Evento procesado exitosamente:", resultEvent);
        await onSubmit(resultEvent);

        if (!event?.id) {
          resetForm();
        }

        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error desconocido al guardar el evento.";
        log.error("useEventForm - Error en el proceso de envío:", errorMessage);
        setGlobalError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      validateForm,
      imagePreviews,
      event,
      title,
      message,
      location,
      capacity,
      eventDate,
      tags,
      eventTime,
      link,
      uploadTagsToEvent,
      apiEvent,
      apiEventImage,
      resetForm,
    ]
  );

  return {
    title,
    setTitle,
    message,
    setMessage,
    location,
    setLocation,
    capacity,
    setCapacity,
    eventDate,
    setEventDate,
    eventTime,
    setEventTime,
    link,
    setLink,
    tags,
    setTags,
    imagePreviews,
    isSubmitting,
    globalError,

    // Funciones
    handleImagesSelected,
    handleRemoveImage,
    submitForm,
    resetForm,

    // Datos del usuario
    userId,
    userName,
    userRole,
  };
};
