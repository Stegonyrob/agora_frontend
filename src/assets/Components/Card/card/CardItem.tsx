import ButtonAttendee from '@/assets/Components/Blog/admin/button/attendee/ButtonAttendee';
import LoveButton from '@/assets/Components/Blog/admin/button/love/ButtonLoveHeart';
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
    lovesCount: number;
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
    lovesCount,
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

    const showPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev === 0 ? (processedImages.length || 1) - 1 : prev - 1));
    };

    const showNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (processedImages && prev === processedImages.length - 1 ? 0 : prev + 1));
    };

    // Hardcodear fecha y hora del evento para pruebas
    const hardcodedEventDate = '2025-08-20';
    const hardcodedEventTime = '18:30';


    // Utilidad para formatear fecha a dd/mm/aaaa
    function formatDateDMY(dateString?: string) {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // fallback si no es válida
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Utilidad para formatear hora a hh:mm (sin segundos)
    function formatHourHM(timeString?: string) {
        if (!timeString) return '';
        // Si viene en formato hh:mm:ss, solo toma hh:mm
        const [hh, mm] = timeString.split(':');
        if (hh && mm) return `${hh}:${mm}`;
        return timeString;
    }

    // Fecha y lugar juntos para eventos, usando formato dd/mm/aaaa
    const displayDate = type === 'event' && eventDate ? eventDate : creationDate;
    const eventInfo = type === 'event' && location
        ? `${location} · ${formatDateDMY(eventDate)}${eventTime ? ' ' + formatHourHM(eventTime) : ''}`
        : `${formatDateDMY(eventDate)}${eventTime ? ' ' + formatHourHM(eventTime) : ''}`;

    // Component initialized

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
                                    const localImages = {
                                        0: '/images/img/niñoFichas.jpg',
                                        1: '/images/img/adolescentesGrupal.jpg'
                                    };

                                    const smartFallback = localImages[currentImage as keyof typeof localImages] || "/images/blocks-8866100_1280.png";
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
                                e.currentTarget.src = "/images/blocks-8866100_1280.png";
                            }}
                        />
                    )}
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
                    {type === 'post' && (
                        <p className={styles.date}>{formatDateDMY(displayDate)}</p>
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
                                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} - ${window.location.origin}/eventos/${id}`)}`} target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-twitter-x"></i>
                                    </a>
                                    <a href={`https://wa.me/?text=${encodeURIComponent(`¡Mira este evento! ${title} - ${window.location.origin}/eventos/${id}`)}`} target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-whatsapp"></i>
                                    </a>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/eventos/' + id)}`} target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-facebook"></i>
                                    </a>
                                    <a href={`https://www.instagram.com/?url=${encodeURIComponent(window.location.origin + '/eventos/' + id)}`} target="_blank" rel="noopener noreferrer">
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