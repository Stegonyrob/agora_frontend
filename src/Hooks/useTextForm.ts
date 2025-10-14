import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import { log } from "@/core/logging/LoggerService";
import { IText } from "@/core/texts/IText";
import TextService from "@/core/texts/TextService";
import TextImageService from "@/core/texts/images/TextImageService";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseTextFormProps {
  text?: IText;
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
    async (onSubmit: (text: IText) => Promise<void>, onClose: () => void) => {
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

        // Preparar datos del texto (sin llamar al API en edición)
        let savedText: IText;
        if (text?.id) {
          log.info("🔄 [useTextForm] Modo EDICIÓN detectado");

          // EDICIÓN: Preparar datos del texto actualizado (SIN llamar al API)
          // El API se llama desde el componente padre (AdminTextView)
          savedText = {
            ...text,
            id: text.id,
            title: title.trim(),
            message: message.trim(),
            category: category.trim(),
            images: [], // Images handled separately
          };
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
        const resultText: IText = {
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
      } catch (error: any) {
        let errorMessage = "Error desconocido al guardar el texto.";

        // 🔍 MANEJO ESPECÍFICO DE ERRORES
        if (error?.response?.status === 500) {
          errorMessage = `El texto no se pudo actualizar porque no existe en el servidor. Esto puede suceder si el texto fue eliminado o no se creó correctamente.`;
          log.error(
            "useTextForm - Error 500: Texto no encontrado en backend:",
            error
          );
        } else if (error?.response?.status === 400) {
          errorMessage =
            "Los datos del texto no son válidos. Por favor, revisa la información ingresada.";
          log.error("useTextForm - Error 400: Datos inválidos:", error);
        } else if (error?.response?.status === 401) {
          errorMessage =
            "No tienes permisos para realizar esta acción. Por favor, inicia sesión nuevamente.";
          log.error("useTextForm - Error 401: No autorizado:", error);
        } else if (error?.response?.status === 403) {
          errorMessage =
            "No tienes permisos suficientes para editar este texto.";
          log.error("useTextForm - Error 403: Prohibido:", error);
        } else if (error?.response?.status === 404) {
          errorMessage = "El texto no fue encontrado en el servidor.";
          log.error("useTextForm - Error 404: Texto no encontrado:", error);
        } else if (error instanceof Error) {
          errorMessage = error.message;
          log.error("useTextForm - Error conocido:", error.message);
        } else {
          log.error("useTextForm - Error desconocido:", error);
        }

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
