import { ImagePreview as IImagePreview } from "@/assets/Components/Blog/admin/images/ImagePreviewGrid";
import { ITextImageDTO } from "@/core/texts/images/ITextImageDTO";
import TextImageService from "@/core/texts/images/TextImageService";
import { ITextItemDTO } from "@/core/texts/ITextItemDTO";
import DOMPurify from "dompurify";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Tipo para el payload mínimo de edición de texto
export type TextPayload = {
    userId: number;
    title: string;
    message: string;
    images: ITextImageDTO[];
    isArchived: boolean;
    isPublished: boolean;
};

interface UseEditTextFormProps {
    post?: ITextItemDTO;
    show: boolean;
}

export const useEditTextForm = ({ post, show }: UseEditTextFormProps) => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [imagePreviews, setImagePreviews] = useState<IImagePreview[]>([]);
    const [date, setDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const textImageService = new TextImageService();
    const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

    useEffect(() => {
        console.log("🔄 [useEditTextForm] useEffect ejecutado", {
            show,
            post: !!post,
            postId: post?.id,
            postTitle: post?.title,
            postMessage: post?.message
        });

        if (show && post) {
            console.log("📝 [useEditTextForm] Cargando datos del texto:", {
                title: post.title,
                message: post.message,
                imagesCount: post.images?.length || 0
            });

            setTitle(post.title || "");
            setMessage(post.message || "");
            setRemovedImageIds([]); if (post.createdAt) {
                const dateObj = new Date(post.createdAt);
                const day = dateObj.getDate().toString().padStart(2, "0");
                const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
                const year = dateObj.getFullYear();
                setDate(`${day}/${month}/${year}`);
            } else {
                setDate("");
            }

            // Cargar imágenes desde el servicio (no desde el post)
            if (post.id && typeof post.id === 'number') {
                console.log("🖼️ [useEditTextForm] Cargando imágenes desde el servicio para textId:", post.id);
                const loadImages = async () => {
                    try {
                        const images = await textImageService.getImagesByTextId(post.id!);
                        console.log("🖼️ [useEditTextForm] Imágenes obtenidas del servicio:", images);

                        const previews: IImagePreview[] = images.map((img) => ({
                            url: img.url || textImageService.buildImageUrl(img.imagePath),
                            isLoading: false,
                            isExisting: true,
                            id: img.id || undefined,
                        }));

                        setImagePreviews(previews);
                        console.log("✅ [useEditTextForm] Preview de imágenes cargado:", previews);
                    } catch (error) {
                        console.error("❌ [useEditTextForm] Error cargando imágenes:", error);
                        setImagePreviews([]);
                    }
                };
                loadImages();
            } else {
                console.log("📋 [useEditTextForm] No hay imágenes existentes");
                setImagePreviews([]);
            }
            setGlobalError(null);
        } else if (!show) {
            console.log("🧹 [useEditTextForm] Limpiando formulario (show=false)");
            setTitle("");
            setMessage("");
            setDate("");
            setImagePreviews([]);
            setRemovedImageIds([]);
            setGlobalError(null);
        }
    }, [post, show]);

    // Debug: Monitorear cambios en title y message
    useEffect(() => {
        console.log("📊 [useEditTextForm] Estados actualizados:", { title, description: message });
    }, [title, message]);

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
                text: TextPayload & { id: number },
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
                        "El texto original debe tener un id válido para la edición."
                    );
                }

                const removedIds: number[] = removedImageIds;

                // 1. Eliminar imágenes marcadas para borrado PRIMERO (como en eventos y posts)
                if (removedIds.length > 0) {
                    console.log(`🗑️ Eliminando ${removedIds.length} imágenes...`);
                    const deletePromises = removedIds.map((imageId) =>
                        textImageService.deleteTextImage(imageId)
                    );
                    await Promise.all(deletePromises);
                    console.log("✅ Imágenes eliminadas exitosamente");
                }

                // 2. Subir nuevas imágenes si las hay DESPUÉS (como en eventos y posts)
                const newImageFiles = imagePreviews
                    .filter((preview) => !preview.isExisting && preview.file)
                    .map((preview) => preview.file!);

                let uploadedNewImages: any[] = [];
                if (newImageFiles.length > 0) {
                    console.log(`📤 Subiendo ${newImageFiles.length} nuevas imágenes...`);
                    uploadedNewImages = await textImageService.uploadImagesByTextId(
                        post.id,
                        newImageFiles
                    );
                    console.log("✅ Nuevas imágenes subidas exitosamente");
                }

                // 3. Construir payload de imágenes (como en eventos y posts)
                const finalImagesPayload = imagePreviews
                    .filter(
                        (img) =>
                            img.isExisting &&
                            typeof img.id === "number" &&
                            !removedIds.includes(img.id)
                    )
                    .map((img) => {
                        const textImage = post.images.find((i: any) => i.id === img.id);
                        return {
                            id: img.id,
                            imageName: textImage?.imageName || "",
                            textId: post.id,
                            category: textImage?.category || "main",
                            imageType: textImage?.imageType || "jpg",
                            imageData: textImage?.imageData || "",
                        };
                    });

                const newImagesPayload = uploadedNewImages.map((img) => ({
                    id: img.id || undefined,
                    imageName: img.imageName,
                    textId: post.id,
                    category: img.category || "main",
                    imageType: img.imageType || "jpg",
                    imageData: img.imageData || "",
                }));

                const imagesPayload = [...finalImagesPayload, ...newImagesPayload];

                const updatedText = {
                    id: post.id,
                    userId: post.userId,
                    title: sanitizedTitle,
                    message: sanitizedMessage,
                    images: imagesPayload as any,
                    isArchived: false,
                    isPublished: true,
                };

                console.info("[useEditTextForm][PUT] Payload enviado:", updatedText);

                // 4. Actualizar el texto
                console.log("📝 Actualizando datos del texto...");
                await onSubmit(updatedText, newImageFiles, removedIds);
                console.log("✅ Texto actualizado exitosamente");

                // 5. Emitir evento personalizado para que otros componentes se actualicen
                console.log("🔄 Emitiendo evento de actualización de texto...");
                const updateEvent = new CustomEvent('textUpdated', {
                    detail: { textId: post.id, action: 'edit' }
                });
                window.dispatchEvent(updateEvent);

                onClose();
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Error desconocido al actualizar el texto.";
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
            imagePreviews,
            post,
            removedImageIds,
        ]
    );

    return {
        title,
        setTitle,
        description: message,
        setDescription: setMessage,
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
