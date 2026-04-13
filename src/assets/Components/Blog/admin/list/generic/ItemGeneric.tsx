import { createSelector } from '@reduxjs/toolkit';
import DOMPurify from 'dompurify';
import { lazy, Suspense, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { IEvent, IEventImage } from '../../../../../../core/events/IEvent';
import type { IPostImage } from '../../../../../../core/posts/images/IPostImage';
import type { IPost } from '../../../../../../core/posts/IPost';
import type { ITextImage } from '../../../../../../core/texts/images/ITextImage';
import type { IText } from '../../../../../../core/texts/IText';
import { useImageLoader } from '../../../../../../hooks/useImageLoader';
import type { RootState } from '../../../../../../redux/store';
import styles from './ItemGeneric.module.scss';

const ViewAttendeesButton = lazy(() => import('../../attendees/ViewAttendeesButton'));
const ButtonArchiveGeneric = lazy(() => import('../../button/archive/ButtonArchiveGeneric'));
const ButtonDeleteGeneric = lazy(() => import('../../button/delete/ButtonDeleteGeneric'));
const ButtonEditGeneric = lazy(() => import('../../button/edit/ButtonEditGeneric'));
const ImagePreviewGrid = lazy(() => import('../../images/ImagePreviewGrid'));

const EMPTY_TAGS_ARRAY: any[] = [];




interface ItemGenericProps<T extends IPost | IEvent | IText> {
    item: T;
    id: number;
    title: string;
    message: string;
    creationDate?: any;
    isArchived?: boolean;
    onSelect: (item: T) => void;
    onSubmit: (item: T) => void;
    onDelete?: (id: number) => Promise<void>;
    userId: number;
    onCreate: (newItem: any) => Promise<void>;
    type: 'post' | 'event' | 'text';
    images?: (string | IPostImage | IEventImage)[];
    // Props específicas para textos
    textImages?: ITextImage[];
    loadingImages?: boolean;
    onArchive?: (id: number) => Promise<boolean>;
    onUnArchive?: (id: number) => Promise<boolean>;
    category?: string;
}


const ItemGeneric = <T extends IPost | IEvent | IText>({
    item,
    id: propId,
    title: propTitle,
    message: propMessage,
    creationDate: propCreationDate,
    isArchived: propIsArchived,
    onSelect,
    onSubmit,
    onDelete,
    userId,
    onCreate,
    type,
    images,
    textImages,
    loadingImages,
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

    // 🏷️ OBTENER TAGS DESDE REDUX STORE usando selector optimizado
    const memoizedTagSelector = useMemo(() => {
        if ((type === 'post' || type === 'event') && id) {
            return createSelector(
                [(state: RootState) => state.tags],
                (tagsState) => {
                    const tags = type === 'post'
                        ? tagsState.postTags[id]
                        : tagsState.eventTags[id];
                    return tags || EMPTY_TAGS_ARRAY;
                }
            );
        }
        return () => EMPTY_TAGS_ARRAY;
    }, [type, id]);

    const tagsFromStore = useSelector(memoizedTagSelector);

    // Forzar tipado de tags para evitar error TS
    type TagType = { id?: number; name?: string; archived?: boolean } | string;

    // 🏷️ MANEJO DE TAGS SEGÚN EL TIPO DE ITEM
    const tags: TagType[] = useMemo(() => {
        if (type === 'post' || type === 'event') {
            return tagsFromStore || [];
        }
        return [];
    }, [type, tagsFromStore]);

    const archived = typeof data.archived === 'boolean' ? data.archived : (propIsArchived ?? false);

    const imageSource = useMemo(() => {
        if (type === 'text') {
            return undefined;
        }
        if (!Array.isArray(images) || images.length === 0) {
            return undefined;
        }
        if (typeof images[0] === 'string') {
            return images as string[];
        }
        if (type === 'event') {
            return images as IEventImage[];
        }
        return images as IPostImage[];
    }, [type, images]);

    // Usar el hook moderno useImageLoader con contexto de administración solo para posts y events
    const {
        images: processedImages,
        loading: loadingImagesHook,
        error: imageError
    } = useImageLoader(
        type === 'text' ? 'post' : type,
        imageSource,
        true
    ); // Para textos, no usar el hook useImageLoader

    const [showFullText, setShowFullText] = useState(false);
    const messagePreview = message?.slice(0, 200) ?? '';

    const toggleText = () => setShowFullText(prev => !prev);

    const convertToImagePreviews = (processedUrls: string[]): any[] => {
        if (type === 'text') {
            return textImages?.map((textImg, index) => ({
                url: processedUrls[index] || `/api/v1/text-images/${textImg.id}/data`,
                isLoading: false,
                isExisting: true,
                id: textImg.id || index
            })) || [];
        }

        const originalImages = Array.isArray(images) ? images : [];
        return processedUrls.map((url, index) => {
            const originalImage = originalImages[index];
            const imageId = typeof originalImage === 'object' ? originalImage?.id : undefined;

            return {
                url,
                isLoading: false,
                isExisting: !!originalImage && typeof originalImage === 'object',
                id: imageId || index
            };
        });
    };

    const handleRemoveImage = async (identifier: number | string) => {
        if (!globalThis.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
            return;
        }
        try {
            if (type === 'text') {
                await onCreate({
                    id,
                    type: 'textDelete',
                    imageId: identifier as number
                });
            } else if (type === 'post') {
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
            globalThis.alert('Imagen eliminada correctamente');
        } catch (error: any) {
            globalThis.alert(`Error eliminando imagen: ${error?.message || 'Error desconocido'}`);
        }
    };

    const handleUpdate = async (updatedItem: any) => {
        if (updatedItem.title) updatedItem.title = DOMPurify.sanitize(updatedItem.title);
        if (updatedItem.message) updatedItem.message = DOMPurify.sanitize(updatedItem.message);
        // Asegurar que el id esté presente en el payload
        if (!updatedItem.id) {
            updatedItem.id = id;
        }
        onSubmit(updatedItem);
    };

    const getTagDisplay = (tag: TagType): string => {
        if (typeof tag === 'string') {
            return tag;
        }
        if (tag.name) {
            return tag.name;
        }
        if (typeof tag.id === 'number') {
            return `tag-${tag.id}`;
        }
        return 'sin-tag';
    };

    const tagItems = tags.map((tag, idx) => {
        const label = getTagDisplay(tag);
        const stableId = typeof tag === 'object' && typeof tag.id === 'number' ? tag.id : label;
        return {
            key: `${stableId}-${idx}`,
            label
        };
    });

    const itemTypeLabel = () => {
        if (type === 'post') {
            return 'Post';
        }
        if (type === 'event') {
            return 'Event';
        }
        return 'Text';
    };

    const toggleIconClass = showFullText ? 'bi-dash' : 'bi-plus';

    const renderTextImages = () => {
        if (loadingImages) {
            return (
                <div className={styles.imageContainer}>
                    <div className={styles.imagePlaceholder}>
                        <div className={styles.loadingSpinner}></div>
                        <span className={styles.loadingText}>Cargando imágenes de texto...</span>
                    </div>
                </div>
            );
        }

        if (images && Array.isArray(images) && images.length > 0) {
            return (
                <div className={styles.imageContainer}>
                    <Suspense fallback={<div className={styles.loadingText}>Cargando vista previa...</div>}>
                        <ImagePreviewGrid
                            imagePreviews={convertToImagePreviews(images as string[])}
                            onRemoveImage={handleRemoveImage}
                            fallbackImageUrl="/images/blocks-8866100_1280.png"
                        />
                    </Suspense>
                </div>
            );
        }

        return null;
    };

    const renderPostOrEventImages = () => {
        if (loadingImagesHook) {
            return (
                <div className={styles.imageContainer}>
                    <div className={styles.imagePlaceholder}>
                        <div className={styles.loadingSpinner}></div>
                        <span className={styles.loadingText}>Cargando imágenes...</span>
                    </div>
                </div>
            );
        }

        if (processedImages && processedImages.length > 0) {
            return (
                <div className={styles.imageContainer}>
                    <Suspense fallback={<div className={styles.loadingText}>Cargando vista previa...</div>}>
                        <ImagePreviewGrid
                            imagePreviews={convertToImagePreviews(processedImages)}
                            onRemoveImage={handleRemoveImage}
                            fallbackImageUrl="/images/blocks-8866100_1280.png"
                        />
                    </Suspense>
                </div>
            );
        }

        if (images && Array.isArray(images) && images.length > 0) {
            return (
                <div className={styles.imageContainer}>
                    <div className={styles.imagePlaceholder}>
                        <span className={styles.loadingText}>Procesando {images.length} imágenes...</span>
                    </div>
                </div>
            );
        }

        return null;
    };

    const renderImageSection = () => {
        if (type === 'text') {
            return renderTextImages();
        }
        return renderPostOrEventImages();
    };

    return (
        <div className={styles.card}>
            <div className={styles.info}>
                <div className={styles.separator}></div>
                <div className={styles.row}>
                    <span className={styles.id}>
                        {itemTypeLabel()} ID: {id ?? 'No hay ID'}
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

                {tagItems.length > 0 && (
                    <div className={styles.tagsRow}>
                        {tagItems.map((tagItem) => (
                            <span key={tagItem.key} className={styles.tagBadge}>{tagItem.label}</span>
                        ))}
                    </div>
                )}

                {renderImageSection()}

                {type !== 'text' && imageError && (
                    <div className={styles.imageError}>
                        <span>Error cargando imágenes: {imageError}</span>
                    </div>
                )}
                <div className={styles.messageRow}>
                    <p className={styles.message}>
                        {showFullText ? message : messagePreview}
                        {message && message.length > 200 && !showFullText && '...'}
                        <button onClick={toggleText} className={styles.toggleButton}>
                            <i className={`bi ${toggleIconClass}`}></i>
                        </button>
                    </p>
                    <div className={styles.actions}>
                        <Suspense fallback={null}>
                            <ButtonEditGeneric
                                type={type}
                                item={item}
                                onSubmit={handleUpdate}
                            />
                            {(type === 'post' || type === 'event' || type === 'text') && (
                                <ButtonArchiveGeneric
                                    type={type}
                                    id={id}
                                    isArchived={archived}
                                    onArchive={async (id, type, archive) => {
                                        try {
                                            if (archive && onArchive) {
                                                await onArchive(id);
                                            } else if (onUnArchive) {
                                                await onUnArchive(id);
                                            }
                                        } catch (error: any) {
                                            globalThis.alert(error?.message || 'Error al archivar/desarchivar el ítem. Inténtalo de nuevo.');
                                        }
                                    }}
                                />
                            )}
                            {onDelete && (
                                <ButtonDeleteGeneric
                                    type={type}
                                    id={id}
                                    title={title}
                                    onDelete={onDelete}
                                />
                            )}
                            {type === 'event' && (
                                <ViewAttendeesButton
                                    eventId={id}
                                    eventTitle={title}
                                />
                            )}
                        </Suspense>
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