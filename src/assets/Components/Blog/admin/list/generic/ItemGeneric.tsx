import { createSelector } from '@reduxjs/toolkit';
import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { IEvent, IEventImage } from '../../../../../../core/events/IEvent';
import type { IPostImage } from '../../../../../../core/posts/images/IPostImage';
import type { IPost } from '../../../../../../core/posts/IPost';
import type { ITextImage } from '../../../../../../core/texts/images/ITextImage';
import type { IText } from '../../../../../../core/texts/IText';
import { useImageLoader } from '../../../../../../hooks/useImageLoader';
import type { RootState } from '../../../../../../redux/store';
import ViewAttendeesButton from '../../attendees/ViewAttendeesButton';
import ButtonArchiveGeneric from '../../button/archive/ButtonArchiveGeneric';
import ButtonDeleteGeneric from '../../button/delete/ButtonDeleteGeneric';
import ButtonEditGeneric from '../../button/edit/ButtonEditGeneric';
import ImagePreviewGrid from '../../images/ImagePreviewGrid';
import styles from './ItemGeneric.module.scss';

// Constante para selector vacío - evita recreación en cada render
const EMPTY_SELECTOR = () => [];
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
    // Crear selector memoizado específico para esta instancia
    const memoizedTagSelector = useMemo(() => {
        if ((type === 'post' || type === 'event') && id) {
            // Crear un selector específico para este item
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
        // Para texto, retornar selector que siempre devuelve array vacío constante
        return () => EMPTY_TAGS_ARRAY;
    }, [type, id]);

    const tagsFromStore = useSelector(memoizedTagSelector);

    // Forzar tipado de tags para evitar error TS
    type TagType = { id?: number; name?: string; archived?: boolean } | string;

    // 🏷️ MANEJO DE TAGS SEGÚN EL TIPO DE ITEM
    const tags: TagType[] = useMemo(() => {
        switch (type) {
            case 'post':
            case 'event':
                // Para posts y eventos, usar tags del Redux store
                return tagsFromStore || [];
            case 'text':
                // Los textos NO tienen tags, siempre retorna array vacío
                return [];
            default:
                return [];
        }
    }, [type, tagsFromStore]);

    // 🐛 DEBUG: Verificar que las tags se cargan según el tipo
    useEffect(() => {
        if (type !== 'text') {
        }
    }, [type, id, tags]);
    const archived = typeof data.archived === 'boolean' ? data.archived : (propIsArchived ?? false);

    // Usar el hook moderno useImageLoader con contexto de administración solo para posts y events
    const {
        images: processedImages,
        loading: loadingImagesHook,
        error: imageError
    } = useImageLoader(
        type === 'text' ? 'post' : type,
        type === 'text' ? undefined : (Array.isArray(images) && images.length > 0
            ? (typeof images[0] === 'string'
                ? images as string[]
                : (type === 'event'
                    ? images as IEventImage[]
                    : images as IPostImage[]))
            : undefined),
        true
    ); // Para textos, no usar el hook useImageLoader

    const [showFullText, setShowFullText] = useState(false);
    const messagePreview = message?.slice(0, 200) ?? '';

    const toggleText = () => setShowFullText(prev => !prev);

    useEffect(() => {
        // Log simplificado del estado de imágenes solo para posts y events
        if (type !== 'text') {
            // Log logic here if needed
        }
    }, [type, id, loadingImagesHook, processedImages, imageError]);

    // Convertir processedImages a formato ImagePreview (limpio y simple)
    const convertToImagePreviews = (processedUrls: string[]): any[] => {
        if (type === 'text') {
            // Para textos, usar las textImages si están disponibles
            return textImages?.map((textImg, index) => ({
                url: processedUrls[index] || `/api/v1/text-images/${textImg.id}/data`,
                isLoading: false,
                isExisting: true,
                id: textImg.id || index
            })) || [];
        }

        // Para posts y events, usar la lógica original
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
            if (type === 'text') {
                // Para textos, manejar eliminación específica
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
                {type === 'text' ? (
                    // Lógica específica para textos
                    loadingImages ? (
                        <div className={styles.imageContainer}>
                            <div className={styles.imagePlaceholder}>
                                <div className={styles.loadingSpinner}></div>
                                <span className={styles.loadingText}>Cargando imágenes de texto...</span>
                            </div>
                        </div>
                    ) : images && Array.isArray(images) && images.length > 0 ? (
                        <div className={styles.imageContainer}>
                            <ImagePreviewGrid
                                imagePreviews={convertToImagePreviews(images as string[])}
                                onRemoveImage={handleRemoveImage}
                                fallbackImageUrl="/images/blocks-8866100_1280.png"
                            />
                        </div>
                    ) : null
                ) : (
                    // Lógica original para posts y events
                    loadingImagesHook ? (
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
                    ) : null
                )}

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
                            <i className={`bi ${showFullText ? 'bi-dash' : 'bi-plus'}`}></i>
                        </button>
                    </p>
                    <div className={styles.actions}>
                        <ButtonEditGeneric
                            type={type}
                            item={item}
                            onSubmit={handleUpdate}
                        />
                        {(type === 'post' || type === 'event' || type === 'text') && (
                            <ButtonArchiveGeneric
                                type={type as 'post' | 'event' | 'text'}
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