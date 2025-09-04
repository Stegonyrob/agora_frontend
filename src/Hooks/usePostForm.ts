import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import { IEventTag } from "@/core/events/IEvent";
import { IPost } from "@/core/posts/IPost";
import PostService from "@/core/posts/PostService";
import { PostImageService } from "@/core/posts/images/PostImageService";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTagsLoader } from "./useTagsLoader";
import { useTagsUploadPost } from "./useTagsUploadPost";

// Tipo para la creación/edición de post SIN tags (siguiendo SRP)
export type PostCreatePayload = {
  title: string;
  message: string;
  archived: boolean;
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

  // Usar el hook especializado para tags (SRP)
  // Normalizar tags del post para usar con useTagsLoader
  const normalizedPostTags: IEventTag[] = post?.tags
    ? post.tags.map((tag: any) =>
        typeof tag === "string"
          ? { id: -1, name: tag, archived: false }
          : {
              id: tag.id || -1,
              name: tag.name,
              archived: tag.archived ?? false,
            }
      )
    : [];

  const { tags, setTags } = useTagsLoader(normalizedPostTags);
  const { uploadTagsToPost } = useTagsUploadPost();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Ref para evitar llamadas duplicadas
  const submissionRef = useRef<boolean>(false);

  // Servicios memoizados
  const apiPost = new PostService();
  const apiPostImage = new PostImageService();

  useEffect(() => {
    if (show) {
      if (post?.images && post.images.length > 0) {
        const existingImages: IImagePreview[] = post.images.map(
          (image: any, index: number) => ({
            url:
              typeof image === "string" ? image : image.imagePath || image.url,
            isLoading: false,
            isExisting: true,
            id: typeof image === "object" ? image.id : index,
          })
        );
        setImagePreviews(existingImages);
      } else {
        setImagePreviews([]);
      }
      setGlobalError(null);
    }
  }, [post?.images, show]);

  const handleImagesSelected = useCallback((files: File[]) => {
    const newPreviews: IImagePreview[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      isLoading: false,
      file: file,
      isExisting: false,
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
  }, []);

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

  const handleRemoveImage = useCallback((idx: number | string) => {
    const index = typeof idx === "number" ? idx : Number(idx);
    setImagePreviews((prev) => {
      const imageToRemove = prev[index];
      if (
        imageToRemove?.url &&
        !imageToRemove.isExisting &&
        imageToRemove.file
      ) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const validateForm = useCallback(() => {
    if (!title.trim() || !message.trim()) {
      throw new Error("Título y mensaje son campos obligatorios.");
    }

    return true;
  }, [title, message]);

  const resetForm = useCallback(() => {
    setTitle("");
    setMessage("");
    setImagePreviews([]);
    setTags([]);
  }, []);

  const submitForm = useCallback(
    async (onSubmit: (post: IPost) => void, onClose: () => void) => {
      if (isSubmitting || submissionRef.current) {
        return;
      }

      submissionRef.current = true;
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

        let resultPost: IPost;

        if (post?.id) {
          // Para actualización, creamos un DTO completo basado en el post existente
          const updateData: any = {
            ...post,
            title: title.trim(),
            message: message.trim(),
            archived: false,
            updatedAt: new Date().toISOString(),
            description: post.description || "",
            location: post.location || "",
            loves: post.loves || 0,
            comments: post.comments || [],
            isArchived: false,
            isPublished: true,
            alt_image: post.alt_image || "",
            source_image: post.source_image || "",
            alt_avatar: post.alt_avatar || "",
            source_avatar: post.source_avatar || "",
            userName: post.userName || "",
            role: post.role || "",
            url_avatar: post.url_avatar || "",
            tags: [],
            images: [],
          };
          resultPost = await apiPost.updatePost(post.id, updateData);

          if (resultPost.id) {
            await uploadTagsToPost(resultPost.id, tags);

            // 🔄 REFRESCAR POST ACTUALIZADO para obtener tags actualizadas
            if (tags.length > 0) {
              try {
                console.log("🔄 Refrescando post actualizado desde backend...");
                resultPost = await apiPost.getPostById(resultPost.id);
                console.log(
                  "✅ Post actualizado refrescado con tags:",
                  resultPost
                );
              } catch (refreshError) {
                console.warn(
                  "⚠️ Error al refrescar post actualizado:",
                  refreshError
                );
              }
            }
          }
        } else {
          // Para creación, creamos un DTO mínimo con los campos requeridos
          const createData: any = {
            id: 0, // Se asignará en el backend
            title: title.trim(),
            message: message.trim(),
            userId: parseInt(sessionStorage.getItem("userId") || "0"),
            location: "",
            loves: 0,
            comments: [],
            isArchived: false,
            isPublished: true,
            alt_image: "",
            source_image: "",
            alt_avatar: "",
            source_avatar: "",
            userName: sessionStorage.getItem("userEmail") || "",
            role: sessionStorage.getItem("role") || "",
            url_avatar: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            description: "",
            tags: [],
            images: [],
          };
          resultPost = await apiPost.createPost(createData);

          if (resultPost.id) {
            // Para posts nuevos, usar isNewPost = true para evitar eliminar tags inexistentes
            await uploadTagsToPost(resultPost.id, tags, true);
          }
        }

        if (newImageFiles.length > 0 && resultPost.id) {
          try {
            await apiPostImage.uploadPostImages(resultPost.id, newImageFiles);
          } catch (imageError: any) {
            console.error(`Error subiendo imágenes: ${imageError.message}`);
            setGlobalError(
              `Post guardado, pero error subiendo imágenes: ${imageError.message}`
            );
          }
        }

        // 🔄 REFRESCAR POST DESDE BACKEND para obtener tags e imágenes actualizadas
        if (
          resultPost.id &&
          (!post?.id || newImageFiles.length > 0 || tags.length > 0)
        ) {
          try {
            console.log(
              "🔄 Refrescando post desde backend para obtener datos completos..."
            );
            resultPost = await apiPost.getPostById(resultPost.id);
            console.log("✅ Post refrescado con datos completos:", resultPost);
          } catch (refreshError) {
            console.warn(
              "⚠️ Error al refrescar post, usando datos parciales:",
              refreshError
            );
          }
        }

        await onSubmit(resultPost);

        if (!post?.id) {
          resetForm();
        }

        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error desconocido al guardar el post.";
        console.error(`Error en el proceso de envío: ${errorMessage}`);
        setGlobalError(errorMessage);
      } finally {
        submissionRef.current = false;
        setIsSubmitting(false);
      }
    },
    [
      post,
      imagePreviews,
      tags,
      title,
      message,
      isSubmitting,
      validateForm,
      apiPost,
      apiPostImage,
      uploadTagsToPost,
      resetForm,
    ]
  );

  return {
    title,
    setTitle,
    message,
    setMessage,
    imagePreviews,
    tags,
    setTags,
    isSubmitting,
    globalError,

    // Funciones
    handleImagesSelected,
    handleImageSelected,
    handleRemoveImage,
    submitForm,
    resetForm,
  };
};
