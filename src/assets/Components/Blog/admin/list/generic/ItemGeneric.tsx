import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import EventImageService from '../../../../../../core/events/EventImageService';
import ViewAttendeesButton from '../../attendees/ViewAttendeesButton';
import ButtonArchiveGeneric from '../../button/archive/ButtonArchiveGeneric';
import ButtonEditGeneric from '../../button/edit/ButtonEditGeneric';
import ImagePreviewGrid, { ImagePreview } from '../../images/ImagePreviewGrid';
import styles from './ItemGeneric.module.scss';

import type { IEvent } from '../../../../../../core/events/IEvent';
import type { IPost } from '../../../../../../core/posts/IPost';

interface ItemGenericProps<T> {
    item: T;
    id: number;
    title: string;
    message: string;
    creationDate?: any;
    isArchived?: boolean;
    onSelect: (item: T) => void;
    onSubmit: (item: T) => void;
    userId: number;
    onCreate: (newItem: any) => Promise<void>;
    type: 'post' | 'event';
    images?: any[];
    onArchive: (id: number) => Promise<boolean>;
    onUnArchive: (id: number) => Promise<boolean>;
}

const ItemGeneric = <T extends IPost | IEvent>({
    item,
    id,
    title,
    message,
    creationDate,
    isArchived,
    onSelect,
    onSubmit,
    userId,
    onCreate,
    type,
    images,
    onArchive,
    onUnArchive
}: ItemGenericProps<T>) => {
    const [showFullText, setShowFullText] = useState(false);
    const [eventImages, setEventImages] = useState<ImagePreview[]>([]);
    const [postImages, setPostImages] = useState<ImagePreview[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const messagePreview = message?.slice(0, 200) ?? '';
    const archived = isArchived ?? false;

    const toggleText = () => setShowFullText(prev => !prev);

    // Debug de estructura del item
    useEffect(() => {
        console.log(`🔍 ItemGeneric - Debug ${type}:`, {
            id,
            title,
            item,
            images,
            itemImages: (item as any)?.images,
            itemImage: (item as any)?.image
        });
    }, [type, id, item, images]);

    // Ajustar carga de imágenes y tags para el nuevo formato del backend
    useEffect(() => {
        if (type === 'event' && id) {
            loadEventImages();
        } else if (type === 'post') {
            loadPostImages();
        }
    }, [type, id, item, images]);

    const loadPostImages = () => {
        try {
            // Ahora las imágenes vienen en images (array de strings)
            let imageUrls: string[] = [];
            if (Array.isArray((item as any)?.images)) {
                imageUrls = (item as any).images.map((url: string) =>
                    url.startsWith('http') ? url : `/images/posts/${url}`
                );
            } else if (images && Array.isArray(images)) {
                imageUrls = images;
            }
            const imagePreviewsData: ImagePreview[] = imageUrls.map((url, index) => ({
                url: url,
                isLoading: false,
                isExisting: true,
                id: index
            }));
            setPostImages(imagePreviewsData);
            console.log("🖼️ ItemGeneric - Post images loaded:", {
                postId: id,
                cantidad: imagePreviewsData.length,
                imagenes: imagePreviewsData.map(img => ({ id: img.id, url: img.url }))
            });
        } catch (error) {
            console.error("Error loading post images:", error);
            setPostImages([]);
        }
    };

    const loadEventImages = async () => {
        if (type !== 'event' || !id) return;

        setLoadingImages(true);
        try {
            const eventImageService = new EventImageService();
            const images = await eventImageService.getEventImages(id);

            // Transformar EventImageResponse[] a ImagePreview[] usando buildImageUrl
            const imagePreviewsData: ImagePreview[] = images.map((img) => ({
                url: eventImageService.buildImageUrl(img.id),
                isLoading: false,
                isExisting: true,
                id: img.id
            }));

            setEventImages(imagePreviewsData);
            console.log("🖼️ ItemGeneric - Imágenes cargadas:", {
                eventId: id,
                cantidad: imagePreviewsData.length,
                imagenes: imagePreviewsData.map(img => ({ id: img.id, url: img.url }))
            });
        } catch (error) {
            console.error("Error loading event images:", error);
            setEventImages([]);
        } finally {
            setLoadingImages(false);
        }
    };

    const handleRemoveImage = async (index: number) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
            return;
        }

        if (type === 'event') {
            // Lógica existente para eventos
            const imageToRemove = eventImages[index];
            if (!imageToRemove?.id) {
                console.error("Error: imagen sin ID válido");
                return;
            }

            try {
                const eventImageService = new EventImageService();
                await eventImageService.deleteEventImage(imageToRemove.id as number);

                // Actualizar la lista local removiendo por índice
                setEventImages(prev => prev.filter((_, idx) => idx !== index));

                console.log("✅ ItemGeneric - Imagen de evento eliminada:", imageToRemove.id);
            } catch (error) {
                console.error("Error deleting event image:", error);
                alert('Error al eliminar la imagen. Por favor, inténtalo de nuevo.');
            }
        } else if (type === 'post') {
            // Para posts, solo removemos de la vista local por ahora
            // TODO: Implementar lógica de eliminación en el backend si es necesario
            setPostImages(prev => prev.filter((_, idx) => idx !== index));
            console.log("✅ ItemGeneric - Imagen de post removida de la vista:", index);
        }
    };

    const handleUpdate = async (updatedItem: any) => {
        if (updatedItem.title) updatedItem.title = DOMPurify.sanitize(updatedItem.title);
        if (updatedItem.message) updatedItem.message = DOMPurify.sanitize(updatedItem.message);
        onSubmit(updatedItem);
    };

    // Ajustar tags para el nuevo formato del backend
    const getTagNames = () => {
        if (Array.isArray((item as any)?.tags) && (item as any).tags.length > 0) {
            // Si los tags son objetos, extraer el campo name
            if (typeof (item as any).tags[0] === 'object' && (item as any).tags[0].name) {
                return (item as any).tags.map((tag: any) => tag.name);
            }
            // Si ya son strings
            return (item as any).tags;
        }
        return [];
    };

    return (
        <div className={styles.card}>
            <div className={styles.info}>
                <div className={styles.separator}></div>
                <div className={styles.row}>
                    <span className={styles.id}>{type === 'post' ? 'Post' : 'Event'} ID: {id ?? 'No hay ID'}</span>
                    <span className={styles.date}>
                        {creationDate && Array.isArray(creationDate)
                            ? new Date(
                                creationDate[0],
                                creationDate[1] - 1,
                                creationDate[2],
                                creationDate[3] || 0,
                                creationDate[4] || 0,
                                creationDate[5] || 0,
                                creationDate[6] || 0
                            ).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })
                            : '--/--/--'}
                    </span>
                    <div className={styles.statusContainer}>
                        <span className={archived ? styles.archivedStatus : styles.publishedStatus}>
                            {archived ? 'Archivado' : 'Publicado'}
                        </span>
                    </div>
                </div>
                <h2 className={styles.title}>{title ?? 'No hay título'}</h2>

                {/* Mostrar tags para eventos y posts */}
                {getTagNames().length > 0 && (
                    <div className={styles.tagsRow}>
                        {getTagNames().map((tag: string, idx: number) => (
                            <span key={idx} className={styles.tagBadge}>{tag}</span>
                        ))}
                    </div>
                )}

                {/* Mostrar imágenes para eventos */}
                {type === 'event' && (
                    <div>
                        {loadingImages ? (
                            <div className={styles.imagePlaceholder}>
                                <div className={styles.loadingSpinner}></div>
                                <span className={styles.loadingText}>Cargando imágenes...</span>
                            </div>
                        ) : (
                            <ImagePreviewGrid
                                imagePreviews={eventImages}
                                onRemoveImage={handleRemoveImage}
                                showExistingBadge={true}
                                className={styles.eventImagesGrid}
                            />
                        )}
                    </div>
                )}

                {/* Mostrar imágenes para posts usando el mismo sistema que eventos */}
                {type === 'post' && postImages.length > 0 && (
                    <div>
                        <ImagePreviewGrid
                            imagePreviews={postImages}
                            onRemoveImage={handleRemoveImage}
                            showExistingBadge={true}
                            className={styles.postImagesGrid}
                        />
                    </div>
                )}
                <div className={styles.messageRow}>
                    <p className={styles.message}>
                        {showFullText ? message : messagePreview}
                        {message && message.length > 200 && !showFullText && '...'}
                        <button onClick={toggleText} className={styles.toggleButton}>
                            <i className={`bi ${showFullText ? 'bi-dash' : 'bi-plus'}`}></i>
                        </button>
                    </p>
                    <div className={styles.actions}>
                        <ButtonEditGeneric
                            type={type}
                            item={item}
                            onSubmit={handleUpdate}
                        />

                        <ButtonArchiveGeneric
                            type={type}
                            id={id}
                            isArchived={archived}
                            onArchive={async (id, type, archive) => {
                                if (archive) {
                                    await onArchive(id);
                                } else {
                                    await onUnArchive(id);
                                }
                            }}
                        />
                        {type === 'event' && (
                            <ViewAttendeesButton
                                eventId={id}
                                eventTitle={title}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemGeneric;