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
    id: propId,
    title: propTitle,
    message: propMessage,
    creationDate: propCreationDate,
    isArchived: propIsArchived,
    onSelect,
    onSubmit,
    userId,
    onCreate,
    type,
    images,
    onArchive,
    onUnArchive
}: ItemGenericProps<T>) => {
    // Usar siempre los datos del objeto item como fuente principal
    const data = item || {};
    const id = data.id ?? propId;
    const title = data.title ?? propTitle;
    const message = data.message ?? propMessage;
    const creationDate = data.creationDate ?? propCreationDate;
    // Forzar tipado de tags para evitar error TS
    type TagType = { id?: number; name?: string; archived?: boolean } | string;
    const tags: TagType[] = Array.isArray(data.tags) ? data.tags : [];
    const archived = typeof data.archived === 'boolean' ? data.archived : (propIsArchived ?? false);

    const [showFullText, setShowFullText] = useState(false);
    const [eventImages, setEventImages] = useState<ImagePreview[]>([]);
    const [postImages, setPostImages] = useState<ImagePreview[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const messagePreview = message?.slice(0, 200) ?? '';

    const toggleText = () => setShowFullText(prev => !prev);

    useEffect(() => {
        console.log(`🔍 ItemGeneric - Debug ${type}:`, {
            id,
            title,
            item,
            images,
            message,
            creationDate,
            archived,
            itemImages: (item as any)?.images,
            itemImage: (item as any)?.image
        });
    }, [type, id, item, images]);

    useEffect(() => {
        if (type === 'event' && id) {
            loadEventImages();
        } else if (type === 'post') {
            loadPostImages();
        }
    }, [type, id, item, images]);

    const loadPostImages = () => {
        try {
            let imageUrls: string[] = [];
            // Unificar todas las fuentes posibles de imágenes
            if (Array.isArray((item as any)?.images)) {
                imageUrls = (item as any).images;
            } else if (Array.isArray((item as any)?.image)) {
                imageUrls = (item as any).image;
            } else if (typeof (item as any)?.image === 'string' && (item as any)?.image) {
                imageUrls = [(item as any).image];
            }
            // También agregar las imágenes de la prop images si existen y no están ya
            if (images && Array.isArray(images)) {
                imageUrls = imageUrls.concat(images.filter(url => !imageUrls.includes(url)));
            }
            // Convertir a URLs absolutas si es necesario
            imageUrls = imageUrls.map((url: string) => url.startsWith('http') ? url : `/images/posts/${url}`);
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
            const imageToRemove = eventImages[index];
            if (!imageToRemove?.id) {
                console.error("Error: imagen sin ID válido");
                return;
            }

            try {
                const eventImageService = new EventImageService();
                await eventImageService.deleteEventImage(imageToRemove.id as number);

                setEventImages(prev => prev.filter((_, idx) => idx !== index));

                console.log("✅ ItemGeneric - Imagen de evento eliminada:", imageToRemove.id);
            } catch (error) {
                console.error("Error deleting event image:", error);
                alert('Error al eliminar la imagen. Por favor, inténtalo de nuevo.');
            }
        } else if (type === 'post') {
            setPostImages(prev => prev.filter((_, idx) => idx !== index));
            console.log("✅ ItemGeneric - Imagen de post removida de la vista:", index);
        }
    };

    const handleUpdate = async (updatedItem: any) => {
        if (updatedItem.title) updatedItem.title = DOMPurify.sanitize(updatedItem.title);
        if (updatedItem.message) updatedItem.message = DOMPurify.sanitize(updatedItem.message);
        // Asegurar que el id esté presente en el payload
        if (!updatedItem.id) {
            // Buscar id desde props o item
            updatedItem.id = id;
        }
        // Debug: mostrar el id y el payload completo que se envía a onSubmit
        console.log('[ItemGeneric] handleUpdate - id:', updatedItem.id, 'payload:', JSON.stringify(updatedItem, null, 2));
        onSubmit(updatedItem);
    };

    const getTagNames = () => {
        if (tags.length > 0) {
            if (typeof tags[0] === 'object' && (tags[0] as any).name) {
                return tags.map((tag) => typeof tag === 'object' && tag.name ? tag.name : String(tag));
            }
            return tags.map(String);
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
                        {creationDate ? new Date(creationDate).toLocaleString('es-ES') : '--/--/--'}
                    </span>
                    <div className={styles.statusContainer}>
                        <span className={archived ? styles.archivedStatus : styles.publishedStatus}>
                            {archived ? 'Archivado' : 'Publicado'}
                        </span>
                    </div>
                </div>
                <h2 className={styles.title}>{title ?? 'No hay título'}</h2>

                {getTagNames().length > 0 && (
                    <div className={styles.tagsRow}>
                        {getTagNames().map((tag: string, idx: number) => (
                            <span key={idx} className={styles.tagBadge}>{tag}</span>
                        ))}
                    </div>
                )}

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
                                try {
                                    if (archive) {
                                        await onArchive(id);
                                    } else {
                                        await onUnArchive(id);
                                    }
                                } catch (error) {
                                    console.error("Error archiving/unarchiving item:", error);
                                    alert('Error al archivar/desarchivar el ítem. Inténtalo de nuevo.');
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