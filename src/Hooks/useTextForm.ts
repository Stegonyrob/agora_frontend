import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import { log } from "@/core/logging/LoggerService";
import { ITextItem } from "@/core/texts/ITextItem";
import TextService from "@/core/texts/TextService";
import TextImageService from "@/core/texts/images/TextImageService";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseTextFormProps {
  text?: ITextItem;
  show: boolean;
  userId?: number;
}

export const useTextForm = ({
  text,
  show,
  userId: propUserId,
}: UseTextFormProps) => {
  // Estados del formulario
  const [title, setTitle] = useState(text?.title || "");
  const [message, setMessage] = useState(text?.message || "");
  const [category, setCategory] = useState(text?.category || "");
  const [imagePreviews, setImagePreviews] = useState<IImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Datos del usuario
  const userId = propUserId || Number(sessionStorage.getItem("userId")) || 0;
  const userName = sessionStorage.getItem("userName") || "";
  const userRole = sessionStorage.getItem("role") || "";

  // Servicios memoizados para evitar recreación en cada render
  const textService = useMemo(() => new TextService(), []);
  const textImageService = useMemo(() => new TextImageService(), []);

  // Cargar imágenes existentes del texto
  useEffect(() => {
    const loadTextImages = async () => {
      if (text?.id && show) {
        try {
          // Fetch images from API using TextImageService
          const textImages = await textImageService.getImagesByTextId(text.id);
          const existingImages: IImagePreview[] = textImages.map(
            (img: any) => ({
              url: img.url || textImageService.buildImageUrl(img.imagePath),
              isLoading: false,
              isExisting: true,
              id: img.id,
            })
          );

          setImagePreviews(existingImages);
        } catch (error) {
          log.error("useTextForm - Error cargando imágenes:", error);
          setImagePreviews([]);
        }
      } else {
        setImagePreviews([]);
      }
    };

    loadTextImages();
    setGlobalError(null);
  }, [text?.id, show]);

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

  const handleRemoveImage = useCallback((identifier: string | number) => {
    const idx =
      typeof identifier === "number"
        ? identifier
        : parseInt(identifier.toString(), 10);
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
        "useTextForm - Validación fallida: El usuario no es administrador."
      );
      throw new Error("Solo los administradores pueden crear/editar textos.");
    }

    if (!title.trim() || !message.trim() || !category.trim()) {
      log.error(
        "useTextForm - Validación fallida: Campos obligatorios faltantes.",
        {
          title,
          message,
          category,
        }
      );
      throw new Error(
        "Título, descripción y categoría son campos obligatorios."
      );
    }

    return true;
  }, [title, message, category, userRole]);

  // Reset del formulario
  const resetForm = useCallback(() => {
    setTitle("");
    setMessage("");
    setCategory("");
    setImagePreviews([]);
  }, []);

  // Submit del formulario
  const submitForm = useCallback(
    async (
      onSubmit: (text: ITextItem) => Promise<void>,
      onClose: () => void
    ) => {
      if (isSubmitting) {
        log.warn(
          "useTextForm - Proceso de envío ya en curso. Abortando nuevo envío."
        );
        return;
      }

      setIsSubmitting(true);
      setGlobalError(null);

      try {
        validateForm();

        const newImageFiles: File[] = [];
        const existingImageIds: number[] = [];

        imagePreviews.forEach((preview) => {
          if (preview.file && !preview.isExisting) {
            newImageFiles.push(preview.file);
          } else if (preview.isExisting && preview.id) {
            existingImageIds.push(preview.id);
          }
        });

        // Step 1: Create or update the text
        let savedText: ITextItem;
        if (text?.id) {
          // Update existing text
          savedText = await textService.updateText(text.id, {
            userId,
            title: title.trim(),
            message: message.trim(),
            category: category.trim(),
            images: [], // Images handled separately
            name_image: text.name_image || "",
          });
        } else {
          // Create new text
          savedText = await textService.createText({
            userId,
            title: title.trim(),
            message: message.trim(),
            category: category.trim(),
            images: [], // Images handled separately
            name_image: "", // Will be updated with first image if any
          });
        }

        // Step 2: Upload new images if any
        if (newImageFiles.length > 0 && savedText.id) {
          await textImageService.uploadImagesByTextId(
            savedText.id,
            newImageFiles
          );
        }

        // Crear el objeto texto final
        const resultText: ITextItem = {
          ...savedText,
          images: [], // Images are handled separately
        };

        console.log("✅ Texto procesado exitosamente:", resultText);
        await onSubmit(resultText);

        // Emitir evento de actualización
        console.log("🔄 Emitiendo evento de actualización de texto...");
        const updateEvent = new CustomEvent("textUpdated", {
          detail: {
            textId: resultText.id,
            action: text?.id ? "edit" : "create",
          },
        });
        window.dispatchEvent(updateEvent);

        if (!text?.id) {
          resetForm();
        }

        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error desconocido al guardar el texto.";
        log.error("useTextForm - Error en el proceso de envío:", errorMessage);
        setGlobalError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      validateForm,
      imagePreviews,
      text,
      title,
      message,
      category,
      resetForm,
      textService,
      textImageService,
    ]
  );

  return {
    title,
    setTitle,
    message,
    setMessage,
    category,
    setCategory,
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
