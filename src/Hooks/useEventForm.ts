import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import EventImageService from "@/core/events/EventImageService";
import EventService from "@/core/events/EventService";
import { IEvent } from "@/core/events/IEvent";
import { IEventDTO } from "@/core/events/IEventDTO";
import { useCallback, useEffect, useState } from "react";

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
  const [description, setDescription] = useState(event?.description || "");
  const [imagePreviews, setImagePreviews] = useState<IImagePreview[]>([]);
  const [tags, setTags] = useState<string[]>(event?.tags || []);
  const [location, setLocation] = useState(event?.location || "");
  const [capacity, setCapacity] = useState(event?.capacity || 0);
  const [eventDate, setEventDate] = useState(() => {
    if (event?.eventDate) {
      return new Date(event.eventDate).toISOString().split("T")[0];
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
          console.log(
            "📷 useEventForm - Cargando imágenes existentes del evento:",
            event.id
          );
          const eventImages = await apiEventImage.getEventImages(event.id);

          const existingImages: IImagePreview[] = eventImages.map((img) => ({
            url: apiEventImage.buildImageUrl(img.id),
            isLoading: false,
            isExisting: true,
          }));

          setImagePreviews(existingImages);
        } catch (error) {
          console.error("💥 useEventForm - Error cargando imágenes:", error);
          if (event.images && event.images.length > 0) {
            const fallbackImages: IImagePreview[] = event.images.map(
              (imageUrl) => ({
                url: imageUrl,
                isLoading: false,
                isExisting: true,
              })
            );
            setImagePreviews(fallbackImages);
          }
        }
      } else if (event?.images && event.images.length > 0) {
        const existingImages: IImagePreview[] = event.images.map(
          (imageUrl) => ({
            url: imageUrl,
            isLoading: false,
            isExisting: true,
          })
        );
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
    console.log("🔐 useEventForm - Validando permisos y campos");

    if (userRole !== "ROLE_ADMIN") {
      throw new Error("Solo los administradores pueden crear/editar eventos.");
    }

    if (userId !== 1) {
      throw new Error(
        "Solo el usuario administrador (ID: 1) puede crear/editar eventos."
      );
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !eventDate ||
      !location.trim()
    ) {
      throw new Error(
        "Título, descripción, fecha y ubicación son campos obligatorios."
      );
    }

    return true;
  }, [title, description, eventDate, location, userRole, userId]);

  // Reset del formulario
  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setImagePreviews([]);
    setTags([]);
    setLocation("");
    setCapacity(0);
    setEventDate("");
    setLink("");
  }, []);

  // Submit del formulario
  const submitForm = useCallback(
    async (onSubmit: (event: IEvent) => Promise<void>, onClose: () => void) => {
      console.log("🚀 useEventForm - Iniciando proceso de envío");

      if (isSubmitting) return;

      setIsSubmitting(true);
      setGlobalError(null);

      try {
        validateForm();

        // Separar archivos nuevos vs imágenes existentes
        const newImageFiles: File[] = [];
        const existingImageUrls: string[] = [];

        imagePreviews.forEach((preview) => {
          if (preview.file && !preview.isExisting) {
            newImageFiles.push(preview.file);
          } else if (preview.isExisting) {
            existingImageUrls.push(preview.url);
          }
        });

        // Construir DTO del evento
        const eventData: IEventDTO = {
          id: event?.id || 0,
          title: title.trim(),
          message: description.trim(),
          description: description.trim(),
          location: location.trim(),
          capacity: Number(capacity) || 0,
          eventDate: new Date(eventDate).toISOString(),
          link: link.trim(),
          isArchived: false,
          tags: tags,
          images: existingImageUrls,
          loves: event?.loves || 0,
          isPublished: event?.isPublished || false,
          createdAt: event?.createdAt
            ? String(event.createdAt)
            : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          alt_image: "",
          source_image: "",
          alt_avatar: "",
          source_avatar: "",
          url_avatar: "",
          userId: userId,
        };

        let resultEvent: IEvent;

        if (event?.id) {
          resultEvent = await apiEvent.updateEvent(event.id, eventData);
        } else {
          resultEvent = await apiEvent.createEvent(eventData);
        }

        // Subir imágenes nuevas si las hay
        if (newImageFiles.length > 0 && resultEvent.id) {
          try {
            const validation = apiEventImage.validateConfiguration();
            if (!validation.isValid) {
              setGlobalError(
                `Error de configuración: ${validation.errors.join(", ")}`
              );
              return;
            }

            const uploadedImages = await apiEventImage.uploadEventImages(
              resultEvent.id,
              newImageFiles
            );
            const newImageUrls = uploadedImages.map((img) =>
              apiEventImage.buildImageUrl(img.id)
            );
            resultEvent.images = [...existingImageUrls, ...newImageUrls];
          } catch (imageError: any) {
            setGlobalError(
              `Evento guardado, pero error subiendo imágenes: ${imageError.message}`
            );
          }
        }

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
      description,
      location,
      capacity,
      eventDate,
      link,
      tags,
      userId,
      apiEvent,
      apiEventImage,
      resetForm,
    ]
  );

  return {
    // Estados
    title,
    setTitle,
    description,
    setDescription,
    location,
    setLocation,
    capacity,
    setCapacity,
    eventDate,
    setEventDate,
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
