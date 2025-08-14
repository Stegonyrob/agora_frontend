import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import { PostImageRepository } from "@/core/posts/images/PostImageRepository";
import { IPostDTO } from "@/core/posts/IPostDTO";
import DOMPurify from "dompurify";
import { useCallback, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

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
  const [title, setTitle] = useState(post?.title || "");
  const [message, setMessage] = useState(post?.message || "");
  const [imagePreviews, setImagePreviews] = useState<IImagePreview[]>([]);
  const [tags, setTags] = useState(post?.tags || []);
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Estado para ids de imágenes existentes eliminadas
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

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
            post.images.map(async (img: any, idx: number) => {
              console.info(
                `[useEditPostForm][GET] Procesando imagen[${idx}]:`,
                img
              );

              // Generar un identificador único y estable para cada imagen del post
              const identifier =
                img.id && typeof img.id === "number" ? img.id : img.imageName;

              try {
                if (typeof img.id === "number" && img.id > 0) {
                  const blobUrl = await repo.getImageAsBlob(img.id);
                  console.info(
                    `[useEditPostForm][GET] Blob cargado para id=${img.id}:`,
                    blobUrl
                  );
                  return {
                    url: blobUrl,
                    isLoading: false,
                    isExisting: true,
                    id: img.id,
                  };
                } else {
                  console.info(
                    `[useEditPostForm][GET] Usando fallback local para imagen sin id:`,
                    img.imageName
                  );
                  return {
                    url: `/images/posts/${img.imageName}`,
                    isLoading: false,
                    isExisting: true,
                    id: identifier as string,
                  };
                }
              } catch (e) {
                console.warn(
                  `[useEditPostForm][GET] Error cargando blob para id=${img.id}:`,
                  e
                );
                return {
                  url: `/images/posts/${img.imageName}`,
                  isLoading: false,
                  isExisting: true,
                  id: identifier as string,
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
      setGlobalError(null);
    }
  }, [post, show]);

  // Actualizar el estado de imagePreviews con el blob URL correcto después de la carga exitosa de imágenes nuevas.
  const handleImageUploadSuccess = useCallback(
    (tempId: string, newBlobUrl: string) => {
      setImagePreviews((prev) => {
        return prev.map((preview) => {
          if (preview.tempId === tempId) {
            console.info(
              `[useEditPostForm] Actualizando URL de imagen para tempId=${tempId}`
            );
            return {
              ...preview,
              url: newBlobUrl,
            };
          }
          return preview;
        });
      });
    },
    []
  );

  // Añadir nuevas imágenes sin eliminar las existentes
  const handleImagesSelected = useCallback(
    (files: File[]) => {
      const newImagePreviews: IImagePreview[] = files.map((file: File) => {
        const tempId = uuidv4();
        return {
          url: URL.createObjectURL(file),
          isLoading: true,
          file,
          isExisting: false,
          tempId,
        };
      });
      console.info(
        "[useEditPostForm] Nuevas imágenes procesadas:",
        newImagePreviews
      );
      setImagePreviews((prev) => [...prev, ...newImagePreviews]);

      // Simular carga exitosa desde el backend
      newImagePreviews.forEach((preview) => {
        setTimeout(() => {
          const newBlobUrl = `/images/posts/${preview.file?.name}`; // Simular URL final
          handleImageUploadSuccess(preview.tempId!, newBlobUrl);
        }, 2000); // Simular retraso de carga
      });
    },
    [handleImageUploadSuccess]
  );

  // Eliminar imagen del preview (por id o tempId)
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
        const imgId = imgToRemove.id;
        setRemovedImageIds((ids) =>
          ids.includes(imgId) ? ids : [...ids, imgId]
        );
      }
      console.info(
        "[useEditPostForm] Imagen eliminada:",
        identifier,
        imgToRemove
      );
      return prev.filter((img) =>
        img.isExisting ? img.id !== identifier : img.tempId !== identifier
      );
    });
  }, []);

  // Validación del formulario
  const validateForm = useCallback(() => {
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
      console.info("[useEditPostForm] Iniciando submit de edición de post");
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
        const existingImages = imagePreviews.filter(
          (preview) => preview.isExisting && preview.id
        );
        const newImages = imagePreviews.filter(
          (preview) => !preview.isExisting && preview.file
        );
        const imagesPayload = [
          ...existingImages.map((img) => {
            const postImagesArr = Array.isArray(post.images)
              ? post.images.filter(
                  (i: any) => typeof i === "object" && i !== null
                )
              : [];
            const found = postImagesArr.find((i: any) => i.id === img.id);
            let imageName = "";
            let mainImage = false;
            if (found && typeof found === "object") {
              imageName = (found as any).imageName || "";
              mainImage = (found as any).mainImage ?? false;
            }
            return {
              id: img.id,
              imageName,
              postId: post.id,
              mainImage,
            };
          }),
          ...newImages.map((img, idx) => ({
            imageName: img.file?.name || `new_${idx}`,
            isMainImage: false,
            postId: post.id,
          })),
        ];
        const filesToUpload = newImages.map((img) => img.file as File);
        const removedIds: number[] = removedImageIds;
        const updatedPost: PostPayload & { id: number } = {
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
        const result = await onSubmit(updatedPost, filesToUpload, removedIds);
        if (typeof result !== "undefined") {
          console.info(
            "[useEditPostForm][PUT] Respuesta backend tras submit:",
            result
          );
        } else {
          console.warn(
            "[useEditPostForm][PUT] Respuesta backend no definida tras submit."
          );
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
