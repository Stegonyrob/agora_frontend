import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
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

      // Cargar imágenes existentes del post
      if (post.images && post.images.length > 0) {
        const existingImages: IImagePreview[] = post.images.map(
          (imageUrl: string, index: number) => ({
            url: imageUrl,
            isLoading: false,
            isExisting: true,
            id: index,
          })
        );
        setImagePreviews(existingImages);
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
  const handleImagesSelected = useCallback((files: File[]) => {
    const newImagePreviews: IImagePreview[] = files.map((file: File) => ({
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
    console.log("🔐 useEditPostForm - Validando campos");

    if (!title.trim() || !message.trim()) {
      throw new Error("Título y mensaje son campos obligatorios.");
    }

    return true;
  }, [title, message]);

  // Submit del formulario
  const submitForm = useCallback(
    async (onSubmit: (post: PostPayload) => void, onClose: () => void) => {
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

        // Combinar imágenes existentes y nuevas
        const existingImageUrls = imagePreviews
          .filter((preview) => preview.isExisting)
          .map((preview) => preview.url);

        const newImageUrls = imagesState.images
          .map((img: any) => img.url)
          .filter((url: string) => url && url.length > 0);

        const allImages = [...existingImageUrls, ...newImageUrls];

        const updatedPost: PostPayload = {
          userId: post.userId,
          title: sanitizedTitle,
          message: sanitizedMessage,
          location: post.location || "",
          tags: tags, // array de objetos {id, name, archived}
          images: allImages,
          isArchived: post.isArchived ?? false,
          isPublished: post.isPublished ?? true,
        };

        await onSubmit(updatedPost);
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
    [
      isSubmitting,
      validateForm,
      title,
      message,
      tags,
      imagePreviews,
      imagesState,
      post,
    ]
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
