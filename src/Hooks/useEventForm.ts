import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import EventService from "@/core/events/EventService";
import { IEvent } from "@/core/events/IEvent";
import { IEventCreateDTO } from "@/core/events/IEventBackendDTO";
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
  // DEBUG: Log para entender los props recibidos
  useEffect(() => {
    if (show) {
      log.info("🔍 [useEventForm] Hook inicializado", {
        hasEvent: !!event,
        eventId: event?.id,
        eventTitle: event?.title,
        isCreateMode: !event?.id,
        show,
      });
    }
  }, [show, event]);

  // Estados del formulario — todos declarados antes del useEffect de sincronización
  const [title, setTitle] = useState(event?.title || "");
  const [message, setMessage] = useState(event?.message || "");
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
      return event.eventTime;
    }
    if (event?.eventDate) {
      return (
        new Date(event.eventDate).toISOString().split("T")[1]?.slice(0, 5) || ""
      );
    }
    return "";
  });
  const [link, setLink] = useState(event?.link || "");
  const [imagePreviews, setImagePreviews] = useState<IImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const { tags, setTags } = useTagsLoader(event?.tags || []);
  const { uploadTagsToEvent } = useTagsUpload();

  // Sincroniza todos los campos del formulario cuando el modal se abre o cambia el evento
  const syncEventDate = useCallback(
    (eventDate: string, eventTime: string | undefined) => {
      if (eventDate) {
        setEventDate(new Date(eventDate).toISOString().split("T")[0]);
        setEventTime(
          eventTime ||
            new Date(eventDate).toISOString().split("T")[1]?.slice(0, 5) ||
            "",
        );
      } else {
        setEventDate("");
        setEventTime(eventTime || "");
      }
    },
    [setEventDate, setEventTime],
  );

  const syncFields = useCallback(
    (ev: IEvent) => {
      setTitle(ev.title || "");
      setMessage(ev.message || "");
      setLocation(ev.location || "");
      setCapacity(ev.capacity || 0);
      setLink(ev.link || "");
      syncEventDate(ev.eventDate, ev.eventTime);
      if (Array.isArray(ev.tags)) setTags(ev.tags);
    },
    [
      setTitle,
      setMessage,
      setLocation,
      setCapacity,
      setLink,
      syncEventDate,
      setTags,
    ],
  );

  const resetFields = useCallback(() => {
    setTitle("");
    setMessage("");
    setLocation("");
    setCapacity(0);
    setLink("");
    setEventDate("");
    setEventTime("");
    setTags([]);
  }, [
    setTitle,
    setMessage,
    setLocation,
    setCapacity,
    setLink,
    setEventDate,
    setEventTime,
    setTags,
  ]);

  useEffect(() => {
    if (show) {
      if (event) {
        syncFields(event);
      } else {
        resetFields();
      }
    }
  }, [show, event, syncFields, resetFields]);

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

          const existingImages: IImagePreview[] = eventImages.map((img) => {
            const preview: IImagePreview = {
              url: apiEventImage.buildImageUrlFromPath(img.imagePath || ""),
              isLoading: false,
              isExisting: true,
            };
            if (typeof img.id === "number") {
              preview.id = img.id;
            }
            return preview;
          });

          setImagePreviews(existingImages);
        } catch (error) {
          log.error("useEventForm - Error cargando imágenes:", error);
          if (event.images && event.images.length > 0) {
            const fallbackImages: IImagePreview[] = event.images
              .filter(
                (imageUrl): imageUrl is string => typeof imageUrl === "string",
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
            (imageUrl): imageUrl is string => typeof imageUrl === "string",
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
        "useEventForm - Validación fallida: El usuario no es administrador.",
      );
      throw new Error("Solo los administradores pueden crear/editar eventos.");
    }

    if (userId !== 1) {
      log.error(
        "useEventForm - Validación fallida: El usuario no es el administrador principal.",
      );
      throw new Error(
        "Solo el usuario administrador (ID: 1) puede crear/editar eventos.",
      );
    }

    if (
      !title.trim() ||
      !message.trim() ||
      !eventDate ||
      !location.trim() ||
      !eventTime
    ) {
      log.error(
        "useEventForm - Validación fallida: Campos obligatorios faltantes.",
        {
          title,
          message,
          eventDate,
          location,
          eventTime,
        },
      );
      throw new Error(
        "Título, mensaje, fecha, hora y ubicación son campos obligatorios.",
      );
    }

    return true;
  }, [title, message, eventDate, location, eventTime, userRole, userId]);

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

  const processImages = useCallback(
    async (eventId: number, newImageFiles: File[]) => {
      if (newImageFiles.length > 0) {
        try {
          await apiEventImage.uploadEventImages(eventId, newImageFiles);
        } catch (imageError: any) {
          log.error("useEventForm - Error subiendo imágenes:", imageError);
          setGlobalError(
            `Evento guardado, pero error subiendo imágenes: ${imageError.message}`,
          );
        }
      }
      try {
        const eventImages = await apiEventImage.getEventImages(eventId);
        const refreshedImages: IImagePreview[] = eventImages.map((img) => ({
          url: apiEventImage.buildImageUrlFromFilename(img.imageName || ""),
          isLoading: false,
          isExisting: true,
        }));
        setImagePreviews(refreshedImages);
      } catch (error) {
        log.error("useEventForm - Error recargando imágenes:", error);
      }
    },
    [apiEventImage],
  );

  // Submit del formulario
  const submitForm = useCallback(
    async (onSubmit: (event: IEvent) => Promise<void>, onClose: () => void) => {
      if (isSubmitting) {
        log.warn(
          "useEventForm - Proceso de envío ya en curso. Abortando nuevo envío.",
        );
        return;
      }

      setIsSubmitting(true);
      setGlobalError(null);

      try {
        // Validar formulario antes de procesar
        if (!validateForm()) {
          return;
        }

        const newImageFiles: File[] = [];

        imagePreviews.forEach((preview) => {
          if (preview.file && !preview.isExisting) {
            newImageFiles.push(preview.file);
          }
        });

        let resultEvent: IEvent;

        if (event?.id) {
          log.info("🔄 [useEventForm] Modo EDICIÓN detectado");

          // EDICIÓN: Preparar datos del evento actualizado (SIN llamar al API)
          // El API se llama desde el componente padre (AdminEventView)
          resultEvent = {
            ...event,
            id: event.id,
            title: title.trim(),
            message: message.trim(),
            location: location.trim(),
            capacity: Number(capacity) || 0,
            eventDate: eventDate,
            eventTime: eventTime || undefined,
            link: link.trim(),
            tags: tags,
          };
        } else {
          log.info("🆕 [useEventForm] Modo CREACIÓN detectado");
          // CREACIÓN: Crear evento sin tags y luego asociar tags
          const createData: IEventCreateDTO = {
            title: title.trim(),
            message: message.trim(),
            location: location.trim() || undefined,
            link: link.trim() || undefined,
            capacity: Number(capacity) || undefined,
            eventDate: eventDate || undefined,
            eventTime: eventTime || undefined,
            archived: false,
          };
          resultEvent = await apiEvent.createEvent(createData);
          if (resultEvent.id) {
            try {
              await uploadTagsToEvent(resultEvent.id, tags);
            } catch (err) {
              log.error("useEventForm - Error asociando tags al evento:", err);
            }
          }
        }

        if (resultEvent.id) {
          await processImages(resultEvent.id, newImageFiles);
        }

        log.info("useEventForm - Evento procesado exitosamente", {
          id: resultEvent.id,
        });
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
      processImages,
      resetForm,
    ],
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
