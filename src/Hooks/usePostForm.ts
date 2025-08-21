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

  // Sincronizar tags cuando cambia el post o se abre/cierra el modal
  useEffect(() => {
    console.log(
      "%cUSE EFFECT SINCRONIZANDO TAGS (POST):",
      "color: #9c27b0; font-weight: bold; background: #222; padding:2px 6px; border-radius:3px;",
      { show, post: post?.id, postTags: post?.tags, tagsState: tags }
    );
    if (show) {
      if (post && Array.isArray(post.tags)) {
        console.log(
          "%cSETTING TAGS FROM POST:",
          "color: #9c27b0; font-weight: bold;",
          post.tags
        );
        // Normalizar las tags antes de asignar
        const normalizedTags: IEventTag[] = post.tags.map((tag: any) =>
          typeof tag === "string"
            ? { id: -1, name: tag, archived: false }
            : {
                id: tag.id || -1,
                name: tag.name,
                archived: tag.archived ?? false,
              }
        );
        setTags(normalizedTags);
      } else if (!post) {
        console.log(
          "%cCLEARING TAGS FOR NEW POST:",
          "color: #9c27b0; font-weight: bold;"
        );
        setTags([]);
      }
    }
  }, [show, post, setTags]);

  // Cargar imágenes existentes del post
  useEffect(() => {
    if (post?.images && post.images.length > 0 && show) {
      const existingImages: IImagePreview[] = post.images.map(
        (image: any, index: number) => ({
          url: typeof image === "string" ? image : image.imagePath || image.url,
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
    async (onSubmit: (post: IPost) => void, onClose: () => void) => {
      const sessionId = Date.now(); // ID único para rastrear esta sesión
      console.log(
        `🚀 [${sessionId}] usePostForm - Iniciando proceso de envío`,
        {
          title,
          message,
          tags,
          imagesCount: imagePreviews.length,
          isSubmitting,
          submissionRef: submissionRef.current,
        }
      );

      if (isSubmitting || submissionRef.current) {
        console.warn(
          `⚠️ [${sessionId}] Proceso de envío ya en curso. Abortando nuevo envío.`
        );
        return;
      }

      submissionRef.current = true;
      setIsSubmitting(true);
      setGlobalError(null);

      try {
        console.log(`🔐 [${sessionId}] Validando formulario...`);
        validateForm();

        // Separar imágenes nuevas de las existentes
        const newImageFiles: File[] = [];
        const existingImageUrls: string[] = [];

        imagePreviews.forEach((preview) => {
          if (preview.file && !preview.isExisting) {
            newImageFiles.push(preview.file);
          } else if (preview.isExisting) {
            existingImageUrls.push(preview.url);
          }
        });

        console.log(`📷 [${sessionId}] Imágenes procesadas:`, {
          newImageFiles: newImageFiles.length,
          existingImageUrls: existingImageUrls.length,
        });

        // Debug: Seguimiento de tags antes de crear el payload
        console.log(`🐞 [${sessionId}] Estado de tags antes de payload:`, tags);
        let resultPost: IPost;

        if (post?.id) {
          // Actualizar post existente SIN tags (SRP)
          const updateData: PostCreatePayload = {
            title: title.trim(),
            message: message.trim(),
            archived: false,
          };
          console.log(
            `🐞 [${sessionId}] Payload de actualización de post (SIN tags):`,
            updateData
          );
          resultPost = await apiPost.updatePost(post.id, updateData as any);

          // Asociar tags después de actualizar (SRP)
          if (resultPost.id) {
            console.log(
              `🏷️ [${sessionId}] TAGS EN usePostForm ANTES DE SUBMIT (UPDATE POST):`,
              tags
            );
            try {
              await uploadTagsToPost(resultPost.id, tags);
              console.log(
                `✅ [${sessionId}] TAGS ASOCIADAS (UPDATE POST):`,
                tags
              );
            } catch (err) {
              console.error(
                `❌ [${sessionId}] Error asociando tags al post:`,
                err
              );
            }
          }
          console.log(
            `✅ [${sessionId}] Post actualizado con ID:`,
            resultPost.id
          );
        } else {
          // Crear nuevo post SIN tags (SRP)
          const createData: PostCreatePayload = {
            title: title.trim(),
            message: message.trim(),
            archived: false,
          };
          console.log(
            `🐞 [${sessionId}] Payload de creación de post (SIN tags):`,
            createData
          );
          resultPost = await apiPost.createPost(createData as any);

          // Asociar tags después de crear (SRP)
          if (resultPost.id) {
            console.log(
              `🏷️ [${sessionId}] TAGS EN usePostForm ANTES DE SUBMIT (CREATE POST):`,
              tags
            );
            try {
              await uploadTagsToPost(resultPost.id, tags);
              console.log(
                `✅ [${sessionId}] TAGS ASOCIADAS (CREATE POST):`,
                tags
              );
            } catch (err) {
              console.error(
                `❌ [${sessionId}] Error asociando tags al post:`,
                err
              );
            }
          }
          console.log(`✅ [${sessionId}] Post creado con ID:`, resultPost.id);
        }

        // Subir imágenes si las hay
        if (newImageFiles.length > 0 && resultPost.id) {
          try {
            console.log(
              `📤 [${sessionId}] Subiendo nuevas imágenes:`,
              newImageFiles.length
            );
            await apiPostImage.uploadPostImages(resultPost.id, newImageFiles);

            // Refrescar el post para obtener las imágenes actualizadas
            console.log(
              `🔄 [${sessionId}] Refrescando post después de subir imágenes...`
            );
            resultPost = await apiPost.getPostById(resultPost.id);
            console.log(
              `✅ [${sessionId}] Imágenes subidas y post actualizado`
            );
          } catch (imageError: any) {
            console.error(
              `💥 [${sessionId}] Error subiendo imágenes:`,
              imageError
            );
            setGlobalError(
              `Post guardado, pero error subiendo imágenes: ${imageError.message}`
            );
          }
        }

        console.log(
          `✅ [${sessionId}] Post procesado exitosamente:`,
          resultPost
        );
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
        console.error(
          `💥 [${sessionId}] Error en el proceso de envío:`,
          errorMessage
        );
        setGlobalError(errorMessage);
      } finally {
        console.log(`🏁 [${sessionId}] Finalizando proceso de envío`);
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
