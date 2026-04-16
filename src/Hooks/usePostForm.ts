import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import { log } from "@/core/logging/LoggerService";
import { IPost } from "@/core/posts/IPost";
import { IPostCreateDTO } from "@/core/posts/IPostBackendDTO";
import PostService from "@/core/posts/PostService";
import { PostImageService } from "@/core/posts/images/PostImageService";
import TagService from "@/core/tags/TagService";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTagsLoader } from "./useTagsLoader";
import { useTagsUpload } from "./useTagsUpload";

interface UsePostFormProps {
  post?: IPost;
  show: boolean;
  userId?: number;
}

export const usePostForm = ({
  post,
  show,
  userId: propUserId,
}: UsePostFormProps) => {
  // Estados del formulario
  const [title, setTitle] = useState(post?.title || "");
  const [message, setMessage] = useState(post?.message || "");
  const [imagePreviews, setImagePreviews] = useState<IImagePreview[]>([]);
  // Load tags as ITag[] if available, otherwise empty
  const { tags, setTags } = useTagsLoader([]);
  const tagService = useMemo(() => new TagService(), []);

  // Sincroniza el estado de tags cuando el modal se abre/cierra o cambia el post
  // - Si es creación (sin post), limpia tags al abrir
  // - Si es edición (con post), sincroniza tags con post.tags
  useEffect(() => {
    if (show) {
      if (post && Array.isArray(post.tags)) {
        // If tags are string[], fetch ITag[] from backend
        if (typeof post.tags[0] === "string") {
          // Fetch tags by post id if possible
          if (post.id) {
            // Async fetch
            (async () => {
              try {
                const fullTags = await tagService.getTagsByPost(post.id);
                setTags(fullTags);
              } catch (err) {
                log.warn(
                  "usePostForm - No se pudieron cargar tags del post",
                  err,
                );
                setTags([]);
              }
            })();
          } else {
            setTags([]);
          }
        } else {
          setTags(post.tags as any);
        }
      } else {
        setTags([]);
      }
    }
  }, [show, post, setTags, tagService]);
  const { uploadTagsToPost } = useTagsUpload();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Datos del usuario
  const userId = propUserId || Number(sessionStorage.getItem("userId")) || 0;
  const userName = sessionStorage.getItem("userName") || "";
  const userRole = sessionStorage.getItem("role") || "";

  // Servicios memoizados
  const apiPost = new PostService();
  const apiPostImage = new PostImageService();

  // Cargar imágenes existentes del Posto
  useEffect(() => {
    const loadPostImages = async () => {
      if (post?.id && show) {
        try {
          const postImages = await apiPostImage.getPostImages(post.id);
          const existingImages: IImagePreview[] = postImages.map((img) => {
            const preview: IImagePreview = {
              url: apiPostImage.buildImageUrl(img.imagePath || ""),
              isLoading: false,
              isExisting: true,
            };
            if (typeof img.id === "number") {
              preview.id = img.id;
            }
            return preview;
          });

          setImagePreviews(existingImages);
        } catch (error) {
          log.error("usePostForm - Error cargando imágenes:", error);
          if (post.images && post.images.length > 0) {
            const fallbackImages: IImagePreview[] = post.images
              .filter(
                (imageUrl): imageUrl is string => typeof imageUrl === "string",
              )
              .map((imageUrl) => ({
                url: imageUrl,
                isLoading: false,
                isExisting: true,
              }));
            setImagePreviews(fallbackImages);
          }
        }
      } else if (post?.images && post.images.length > 0) {
        const existingImages: IImagePreview[] = post.images
          .filter(
            (imageUrl): imageUrl is string => typeof imageUrl === "string",
          )
          .map((imageUrl) => ({
            url: imageUrl,
            isLoading: false,
            isExisting: true,
          }));
        setImagePreviews(existingImages);
      } else {
        setImagePreviews([]);
      }
    };

    loadPostImages();
    setGlobalError(null);
  }, [post?.id, post?.images, show]);

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

  // Validación de formulario
  const validateForm = useCallback(() => {
    if (userRole !== "ROLE_ADMIN") {
      log.error(
        "usePostForm - Validación fallida: El usuario no es administrador.",
      );
      throw new Error("Solo los administradores pueden crear/editar Postos.");
    }

    if (userId !== 1) {
      log.error(
        "usePostForm - Validación fallida: El usuario no es el administrador principal.",
      );
      throw new Error(
        "Solo el usuario administrador (ID: 1) puede crear/editar Postos.",
      );
    }

    if (!title.trim() || !message.trim()) {
      log.error(
        "usePostForm - Validación fallida: Campos obligatorios faltantes.",
        {
          title,
          message,
        },
      );
      throw new Error(
        "Título, mensaje, fecha y ubicación son campos obligatorios.",
      );
    }

    return true;
  }, [title, message, userRole, userId]);

  // Reset del formulario
  const resetForm = useCallback(() => {
    setTitle("");
    setMessage("");
    setImagePreviews([]);
    setTags([]);
  }, []);

  const getNewImageFiles = useCallback((): File[] => {
    return imagePreviews
      .filter((preview) => preview.file && !preview.isExisting)
      .map((preview) => preview.file as File);
  }, [imagePreviews]);

  const buildCreateDTO = useCallback(() => {
    const createData: IPostCreateDTO = {
      title: title.trim(),
      message: message.trim(),
      archived: false,
    };

    return {
      ...createData,
      id: 0,
      userId,
      location: "",
      loves: 0,
      comments: [],
      isArchived: false,
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        archived: tag.archived,
      })),
      images: [],
      isPublished: false,
      alt_image: "",
      source_image: "",
      alt_avatar: "",
      source_avatar: "",
      userName,
      role: userRole,
      url_avatar: "",
      updatedAt: "",
      createdAt: "",
      description: "",
    };
  }, [title, message, userId, tags, userName, userRole]);

  const createOrPreparePost = useCallback(async (): Promise<IPost> => {
    if (post?.id) {
      log.info("🔄 [usePostForm] Modo EDICIÓN detectado");
      return {
        ...post,
        id: post.id,
        title: title.trim(),
        message: message.trim(),
        tags: tags.map((tag) => tag.name),
        isArchived: false,
      };
    }

    const createDTO = buildCreateDTO();
    const resultPost = await apiPost.createPost(createDTO);

    if (resultPost.id) {
      try {
        await uploadTagsToPost(resultPost.id, tags);
      } catch (err) {
        log.error("usePostForm - Error asociando tags al Posto:", err);
      }
    }

    return resultPost;
  }, [post, title, message, tags, buildCreateDTO, apiPost, uploadTagsToPost]);

  const uploadPostImages = useCallback(
    async (postId: number, files: File[]) => {
      if (files.length === 0) return;

      try {
        await apiPostImage.uploadPostImages(postId, files);
      } catch (imageError: any) {
        log.error("usePostForm - Error subiendo imágenes:", imageError);
        setGlobalError(
          `Posto guardado, pero error subiendo imágenes: ${imageError.message}`,
        );
      }
    },
    [apiPostImage],
  );

  const refreshPostImages = useCallback(
    async (postId: number) => {
      try {
        const postImages = await apiPostImage.getPostImages(postId);
        const refreshedImages: IImagePreview[] = postImages.map((img) => ({
          url: PostImageService.buildImageUrlFromFilename(img.imageName || ""),
          isLoading: false,
          isExisting: true,
        }));
        setImagePreviews(refreshedImages);
      } catch (error) {
        log.error("usePostForm - Error recargando imágenes:", error);
      }
    },
    [apiPostImage],
  );

  // Submit del formulario
  const submitForm = useCallback(
    async (onSubmit: (post: IPost) => Promise<void>, onClose: () => void) => {
      if (isSubmitting) {
        log.warn(
          "usePostForm - Proceso de envío ya en curso. Abortando nuevo envío.",
        );
        return;
      }

      setIsSubmitting(true);
      setGlobalError(null);

      try {
        validateForm();

        const resultPost = await createOrPreparePost();
        const newImageFiles = getNewImageFiles();

        if (resultPost.id) {
          await uploadPostImages(resultPost.id, newImageFiles);
          await refreshPostImages(resultPost.id);
        }

        log.info("usePostForm - Post procesado exitosamente", {
          id: resultPost.id,
        });
        await onSubmit(resultPost);

        if (!post?.id) {
          resetForm();
        }

        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error desconocido al guardar el Posto.";
        log.error("usePostForm - Error en el proceso de envío:", errorMessage);
        setGlobalError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      validateForm,
      createOrPreparePost,
      getNewImageFiles,
      uploadPostImages,
      refreshPostImages,
      post,
      resetForm,
    ],
  );

  return {
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
    handleRemoveImage,
    submitForm,
    resetForm,

    // Datos del usuario
    userId,
    userName,
    userRole,
  };
};
