import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import { IPost } from "@/core/posts/IPost";
import PostService from "@/core/posts/PostService";
import { RootState } from "@/redux/store";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Tipo para el payload mínimo de creación/edición de post
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

interface UsePostFormProps {
  post?: IPost;
  show: boolean;
}

export const usePostForm = ({ post, show }: UsePostFormProps) => {
  // Estados del formulario
  const [title, setTitle] = useState(post?.title || "");
  const [message, setMessage] = useState(post?.message || "");
  const [imagePreviews, setImagePreviews] = useState<IImagePreview[]>([]);
  const [tags, setTags] = useState<any[]>(post?.tags || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Datos del usuario desde Redux
  const role = useSelector((state: RootState) => state.session.role);
  const isAuthenticated = useSelector(
    (state: RootState) => state.session.isLoggedIn
  );

  // Servicio memoizado
  const apiPost = new PostService();

  // Cargar imágenes existentes del post
  useEffect(() => {
    if (post?.images && post.images.length > 0 && show) {
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
  }, [post?.images, show]);

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

  // Manejar selección de imagen desde ButtonAddImage (legacy)
  const handleImageSelected = useCallback(
    (imageSrc: string, imageTitle: string) => {
      const newPreview: IImagePreview = {
        url: imageSrc,
        isLoading: false,
        isExisting: false,
      };
      setImagePreviews((prev) => [...prev, newPreview]);
    },
    []
  );

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
    console.log("🔐 usePostForm - Validando campos");

    if (!title.trim() || !message.trim()) {
      throw new Error("Título y mensaje son campos obligatorios.");
    }

    return true;
  }, [title, message]);

  // Reset del formulario
  const resetForm = useCallback(() => {
    setTitle("");
    setMessage("");
    setImagePreviews([]);
    setTags([]);
  }, []);

  // Submit del formulario
  const submitForm = useCallback(
    async (onSubmit: (post: PostPayload) => void, onClose: () => void) => {
      console.log("🚀 usePostForm - Iniciando proceso de envío");
      if (isSubmitting) return;
      setIsSubmitting(true);
      setGlobalError(null);
      try {
        validateForm();
        // Combinar imágenes existentes y nuevas
        const allImages = imagePreviews.map((preview) => preview.url);
        // Construir el payload solo con los campos requeridos
        const postDTO: PostPayload = {
          userId: post?.userId || 0,
          title: title.trim(),
          message: message.trim(),
          location: post?.location || "",
          tags,
          images: allImages,
          isArchived: false,
          isPublished: true,
        };

        // Configurar datos de usuario si está autenticado
        if (isAuthenticated) {
          postDTO.userId = role === "admin" ? 0 : 1;
        }

        let resultPost = await apiPost.createPost(postDTO as any); // el backend espera solo los campos mínimos

        onSubmit(postDTO);

        if (!post?.id) {
          resetForm();
        }

        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error desconocido al guardar el post.";
        setGlobalError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      validateForm,
      imagePreviews,
      post,
      title,
      message,
      tags,
      isAuthenticated,
      role,
      apiPost,
      resetForm,
    ]
  );

  return {
    // Estados
    title,
    setTitle,
    message,
    setMessage,
    tags,
    setTags,
    imagePreviews,
    isSubmitting,
    globalError,

    // Funciones
    handleImagesSelected,
    handleImageSelected, // Legacy para ButtonAddImage
    handleRemoveImage,
    submitForm,
    resetForm,

    // Datos del usuario
    role,
    isAuthenticated,
  };
};
