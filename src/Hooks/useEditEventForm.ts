import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import EventImageService from "@/core/events/EventImageService";
import { IEventDTO } from "@/core/events/IEventDTO";
import DOMPurify from "dompurify";
import { useCallback, useEffect, useState } from "react";

interface UseEditEventFormProps {
  event?: IEventDTO;
  show: boolean;
}

export const useEditEventForm = ({ event, show }: UseEditEventFormProps) => {
  // Estados del formulario
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");
  const [capacity, setCapacity] = useState<number | string>(0);
  const [imagePreviews, setImagePreviews] = useState<IImagePreview[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Servicio memoizado
  const apiEventImage = new EventImageService();

  // Cargar datos del evento cuando se abre el modal
  useEffect(() => {
    if (show && event) {
      setTitle(event.title || "");
      setMessage(event.message || "");
      setPlace(event.place || "");
      setCapacity(event.capacity || 0);
      setLink(event.link || "");

      if (event.eventDate) {
        const formattedDate = new Date(event.eventDate)
          .toISOString()
          .split("T")[0];
        setDate(formattedDate);
      } else {
        setDate("");
      }

      // Cargar imágenes existentes del evento
      const loadEventImages = async () => {
        if (event?.id) {
          try {
            console.log(
              "📷 useEditEventForm - Cargando imágenes existentes del evento:",
              event.id
            );
            const eventImages = await apiEventImage.getEventImages(event.id);

            const existingImages: IImagePreview[] = eventImages.map((img) => ({
              url: apiEventImage.buildImageUrl(img.id),
              isLoading: false,
              isExisting: true,
              id: img.id,
            }));

            setImagePreviews(existingImages);
            console.log(
              "✅ useEditEventForm - Imágenes existentes cargadas:",
              existingImages.length
            );
          } catch (error) {
            console.error(
              "💥 useEditEventForm - Error cargando imágenes:",
              error
            );
            if (event.images && event.images.length > 0) {
              const fallbackImages: IImagePreview[] = event.images.map(
                (imageUrl, index) => ({
                  url: imageUrl,
                  isLoading: false,
                  isExisting: true,
                  id: index,
                })
              );
              setImagePreviews(fallbackImages);
              console.log(
                "🔄 useEditEventForm - Usando URLs de fallback:",
                fallbackImages.length
              );
            } else {
              setImagePreviews([]);
            }
          }
        } else if (event.images && event.images.length > 0) {
          console.log(
            "📷 useEditEventForm - Cargando imágenes desde URLs del evento:",
            event.images
          );
          const existingImages: IImagePreview[] = event.images.map(
            (imageUrl, index) => ({
              url: imageUrl,
              isLoading: false,
              isExisting: true,
              id: index,
            })
          );
          setImagePreviews(existingImages);
          console.log(
            "✅ useEditEventForm - Imágenes existentes cargadas:",
            existingImages.length
          );
        } else {
          console.log(
            "🗂️ useEditEventForm - No hay imágenes existentes, limpiando array"
          );
          setImagePreviews([]);
        }
      };

      loadEventImages();
      setFormErrors({});
    } else if (!show) {
      // Reiniciar el formulario cuando el modal se cierra
      setTitle("");
      setMessage("");
      setPlace("");
      setDate("");
      setLink("");
      setCapacity(0);
      setImagePreviews([]);
      setFormErrors({});
    }
  }, [event?.id, event?.images, show]);

  // Manejo de imágenes
  const handleNewImagesSelected = useCallback((files: File[] | null) => {
    if (!files) {
      console.error("handleNewImagesSelected: files es nulo");
      return;
    }

    const newImagePreviews: IImagePreview[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      isLoading: false,
      file,
      isExisting: false,
    }));

    setImagePreviews((prev) => [...prev, ...newImagePreviews]);
    console.log("Nuevas imágenes seleccionadas:", files.length);
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

  // Validación del formulario
  const validateForm = useCallback(() => {
    const errors: { [key: string]: string } = {};
    if (!title.trim()) {
      errors.title = "El título del evento es obligatorio.";
    }
    if (typeof capacity === "string" || capacity < 0) {
      errors.capacity = "El aforo debe ser un número positivo.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [title, capacity]);

  // Submit del formulario
  const submitForm = useCallback(
    async (
      onSubmit: (event: IEventDTO) => void,
      submitError: string | null
    ) => {
      if (!validateForm()) {
        return;
      }

      const sanitizedTitle = DOMPurify.sanitize(title);
      const sanitizedMessage = DOMPurify.sanitize(message);

      if (!event || typeof event.id !== "number") {
        console.error(
          "El evento original debe tener un id válido para la edición."
        );
        return;
      }

      // Combinar todas las imágenes (existentes que no se eliminaron)
      const existingImageUrls = imagePreviews
        .filter((preview) => preview.isExisting)
        .map((preview) => preview.url);

      // Nota: En esta versión simplificada, las imágenes nuevas se manejarían
      // en el componente padre o mediante otro mecanismo
      const allImages = [...existingImageUrls];

      const updatedEvent: IEventDTO = {
        ...event,
        id: event.id,
        title: sanitizedTitle,
        message: sanitizedMessage,
        place,
        eventDate: new Date(date).toISOString(),
        link,
        capacity: Number(capacity),
        images: allImages,
      };

      onSubmit(updatedEvent);
    },
    [
      validateForm,
      title,
      message,
      place,
      date,
      link,
      capacity,
      imagePreviews,
      event,
    ]
  );

  return {
    // Estados del formulario
    title,
    setTitle,
    message,
    setMessage,
    place,
    setPlace,
    date,
    setDate,
    link,
    setLink,
    capacity,
    setCapacity,
    imagePreviews,
    formErrors,

    // Funciones
    handleNewImagesSelected,
    handleRemoveImage,
    submitForm,
  };
};
