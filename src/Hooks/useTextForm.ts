import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import { log } from "@/core/logging/LoggerService";
import { ITextItem } from "@/core/texts/ITextItem";
import { useCallback, useEffect, useState } from "react";

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

  // Cargar imágenes existentes del texto
  useEffect(() => {
    const loadTextImages = async () => {
      if (text?.images && show) {
        try {
          const existingImages: IImagePreview[] = [];

          if (Array.isArray(text.images)) {
            text.images.forEach((img: any) => {
              existingImages.push({
                url: img.url || img,
                isLoading: false,
                isExisting: true,
              });
            });
          }

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
  }, [text?.images, show]);

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
        const existingImageUrls: string[] = [];

        imagePreviews.forEach((preview) => {
          if (preview.file && !preview.isExisting) {
            newImageFiles.push(preview.file);
          } else if (preview.isExisting) {
            existingImageUrls.push(preview.url);
          }
        });

        // Crear el objeto texto con los datos del formulario
        const resultText: ITextItem = {
          id: text?.id || 0,
          title: title.trim(),
          message: message.trim(),
          category: category.trim(),
          images: [], // TODO: Implementar manejo de imágenes para textos
          name_image: text?.name_image || "",
          createdAt: text?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        console.log("✅ Texto procesado exitosamente:", resultText);
        await onSubmit(resultText);

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
