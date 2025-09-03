import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import { ITextItemDTO } from "@/core/texts/ITextItemDTO";
import { ITextImageDTO } from "@/core/texts/images/ITextImageDTO";
import TextImageService from "@/core/texts/images/TextImageService";
import DOMPurify from "dompurify";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Tipo para el payload mínimo de edición de post
export type TextPayload = {
    userId: number;
    title: string;
    description: string;
    images: ITextImageDTO[];
};

interface UseEditTextFormProps {
    post?: ITextItemDTO;
    show: boolean;
}

export const useEditTextForm = ({ post, show }: UseEditTextFormProps) => {
    const [title, setTitle] = useState(post?.title || "");
    const [description, setDescription] = useState(post?.description || "");
    const [imagePreviews, setImagePreviews] = useState<IImagePreview[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

    const textImageService = new TextImageService();

    useEffect(() => {
        if (show && post) {
            setTitle(post.title || "");
            setDescription(post.description || "");

            setRemovedImageIds([]);
            if (post.images && post.images.length > 0) {
                const loadImages = async () => {
                    const previews: IImagePreview[] = await Promise.all(
                        post.images.map(async (img: ITextImageDTO) => {
                            try {
                                const blobUrl = await textImageService.getImageAsBlob(img.id);
                                return {
                                    url: blobUrl,
                                    isLoading: false,
                                    isExisting: true,
                                    id: img.id,
                                };
                            } catch (e) {
                                return {
                                    url: `/images/texts/${img.imageName}`,
                                    isLoading: false,
                                    isExisting: true,
                                    tempId: uuidv4(),
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
        } else if (!show) {
            setTitle("");
            setDescription("");
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
        if (!title.trim() || !description.trim()) {
            throw new Error("Título y mensaje son campos obligatorios.");
        }
        return true;
    }, [title, description]);

    const submitForm = useCallback(
        async (onSubmit: (post: TextPayload) => void, onClose: () => void) => {
            if (isSubmitting) return;
            setIsSubmitting(true);
            setGlobalError(null);
            try {
                validateForm();
                const sanitizedTitle = DOMPurify.sanitize(title);
                const sanitizedDescription = DOMPurify.sanitize(description);
                if (!post || typeof post.id !== "number") {
                    throw new Error(
                        "El post original debe tener un id válido para la edición."
                    );
                }

                const filesToUpload = imagePreviews
                    .filter((preview) => !preview.isExisting && preview.file)
                    .map((img) => img.file as File);
                const removedIds = removedImageIds;

                let uploadedNewImages: any[] = [];
                if (filesToUpload.length > 0) {
                    try {
                        uploadedNewImages = await textImageService.uploadTextImages(
                            post.id,
                            filesToUpload
                        );
                    } catch (uploadError) {
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
                            textId: post.id,
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
                    description: sanitizedDescription,
                    images: imagesPayload as any,
                };

                await onSubmit(updatedPost);

                if (removedIds.length > 0) {
                    try {
                        await Promise.all(
                            removedIds.map((id) =>
                                textImageService.deleteTextImage(id)
                            )
                        );
                    } catch (deleteError) {
                        console.error("Error al borrar imágenes existentes:", deleteError);
                    }
                }

                onClose();
            } catch (error) {
                const errorDescription =
                    error instanceof Error
                        ? error.message
                        : "Error desconocido al actualizar el post.";
                setGlobalError(errorDescription);
            } finally {
                setIsSubmitting(false);
            }
        },
        [
            isSubmitting,
            validateForm,
            title,
            description,
            imagePreviews,
            removedImageIds,
            textImageService,
        ]
    );

    return {
        title,
        setTitle,
        description,
        setDescription,
        imagePreviews,
        setImagePreviews,
        isSubmitting,
        globalError,
        handleImagesSelected,
        handleRemoveImage,
        submitForm,
        removedImageIds,
    };
};
