import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import { IPostImageDTO } from "@/core/posts/images/IPostImageDTO"; // Asegúrate de importar IPostImageDTO
import { PostImageRepository } from "@/core/posts/images/PostImageRepository";
import PostImageService from "@/core/posts/images/PostImageService";
import { IPostDTO } from "@/core/posts/IPostDTO";
import DOMPurify from "dompurify";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Tipo para el payload mínimo de edición de post
export type PostPayload = {
  userId: number;
  title: string;
  message: string;
  location: string;
  tags: any[];
  images: IPostImageDTO[]; // Cambiar a IPostImageDTO[]
  isArchived: boolean;
  isPublished: boolean;
};

interface UseEditPostFormProps {
  post?: IPostDTO;
  show: boolean;
}

export const useEditPostForm = ({ post, show }: UseEditPostFormProps) => {
  const [title, setTitle] = useState(post?.title || "");
  const [message, setMessage] = useState(post?.message || "");
  const [imagePreviews, setImagePreviews] = useState<IImagePreview[]>([]);
  const [tags, setTags] = useState(post?.tags || []);
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const postImageService = new PostImageService();
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

  useEffect(() => {
    if (show && post) {
      setTitle(post.title || "");
      setMessage(post.message || "");
      setTags(post.tags || []);
      setRemovedImageIds([]);

      if (post.createdAt) {
        const dateObj = new Date(post.createdAt);
        const day = dateObj.getDate().toString().padStart(2, "0");
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObj.getFullYear();
        setDate(`${day}/${month}/${year}`);
      } else {
        setDate("");
      }

      if (post.images && post.images.length > 0) {
        const loadImages = async () => {
          const repo = new PostImageRepository();
          const previews: IImagePreview[] = await Promise.all(
            post.images.map(async (img: IPostImageDTO, idx: number) => {
              // Usar IPostImageDTO
              const identifier =
                img.id && typeof img.id === "number" ? img.id : img.imageName;
              try {
                if (typeof img.id === "number" && img.id > 0) {
                  const blobUrl = await repo.getImageAsBlob(img.id);
                  return {
                    url: blobUrl,
                    isLoading: false,
                    isExisting: true,
                    id: img.id,
                  };
                } else {
                  return {
                    url: `/images/posts/${img.imageName}`,
                    isLoading: false,
                    isExisting: true,
                    tempId: uuidv4(), // Usar tempId para imágenes sin id numérico
                  };
                }
              } catch (e) {
                return {
                  url: `/images/posts/${img.imageName}`,
                  isLoading: false,
                  isExisting: true,
                  tempId: uuidv4(), // Usar tempId para imágenes con error
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
      setTitle("");
      setMessage("");
      setTags([]);
      setDate("");
      setImagePreviews([]);
      setRemovedImageIds([]);
      setGlobalError(null);
    }
  }, [post, show]);

  const handleImagesSelected = useCallback((files: File[]) => {
    const newImagePreviews: IImagePreview[] = files.map((file: File) => {
      const tempId = uuidv4();
      return {
        url: URL.createObjectURL(file),
        isLoading: false,
        file,
        isExisting: false,
        tempId,
      };
    });
    setImagePreviews((prev) => [...prev, ...newImagePreviews]);
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
        setRemovedImageIds((ids) =>
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

  const validateForm = useCallback(() => {
    if (!title.trim() || !message.trim()) {
      throw new Error("Título y mensaje son campos obligatorios.");
    }
    return true;
  }, [title, message]);

  const submitForm = useCallback(
    async (
      onSubmit: (
        post: PostPayload & { id: number },
        files: File[],
        removedIds: number[]
      ) => void,
      onClose: () => void
    ) => {
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

        const filesToUpload = imagePreviews
          .filter((preview) => !preview.isExisting && preview.file)
          .map((img) => img.file as File);
        const removedIds: number[] = removedImageIds;

        let uploadedNewImages: any[] = [];
        if (filesToUpload.length > 0) {
          try {
            uploadedNewImages = await postImageService.uploadPostImages(
              post.id,
              filesToUpload
            );
          } catch (uploadError) {
            console.error("Error al subir imágenes nuevas:", uploadError);
            throw new Error("Ocurrió un error al subir las imágenes.");
          }
        }

        const finalImagesPayload = imagePreviews
          .filter(
            (img) =>
              img.isExisting &&
              typeof img.id === "number" &&
              !removedIds.includes(img.id)
          )
          .map((img) => {
            const postImage = post.images.find((i: any) => i.id === img.id);
            return {
              id: img.id,
              imageName: postImage?.imageName || "",
              postId: post.id,
              mainImage: postImage?.mainImage ?? false,
            };
          });

        const newImagesPayload = uploadedNewImages.map((img) => ({
          id: img.id,
          imageName: img.imageName,
          postId: post.id,
          mainImage: false,
        }));

        const imagesPayload = [...finalImagesPayload, ...newImagesPayload];

        const updatedPost = {
          id: post.id,
          userId: post.userId,
          title: sanitizedTitle,
          message: sanitizedMessage,
          location: post.location || "",
          tags: tags,
          images: imagesPayload as any,
          isArchived: post.isArchived ?? false,
          isPublished: post.isPublished ?? true,
        };

        console.info("[useEditPostForm][PUT] Payload enviado:", updatedPost);

        await onSubmit(updatedPost, filesToUpload, removedIds);

        if (removedIds.length > 0) {
          try {
            console.info(
              "[useEditPostForm] Borrando imágenes existentes:",
              removedIds
            );
            // ¡CORRECCIÓN AQUÍ! Llama a la función correcta en un bucle
            const deletePromises = removedIds.map((id) =>
              postImageService.deletePostImage(id)
            );
            await Promise.all(deletePromises);
          } catch (deleteError) {
            console.error("Error al borrar imágenes existentes:", deleteError);
          }
        }

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
      post,
      removedImageIds,
    ]
  );

  return {
    title,
    setTitle,
    message,
    setMessage,
    tags,
    setTags,
    date,
    imagePreviews,
    isSubmitting,
    globalError,
    handleImagesSelected,
    handleRemoveImage,
    submitForm,
    removedImageIds,
  };
};
