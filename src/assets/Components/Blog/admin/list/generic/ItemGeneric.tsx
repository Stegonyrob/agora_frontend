import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { useImageLoader } from '../../../../../../hooks/useImageLoader';
import ViewAttendeesButton from '../../attendees/ViewAttendeesButton';
import ButtonArchiveGeneric from '../../button/archive/ButtonArchiveGeneric';
import ButtonEditGeneric from '../../button/edit/ButtonEditGeneric';
import ImagePreviewGrid from '../../images/ImagePreviewGrid';
import styles from './ItemGeneric.module.scss';

import type { IEvent, IEventImage } from '../../../../../../core/events/IEvent';
import type { IPostImage } from '../../../../../../core/posts/images/IPostImage';
import type { IPost } from '../../../../../../core/posts/IPost';

// Tipo union para soportar tanto imágenes de eventos como de posts (igual que CardItem)
type SupportedImages = string[] | IEventImage[] | IPostImage[];

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
    type: 'post' | 'event' | 'text';
    images?: SupportedImages; // Homogeneizado - igual que CardItem
    onArchive?: (id: number) => Promise<boolean>;
    onUnArchive?: (id: number) => Promise<boolean>;
    category?: string;
}


const ItemGeneric = <T extends IPost | IEvent | any>({
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
    onUnArchive,
    category
}: ItemGenericProps<T>) => {
    // Usar siempre los datos del objeto item como fuente principal
    let data: any = item || {};
    if (type === 'event' || type === 'post') {
        data = item as IEvent | IPost;
    }
    const id = data.id ?? propId;
    const title = data.title ?? propTitle;
    const message = data.message ?? propMessage;
    const creationDate = data.creationDate ?? propCreationDate;
    // Forzar tipado de tags para evitar error TS
    type TagType = { id?: number; name?: string; archived?: boolean } | string;
    const tags: TagType[] = Array.isArray(data.tags) ? data.tags : [];
    const archived = typeof data.archived === 'boolean' ? data.archived : (propIsArchived ?? false);

    // Usar el hook moderno useImageLoader con contexto de administración
    const {
        images: processedImages,
        loading: loadingImagesHook,
        error: imageError
    } = useImageLoader(type === 'text' ? 'post' : type, images, true); // treat 'text' as 'post' for images

    const [showFullText, setShowFullText] = useState(false);
    const [loadingImages, setLoadingImages] = useState(false); // Mantenido para compatibilidad
    const messagePreview = message?.slice(0, 200) ?? '';

    const toggleText = () => setShowFullText(prev => !prev);

    useEffect(() => {
        // Log simplificado del estado de imágenes
        // Quitado
    }, [type, id, loadingImagesHook, processedImages, imageError]);

    // Convertir processedImages a formato ImagePreview (limpio y simple)
    const convertToImagePreviews = (processedUrls: string[]): any[] => {
        const originalImages = Array.isArray(images) ? images : [];
        const result = processedUrls.map((url, index) => {
            const originalImage = originalImages[index];
            const imageId = typeof originalImage === 'object' ? originalImage?.id : undefined;

            const preview = {
                url,
                isLoading: false,
                isExisting: !!originalImage && typeof originalImage === 'object',
                id: imageId || index
            };

            return preview;
        });

        return result;
    };

    const handleRemoveImage = async (identifier: number | string) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
            return;
        }
        try {
            if (type === 'post') {
                await onCreate({
                    id,
                    type: 'delete',
                    imageId: identifier as number
                });
            } else {
                await onCreate({
                    id,
                    type: 'eventDelete',
                    imageId: identifier as number
                });
            }
            window.alert('Imagen eliminada correctamente');
        } catch (error: any) {
            window.alert(`Error eliminando imagen: ${error.message}`);
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
                    <span className={styles.id}>
                        {type === 'post' ? 'Post' : type === 'event' ? 'Event' : 'Text'} ID: {id ?? 'No hay ID'}
                    </span>
                    <span className={styles.date}>
                        {creationDate ? new Date(creationDate).toLocaleString('es-ES') : '--/--/--'}
                    </span>
                    {type !== 'text' && (
                        <div className={styles.statusContainer}>
                            <span className={archived ? styles.archivedStatus : styles.publishedStatus}>
                                {archived ? 'Archivado' : 'Publicado'}
                            </span>
                        </div>
                    )}
                </div>
                <h2 className={styles.title}>{title ?? 'No hay título'}</h2>
                {type === 'text' && category && (
                    <div className={styles.tagsRow}>
                        <span className={styles.tagBadge}>{category}</span>
                    </div>
                )}

                {getTagNames().length > 0 && (
                    <div className={styles.tagsRow}>
                        {getTagNames().map((tag: string, idx: number) => (
                            <span key={idx} className={styles.tagBadge}>{tag}</span>
                        ))}
                    </div>
                )}

                {/* Renderizar imágenes con estado de carga (igual que CardItem) */}
                {loadingImagesHook ? (
                    <div className={styles.imageContainer}>
                        <div className={styles.imagePlaceholder}>
                            <div className={styles.loadingSpinner}></div>
                            <span className={styles.loadingText}>Cargando imágenes...</span>
                        </div>
                    </div>
                ) : processedImages && processedImages.length > 0 ? (
                    <div className={styles.imageContainer}>
                        <ImagePreviewGrid
                            imagePreviews={convertToImagePreviews(processedImages)}
                            onRemoveImage={handleRemoveImage}
                            fallbackImageUrl="/images/blocks-8866100_1280.png"
                        />
                    </div>
                ) : images && Array.isArray(images) && images.length > 0 ? (
                    <div className={styles.imageContainer}>
                        <div className={styles.imagePlaceholder}>
                            <span className={styles.loadingText}>Procesando {images.length} imágenes...</span>
                        </div>
                    </div>
                ) : null}

                {imageError && (
                    <div className={styles.imageError}>
                        <span>Error cargando imágenes: {imageError}</span>
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
                            type={type === 'text' ? 'post' : type}
                            item={item as IPost | IEvent}
                            onSubmit={handleUpdate}
                        />
                        {type !== 'text' && (
                            <ButtonArchiveGeneric
                                type={type as 'post' | 'event'}
                                id={id}
                                isArchived={archived}
                                onArchive={async (id, type, archive) => {
                                    try {
                                        if (archive && onArchive) {
                                            await onArchive(id);
                                        } else if (onUnArchive) {
                                            await onUnArchive(id);
                                        }
                                    } catch (error) {
                                        alert('Error al archivar/desarchivar el ítem. Inténtalo de nuevo.');
                                    }
                                }}
                            />
                        )}
                        {type === 'event' && (
                            <ViewAttendeesButton
                                eventId={id}
                                eventTitle={title}
                            />
                        )}
                    </div>
                </div>
                {type === 'event' && (
                    <span className={styles.date}>
                        <strong>Fecha del evento:</strong> {data.eventDate ? new Date(data.eventDate).toLocaleDateString('es-ES') : '--/--/--'}
                        {'eventTime' in data && data.eventTime && (
                            <>
                                {' '}
                                <strong>Hora:</strong> {data.eventTime}
                            </>
                        )}
                    </span>
                )}
            </div>
        </div>
    );
};

export default ItemGeneric;