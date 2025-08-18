import ButtonAttendee from '@/assets/Components/Blog/admin/button/attendee/ButtonAttendee';
import LikeButton from '@/assets/Components/Blog/admin/button/favorite/ButtonFavoriteHeart';
import { IEventImage } from '@/core/events/IEvent';
import { IPostImage } from '@/core/posts/images/IPostImage';
import { useImageLoader } from '@/hooks/useImageLoader';
import { RootState } from '@/redux/store';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AccordionComments from '../../Blog/comments/AccordionComments';
import styles from './CardItem.module.scss';

// Tipo union para soportar tanto imágenes de eventos como de posts
type SupportedImages = string[] | IEventImage[] | IPostImage[];

interface CardItemProps {
    type: 'event' | 'post';
    id: number;
    title: string;
    description: string;
    creationDate: string;
    eventDate?: string; // Fecha específica del evento
    eventTime?: string; // Hora específica del evento
    favoritesCount: number;
    commentsCount?: number;
    attendeesCount: number;
    location?: string;
    images?: SupportedImages; // Homogeneizado - soporte para strings, IEventImage[], IPostImage[]
    tags?: { id: number; name: string; archived?: boolean }[];
    user?: any;
    userRole?: string;
    onSelect?: (item: any) => void;
    maxCapacity?: number;
    userId?: number;
    requireLogin?: boolean;
}

const CardItem: React.FC<CardItemProps> = ({
    type,
    id,
    title,
    description,
    creationDate,
    eventDate,
    eventTime, // Added eventTime
    favoritesCount,
    commentsCount,
    attendeesCount = 0,
    location,
    images,
    tags = [],
    onSelect,
    maxCapacity = 0,
    userId = 1,
    userRole,
}) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [showFull, setShowFull] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

    // Acceso seguro a perfiles y avatares del store
    const profiles = useSelector((state: RootState) => state.profile.profiles);
    const avatars = useSelector((state: RootState) => state.avatars.avatars);

    // Use custom hook for image loading
    const { images: processedImages, loading: loadingImages, error: imageError } = useImageLoader(type, images);

    // Debug logs
    console.log('🔍 [CardItem] Hook result:', {
        processedImages,
        loadingImages,
        imageError,
        inputImages: images,
        type
    });

    // Log image loading errors
    if (imageError) {
        console.error('Image loading error:', imageError);
    } const showPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev === 0 ? (processedImages.length || 1) - 1 : prev - 1));
    };

    const showNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (processedImages && prev === processedImages.length - 1 ? 0 : prev + 1));
    };

    // Debug: Verificar si eventDate es null o vacío
    console.log('🔍 [CardItem] Valor de eventDate:', eventDate);

    // Hardcodear fecha y hora del evento para pruebas
    const hardcodedEventDate = '2025-08-20';
    const hardcodedEventTime = '18:30';

    // Fecha y lugar juntos para eventos
    const displayDate = type === 'event' && eventDate ? eventDate : creationDate;
    const eventInfo = type === 'event' && location
        ? `${location} · ${eventDate} ${eventTime}`
        : `${eventDate} ${eventTime}`;

    // Debug: Verificar datos recibidos
    console.log('🔍 [CardItem] Props recibidos:', {
        id,
        title,
        description,
        creationDate,
        eventDate,
        eventTime, // Added eventTime
        type,
        location,
        images,
    });

    // Debug: Verificar fecha calculada para mostrar
    console.log('🔍 [CardItem] Fecha calculada (displayDate):', displayDate);

    return (
        <>
            <article className={`${styles.card} ${type === 'event' ? styles.event : ''}`} onClick={() => onSelect && onSelect({ id })}>
                <div className={styles.header}>
                    {loadingImages ? (
                        <div className={styles.imagePlaceholder}>
                            <div className={styles.loadingSpinner}></div>
                            <span className={styles.loadingText}>Cargando imágenes...</span>
                        </div>
                    ) : processedImages && processedImages.length > 1 ? (
                        <div className={styles.carousel}>
                            <button className={styles.arrow} onClick={showPrev}>&lt;</button>
                            <img
                                className={styles.thumbnail}
                                src={processedImages[currentImage] || "/images/blocks-8866100_1280.png"}
                                alt={`Imagen ${currentImage + 1} de ${title}`}
                                onError={(e) => {
                                    const failedUrl = processedImages[currentImage];
                                    console.error('❌ [CardItem] Error cargando imagen carousel:', {
                                        originalSrc: failedUrl,
                                        imageIndex: currentImage,
                                        totalImages: processedImages.length,
                                        allImages: processedImages,
                                        errorEvent: e,
                                        isPostImage: failedUrl?.includes('/api/v1/post-images/'),
                                        hasToken: failedUrl?.includes('token=')
                                    });

                                    const localImages = {
                                        0: '/images/img/niñoFichas.jpg',
                                        1: '/images/img/adolescentesGrupal.jpg'
                                    };

                                    const smartFallback = localImages[currentImage as keyof typeof localImages] || "/images/blocks-8866100_1280.png";
                                    console.log(`🔄 [CardItem] Using smart fallback: ${smartFallback}`);
                                    e.currentTarget.src = smartFallback;
                                }}
                            />
                            <button className={styles.arrow} onClick={showNext}>&gt;</button>
                            <div className={styles.dots}>
                                {processedImages.map((_, idx) => (
                                    <span
                                        key={idx}
                                        className={currentImage === idx ? styles.dot + ' ' + styles.active : styles.dot}
                                        onClick={e => { e.stopPropagation(); setCurrentImage(idx); }}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <img
                            className={styles.thumbnail}
                            src={processedImages && processedImages.length > 0 && processedImages[0] ? processedImages[0] : "/images/blocks-8866100_1280.png"}
                            alt="thumbnail"
                            onError={(e) => {
                                console.error('❌ [CardItem] Error cargando imagen simple:', {
                                    originalSrc: processedImages && processedImages.length > 0 ? processedImages[0] : 'sin imagen',
                                    hasProcessedImages: !!processedImages,
                                    processedImagesLength: processedImages ? processedImages.length : 0,
                                    allImages: processedImages,
                                    errorEvent: e,
                                    fallbackUsed: "/images/blocks-8866100_1280.png"
                                });
                                e.currentTarget.src = "/images/blocks-8866100_1280.png";
                            }}
                        />
                    )}
                    <span className={styles.favoriteIcon}>
                        <LikeButton
                            postId={id}
                            type={type} />
                    </span>
                    {type === 'event' && (
                        <span className={styles.eventDate}>{eventInfo}</span>
                    )}
                </div>
                <div className={styles.body}>
                    <h3 className={styles.title}>{title}</h3>
                    {type === 'post' && (
                        <p className={styles.date}>{new Date(displayDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        })}</p>
                    )}
                    <p className={styles.description}>
                        {type === 'post' && description.length > 250
                            ? (
                                <>
                                    {showFull ? description : `${description.slice(0, 250)}... `}
                                    <button
                                        className={styles.seeMore}
                                        onClick={e => { e.stopPropagation(); setShowFull(!showFull); }}
                                    >
                                        {showFull ? 'Ver menos' : 'Ver más'}
                                    </button>
                                </>
                            )
                            : description
                        }
                    </p>
                    <ul className={styles.tags}>
                        {tags && tags.length > 0 ? (
                            tags.map((tag) => (
                                <li key={tag.id} className={styles.tagItem}>#{tag.name}</li>
                            ))
                        ) : (
                            <>
                                {type === 'event' && <li className={styles.tagItem}>#Event</li>}
                                {type === 'post' && <li className={styles.tagItem}>#Post</li>}
                            </>
                        )}
                    </ul>
                </div>
                <div className={styles.footer}>
                    <div className={styles.stats}>
                        {type === 'event' && (
                            <div className={styles.capacityInfo}>
                                Aforo: {maxCapacity}
                            </div>
                        )}
                        {type === 'post' && (
                            <div style={{ marginTop: '1rem' }}>
                                <AccordionComments postId={id} />

                            </div>
                        )}
                        {type === 'event' && (
                            <ButtonAttendee
                                eventId={id}
                                maxCapacity={maxCapacity}
                            />
                        )}
                    </div>
                    {type === 'event' && (
                        <div className={styles.share}>
                            <button
                                className={styles.share}
                                onClick={e => { e.stopPropagation(); setShareOpen(!shareOpen); }}
                            >
                                <i className="fa-solid fa-share"></i>
                            </button>
                            <ul className={`${styles.popup} ${shareOpen ? styles.active : ""}`}>
                                <li>
                                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-twitter-x"></i>
                                    </a>
                                    <a href={`https://wa.me/?text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-whatsapp"></i>
                                    </a>
                                    <a href={`https://wa.me/?text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-facebook"></i>
                                    </a>
                                    <a href={`https://wa.me/?text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-instagram"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </article >
        </>
    );
}

export default CardItem;