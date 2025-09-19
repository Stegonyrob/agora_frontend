import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import { ITextItemDTO } from "@/core/texts/ITextItemDTO";
import { ITextImageDTO } from "@/core/texts/images/ITextImageDTO";
import { TextImageRepository } from "@/core/texts/images/TextImageRepository";
import TextImageService from "@/core/texts/images/TextImageService";
import DOMPurify from "dompurify";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Tipo para el payload mínimo de edición de texto
export type TextPayload = {
    userId: number;
    title: string;
    message: string; // Cambiar de description a message
    images: ITextImageDTO[];
};

interface UseEditTextFormProps {
    post?: ITextItemDTO;
    show: boolean;
}

export const useEditTextForm = ({ post, show }: UseEditTextFormProps) => {
    const [title, setTitle] = useState(post?.title || "");
    const [description, setDescription] = useState(post?.message || "");
    const [imagePreviews, setImagePreviews] = useState<IImagePreview[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

    const textImageService = new TextImageService();
    const textImageRepository = new TextImageRepository();

    useEffect(() => {
        if (show && post) {
            setTitle(post.title || "");
            setDescription(post.message || "");

            setRemovedImageIds([]);
            if (post.images && post.images.length > 0) {
                const loadImages = async () => {
                    const previews: IImagePreview[] = post.images.map((img: ITextImageDTO) => {
                        // Manejar ambos tipos de imagen (legacy ITextImageDTO y nuevo ITextImage)
                        const hasImagePath = 'imagePath' in img && (img as any).imagePath;
                        const imageUrl = hasImagePath
                            ? textImageService.buildImageUrl((img as any).imagePath)
                            : img.imageName
                                ? `/images/texts/${img.imageName}`
                                : '';

                        return {
                            url: imageUrl,
                            isLoading: false,
                            isExisting: true,
                            id: img.id,
                        };
                    });
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
                        uploadedNewImages = await textImageService.uploadImagesByTextId(
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
                    message: sanitizedDescription,
                    images: imagesPayload as any,
                };

                await onSubmit(updatedPost);

                if (removedIds.length > 0) {
                    try {
                        await Promise.all(
                            removedIds.map((id) =>
                                textImageRepository.deleteTextImage(id)
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
