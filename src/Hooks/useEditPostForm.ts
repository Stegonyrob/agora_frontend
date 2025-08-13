import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import { PostImageRepository } from "@/core/posts/images/PostImageRepository";
import { IPostDTO } from "@/core/posts/IPostDTO";
import DOMPurify from "dompurify";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Tipo para el payload mínimo de edición de post
export type PostPayload = {
  userId: number;
  title: string;
  message: string;
  location: string;
  tags: any[];
  images: string[];
  isArchived: boolean;
  isPublished: boolean;
};

interface UseEditPostFormProps {
  post?: IPostDTO;
  show: boolean;
}

export const useEditPostForm = ({ post, show }: UseEditPostFormProps) => {
  // Estados del formulario
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imagePreviews, setImagePreviews] = useState<IImagePreview[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Estado de imágenes desde Redux
  const imagesState = useSelector((state: any) => state.images);

  // Cargar datos del post cuando se abre el modal
  useEffect(() => {
    if (show && post) {
      setTitle(post.title || "");
      setMessage(post.message || "");
      setTags(post.tags || []);

      // Formatear la fecha para mostrar en formato dd/mm/yyyy
      if (post.createdAt) {
        const dateObj = new Date(post.createdAt);
        const day = dateObj.getDate().toString().padStart(2, "0");
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObj.getFullYear();
        setDate(`${day}/${month}/${year}`);
      } else {
        setDate("");
      }

      // Cargar imágenes existentes del post como blob URLs autenticadas
      if (post.images && post.images.length > 0) {
        const loadImages = async () => {
          const repo = new PostImageRepository();
          const previews: IImagePreview[] = await Promise.all(
            post.images.map(async (img: any) => {
              if (img.id) {
                try {
                  const blobUrl = await repo.getImageAsBlob(img.id);
                  return {
                    url: blobUrl,
                    isLoading: false,
                    isExisting: true,
                    id: img.id,
                  };
                } catch (e) {
                  // Si falla, usar fallback local
                  return {
                    url: img.imageName || "",
                    isLoading: false,
                    isExisting: true,
                    id: img.id,
                  };
                }
              } else {
                return {
                  url: img.imageName || "",
                  isLoading: false,
                  isExisting: true,
                  id: img.id,
                };
              }
            })
          );
          setImagePreviews(previews);
        };
        loadImages();
      } else {
        setImagePreviews([]);
      }

      setGlobalError(null);
    } else if (!show) {
      // Reiniciar el formulario cuando el modal se cierra
      setTitle("");
      setMessage("");
      setTags([]);
      setDate("");
      setImagePreviews([]);
      setGlobalError(null);
    }
  }, [post, show]);

  // Manejo de imágenes
  // Añadir nuevas imágenes sin eliminar las existentes
  const handleImagesSelected = useCallback((files: File[]) => {
    const newImagePreviews: IImagePreview[] = files.map((file: File) => ({
      url: URL.createObjectURL(file),
      isLoading: false,
      file,
      isExisting: false,
      id: undefined,
    }));
    setImagePreviews((prev) => [...prev, ...newImagePreviews]);
    console.log("Nuevas imágenes seleccionadas:", files.length);
  }, []);

  // Eliminar imagen del preview (revoca blob si es nueva)
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
    console.log("🔐 useEditPostForm - Validando campos");

    if (!title.trim() || !message.trim()) {
      throw new Error("Título y mensaje son campos obligatorios.");
    }

    return true;
  }, [title, message]);

  // Submit del formulario
  const submitForm = useCallback(
    async (
      onSubmit: (
        post: PostPayload,
        files: File[],
        removedIds: number[]
      ) => void,
      onClose: () => void
    ) => {
      console.log("🚀 useEditPostForm - Iniciando proceso de actualización");
      if (isSubmitting) return;
      setIsSubmitting(true);
      setGlobalError(null);
      try {
        validateForm();
        const sanitizedTitle = DOMPurify.sanitize(title);
        const sanitizedMessage = DOMPurify.sanitize(message);
        if (!post || typeof post.id !== "number") {
          throw new Error(
            "El post original debe tener un id válido para la edición."
          );
        }
        // Imágenes existentes (mantener id)
        const existingImages = imagePreviews.filter(
          (preview) => preview.isExisting && preview.id
        );
        // Imágenes nuevas (files)
        const newImages = imagePreviews.filter(
          (preview) => !preview.isExisting && preview.file
        );
        // Para el payload, enviar los ids de las existentes y los nombres de los nuevos blobs (el backend debe recibir los files aparte)
        const imagesPayload = [
          ...existingImages.map((img) => img.id),
          ...newImages.map((img, idx) => `new_${idx}`), // marcador para nuevas
        ];
        // Archivos a subir
        const filesToUpload = newImages.map((img) => img.file as File);
        // TODO: ids de imágenes eliminadas si se requiere
        const removedIds: number[] = [];
        const updatedPost: PostPayload = {
          userId: post.userId,
          title: sanitizedTitle,
          message: sanitizedMessage,
          location: post.location || "",
          tags: tags,
          images: imagesPayload as any,
          isArchived: post.isArchived ?? false,
          isPublished: post.isPublished ?? true,
        };
        await onSubmit(updatedPost, filesToUpload, removedIds);
        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error desconocido al actualizar el post.";
        setGlobalError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, validateForm, title, message, tags, imagePreviews, post]
  );

  return {
    // Estados del formulario
    title,
    setTitle,
    message,
    setMessage,
    tags,
    setTags,
    date, // Solo lectura para mostrar
    imagePreviews,
    isSubmitting,
    globalError,

    // Funciones
    handleImagesSelected,
    handleRemoveImage,
    submitForm,
  };
};
