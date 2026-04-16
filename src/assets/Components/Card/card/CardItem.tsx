import ButtonAttendee from '@/assets/Components/Blog/admin/button/attendee/ButtonAttendee';
import LoveButton from '@/assets/Components/Blog/admin/button/love/ButtonLoveHeart';
import { IEventImage } from '@/core/events/IEvent';
import { IPostImage } from '@/core/posts/images/IPostImage';
import { useImageLoader } from '@/hooks/useImageLoader';
import React, { useState } from 'react';
import AccordionComments from '../../Blog/comments/AccordionComments';
import styles from './CardItem.module.scss';

// Tipo union para soportar tanto imágenes de eventos como de posts
type SupportedImages = string[] | IEventImage[] | IPostImage[];
type CardTag = { id: number; name: string; archived?: boolean };

interface CardItemProps {
    type: 'event' | 'post';
    id: number;
    title: string;
    description: string;
    creationDate: string;
    eventDate?: string; // Fecha específica del evento
    eventTime?: string; // Hora específica del evento
    lovesCount: number;
    commentsCount?: number;
    attendeesCount: number;
    location?: string;
    images?: SupportedImages; // Homogeneizado - soporte para strings, IEventImage[], IPostImage[]
    tags?: CardTag[];
    user?: any;
    userRole?: string;
    onSelect?: (item: any) => void;
    maxCapacity?: number;
    userId?: number;
    requireLogin?: boolean;
}

const FALLBACK_IMAGE = '/images/blocks-8866100_1280.png';

function formatDateDMY(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatHourHM(timeString?: string): string {
    if (!timeString) return '';
    const [hh, mm] = timeString.split(':');
    return hh && mm ? `${hh}:${mm}` : timeString;
}

function buildEventInfo(location: string | undefined, eventDate: string | undefined, eventTime: string | undefined): string {
    const datePart = formatDateDMY(eventDate);
    const timePart = formatHourHM(eventTime);
    const datetime = timePart ? `${datePart} ${timePart}` : datePart;
    return location ? `${location} · ${datetime}` : datetime;
}

function getDescriptionContent(
    type: 'event' | 'post',
    description: string,
    showFull: boolean,
    setShowFull: React.Dispatch<React.SetStateAction<boolean>>,
): React.ReactNode {
    if (type !== 'post' || description.length <= 250) {
        return description;
    }

    return (
        <>
            {showFull ? description : `${description.slice(0, 250)}... `}
            <button
                className={styles.seeMore}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowFull(!showFull);
                }}
            >
                {showFull ? 'Ver menos' : 'Ver más'}
            </button>
        </>
    );
}

function getMediaContent(
    options: {
        loadingImages: boolean;
        hasManyImages: boolean;
        hasSingleImage: boolean;
        processedImages: string[] | undefined;
        currentImage: number;
        title: string;
        id: number;
        type: 'event' | 'post';
        showPrev: (e: React.MouseEvent) => void;
        showNext: (e: React.MouseEvent) => void;
        setCurrentImage: React.Dispatch<React.SetStateAction<number>>;
    },
): React.ReactNode {
    const {
        loadingImages,
        hasManyImages,
        hasSingleImage,
        processedImages,
        currentImage,
        title,
        id,
        type,
        showPrev,
        showNext,
        setCurrentImage,
    } = options;

    if (loadingImages) {
        return (
            <div className={styles.imagePlaceholder}>
                <div className={styles.loadingSpinner}></div>
                <span className={styles.loadingText}>Cargando imágenes...</span>
            </div>
        );
    }

    if (hasManyImages) {
        return (
            <div className={styles.carousel}>
                <button className={styles.arrow} onClick={showPrev}>&lt;</button>
                <img
                    className={styles.thumbnail}
                    src={processedImages?.[currentImage] || FALLBACK_IMAGE}
                    alt={`Imagen ${currentImage + 1} de ${title}`}
                    onError={(e) => {
                        const localImages = {
                            0: '/images/img/niñoFichas.jpg',
                            1: '/images/img/adolescentesGrupal.jpg'
                        };

                        const smartFallback = localImages[currentImage as keyof typeof localImages] || FALLBACK_IMAGE;
                        e.currentTarget.src = smartFallback;
                    }}
                />
                <button className={styles.arrow} onClick={showNext}>&gt;</button>
                <div className={styles.dots}>
                    {processedImages?.map((imageSrc, idx) => (
                        <button
                            key={`${imageSrc}-${id}-${type}`}
                            type="button"
                            className={currentImage === idx ? `${styles.dot} ${styles.active}` : styles.dot}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImage(idx);
                            }}
                            aria-label={`Ir a imagen ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <img
            className={styles.thumbnail}
            src={hasSingleImage ? processedImages?.[0] : FALLBACK_IMAGE}
            alt="thumbnail"
            onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
            }}
        />
    );
}

const CardItem: React.FC<CardItemProps> = ({
    type,
    id,
    title,
    description,
    creationDate,
    eventDate,
    eventTime, // Added eventTime
    lovesCount,
    commentsCount,
    attendeesCount = 0,
    location,
    images,
    tags = [],
    user,
    userRole,
    onSelect,
    maxCapacity = 0,
    userId,
    requireLogin,
}) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [showFull, setShowFull] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

    // Use custom hook for image loading
    const { images: processedImages, loading: loadingImages } = useImageLoader(type, images);

    const hasManyImages = (processedImages?.length ?? 0) > 1;
    const hasSingleImage = (processedImages?.length ?? 0) > 0;
    const displayDate = type === 'event' && eventDate ? eventDate : creationDate;
    const eventInfo = buildEventInfo(location, eventDate, eventTime);
    const cardClassName = `${styles.card} ${type === 'event' ? styles.event : ''}`;
    const popupClassName = `${styles.popup} ${shareOpen ? styles.active : ''}`;
    const eventPath = `${globalThis.location.origin}/eventos/${id}`;
    const twitterText = `${title} - ${eventPath}`;
    const whatsappText = `¡Mira este evento! ${title} - ${eventPath}`;
    const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
    const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventPath)}`;
    const instagramHref = `https://www.instagram.com/?url=${encodeURIComponent(eventPath)}`;

    const showPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev === 0 ? (processedImages?.length || 1) - 1 : prev - 1));
    };

    const showNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => ((processedImages?.length ?? 0) > 0 && prev === (processedImages?.length ?? 1) - 1 ? 0 : prev + 1));
    };

    const descriptionContent = getDescriptionContent(type, description, showFull, setShowFull);
    const mediaContent = getMediaContent({
        loadingImages,
        hasManyImages,
        hasSingleImage,
        processedImages,
        currentImage,
        title,
        id,
        type,
        showPrev,
        showNext,
        setCurrentImage,
    });

    const defaultTags = type === 'event'
        ? [{ id: -1, name: 'Event' }]
        : [{ id: -2, name: 'Post' }];
    const displayTags = tags.length > 0 ? tags : defaultTags;

    return (
        <article
            className={cardClassName}
            data-user-id={userId ?? undefined}
            data-user-role={userRole ?? undefined}
            data-has-user={user ? 'true' : undefined}
            data-require-login={requireLogin ? 'true' : undefined}
        >
            <div className={styles.header}>
                {mediaContent}
                <span className={styles.loveIcon}>
                    <LoveButton
                        postId={id}
                        type={type} />
                </span>
                {type === 'event' && (
                    <span className={styles.eventDate}>{eventInfo}</span>
                )}
            </div>
            <div className={styles.body}>
                <h3 className={styles.title}>{title}</h3>
                {onSelect && (
                    <button
                        type="button"
                        className={styles.seeMore}
                        onClick={() => onSelect({ id })}
                    >
                        Ver detalle
                    </button>
                )}
                {type === 'post' && (
                    <p className={styles.date}>{formatDateDMY(displayDate)}</p>
                )}
                <p className={styles.description}>
                    {descriptionContent}
                </p>
                <ul className={styles.tags}>
                    {displayTags.map((tag) => (
                        <li key={tag.id} className={styles.tagItem}>#{tag.name}</li>
                    ))}
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
                            onClick={(e) => {
                                e.stopPropagation();
                                setShareOpen(!shareOpen);
                            }}
                        >
                            <i className="bi bi-share-fill"></i>
                        </button>
                        <ul className={popupClassName}>
                            <li>
                                <a href={twitterHref} target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-twitter-x"></i>
                                </a>
                                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-whatsapp"></i>
                                </a>
                                <a href={facebookHref} target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-facebook"></i>
                                </a>
                                <a href={instagramHref} target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-instagram"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </article>
    );
}

export default CardItem;