import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import { IEventDTO } from "@/core/events/IEventDTO";
import { EventImageService } from "@/core/events/images/EventImageService";
import { IEventImage } from "@/core/events/images/IEventImage";
import DOMPurify from "dompurify";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface UseEditEventFormProps {
  event?: IEventDTO;
  show: boolean;
  onClose: () => void; // Agregado onClose aquí
}

export const useEditEventForm = ({
  event,
  show,
  onClose,
}: UseEditEventFormProps) => {
  // Estados del formulario
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(""); // Agregar estado para el tiempo
  const [link, setLink] = useState("");
  const [capacity, setCapacity] = useState<number | string>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<IImagePreview[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Servicio memoizado
  const apiEventImage = new EventImageService();

  // Cargar datos del evento cuando se abre el modal
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Usar el EventImageService para obtener las imágenes con URLs procesadas
        const imagesWithUrls = await apiEventImage.getEventImagesWithUrls(
          event!.id!,
          true // contexto admin
        );

        const previews: IImagePreview[] = imagesWithUrls.map(
          (img: IEventImage) => ({
            url: img.url || "", // EventImageService ya procesa las URLs
            isLoading: false,
            isExisting: true,
            id: img.id || undefined,
            tempId: img.id ? undefined : uuidv4(),
          })
        );

        setImagePreviews(previews);
      } catch (error) {
        console.error("Error cargando imágenes:", error);
        setImagePreviews([]);
      }
    };

    if (show && event) {
      setTitle(event.title || "");
      setMessage(event.message || "");
      setPlace(event.place || "");
      setCapacity(event.capacity || 0);
      setLink(event.link || "");
      setTags(event.tags || []);
      setImagesToDelete([]);

      if (event.eventDate) {
        try {
          const eventDateObj = new Date(event.eventDate);
          if (!isNaN(eventDateObj.getTime())) {
            const formattedDate = eventDateObj.toISOString().split("T")[0];
            const formattedTime = eventDateObj.toTimeString().split(" ")[0]; // Extraer el tiempo
            setDate(formattedDate);
            setTime(formattedTime); // Establecer el tiempo
          } else {
            console.warn("Fecha del evento inválida:", event.eventDate);
            setDate("");
            setTime(""); // Reiniciar el tiempo
          }
        } catch (error) {
          console.error("Error al procesar fecha del evento:", error);
          setDate("");
          setTime(""); // Reiniciar el tiempo
        }
      } else {
        setDate("");
        setTime(""); // Reiniciar el tiempo
      }

      if (event.images && event.images.length > 0) {
        loadImages();
      } else {
        setImagePreviews([]);
      }
      setGlobalError(null);
    } else if (!show) {
      // Reiniciar el formulario cuando el modal se cierra
      setTitle("");
      setMessage("");
      setPlace("");
      setDate("");
      setTime(""); // Reiniciar el tiempo
      setLink("");
      setCapacity(0);
      setTags([]);
      setImagePreviews([]);
      setImagesToDelete([]);
      setFormErrors({});
    }
  }, [event, show]);

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

  const handleRemoveImage = useCallback((identifier: number | string) => {
    setImagePreviews((prev) => {
      const imgToRemove = prev.find((img) =>
        img.isExisting ? img.id === identifier : img.tempId === identifier
      );
      if (
        imgToRemove &&
        imgToRemove.isExisting &&
        typeof imgToRemove.id === "number"
      ) {
        setImagesToDelete((ids) =>
          ids.includes(imgToRemove.id as number)
            ? ids
            : [...ids, imgToRemove.id as number]
        );
      }
      return prev.filter((img) =>
        img.isExisting ? img.id !== identifier : img.tempId !== identifier
      );
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
    if (!date || !date.trim()) {
      errors.date = "La fecha del evento es obligatoria.";
    } else {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        errors.date = "La fecha del evento no es válida.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [title, capacity, date]);

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

      try {
        // 1. Eliminar imágenes marcadas para borrado
        if (imagesToDelete.length > 0) {
          console.log(`🗑️ Eliminando ${imagesToDelete.length} imágenes...`);
          const deletePromises = imagesToDelete.map((imageId) =>
            apiEventImage.deleteEventImage(imageId)
          );
          await Promise.all(deletePromises);
          console.log("✅ Imágenes eliminadas exitosamente");
        }

        // 2. Subir nuevas imágenes si las hay
        const newImageFiles = imagePreviews
          .filter((preview) => !preview.isExisting && preview.file)
          .map((preview) => preview.file!);

        let uploadedNewImages: IEventImage[] = [];
        if (newImageFiles.length > 0) {
          console.log(`📤 Subiendo ${newImageFiles.length} nuevas imágenes...`);
          uploadedNewImages = await apiEventImage.uploadEventImages(
            event.id,
            newImageFiles
          );
          console.log("✅ Nuevas imágenes subidas exitosamente");
        }

        // 3. Construir payload de imágenes
        const finalImagesPayload = imagePreviews
          .filter(
            (img) =>
              img.isExisting &&
              typeof img.id === "number" &&
              !imagesToDelete.includes(img.id)
          )
          .map((img) => {
            const eventImage = event.images.find((i: any) => i.id === img.id);
            return {
              id: img.id,
              imageName: eventImage?.imageName || "",
              eventId: event.id,
            };
          });

        const newImagesPayload = uploadedNewImages.map((img) => ({
          id: img.id || undefined,
          imageName: img.imageName,
          eventId: event.id,
        }));

        const imagesPayload = [...finalImagesPayload, ...newImagesPayload];

        // 4. Actualizar el evento
        const updatedEvent: IEventDTO = {
          ...event,
          id: event.id,
          title: sanitizedTitle,
          message: sanitizedMessage,
          place,
          eventDate: `${new Date(date).toISOString().split("T")[0]}T${time}`, // Combinar fecha y tiempo
          eventTime: time, // Agregar el campo eventTime
          link,
          capacity: Number(capacity),
          tags,
          images: imagesPayload as any, // Use 'as any' like in posts
        };

        console.log("📝 Actualizando datos del evento...");
        onSubmit(updatedEvent);
        console.log("✅ Evento actualizado exitosamente");
        onClose(); // Close the modal after successful update
      } catch (error) {
        console.error("❌ Error al actualizar el evento:", error);
        throw error;
      }
    },
    [
      validateForm,
      title,
      message,
      place,
      date,
      time,
      link,
      capacity,
      tags,
      imagePreviews,
      event,
      imagesToDelete,
      apiEventImage,
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
    time,
    setTime,
    link,
    setLink,
    capacity,
    setCapacity,
    tags,
    setTags,
    imagePreviews,
    formErrors,

    // Funciones
    handleNewImagesSelected,
    handleRemoveImage,
    submitForm,
    globalError,
  };
};
