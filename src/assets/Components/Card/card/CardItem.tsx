import ButtonAttendee from '@/assets/Components/Blog/admin/button/attendee/ButtonAttendee';
import LikeButton from '@/assets/Components/Blog/admin/button/favorite/ButtonFavoriteHeart';
import React, { useState } from 'react';
import AccordionComments from '../../Blog/comments/AccordionComments';
import styles from './CardItem.module.scss';

interface CardItemProps {
    type: 'event' | 'post';
    id: number;
    title: string;
    description: string;
    creationDate: string;
    favoritesCount: number;
    commentsCount?: number;
    attendeesCount: number;
    location?: string;
    images?: string[];
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
    favoritesCount,
    commentsCount,
    attendeesCount = 0,
    location,
    images,
    onSelect,
    maxCapacity = 0,
    userId = 1,
    userRole,

}) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [showFull, setShowFull] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

    const showPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev === 0 ? (images?.length || 1) - 1 : prev - 1));
    };

    const showNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (images && prev === images.length - 1 ? 0 : prev + 1));
    };

    // Fecha y lugar juntos para eventos
    const eventInfo = type === 'event' && location
        ? `${location} · ${new Date(creationDate).toLocaleDateString()}`
        : undefined;

    // Share Button Popup

    const sharebtns = document.querySelectorAll(".share-btn");

    sharebtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            const eventFooter = btn.closest(".event-footer");
            if (!eventFooter) return;
            const popup = eventFooter.querySelector(".popup");
            if (!popup) return;

            btn.classList.toggle("active");
            popup.classList.toggle("active");

            event.stopPropagation();
        });
    });

    document.addEventListener("click", (event) => {
        const popups = document.querySelectorAll(".popup");

        popups.forEach((popup) => {
            if (popup.classList.contains("active") && !popup.contains(event.target as Node)) {
                popup.classList.remove("active");

                const eventFooter = popup.closest(".event-footer");
                if (eventFooter) {
                    const shareBtn = eventFooter.querySelector(".share-btn");
                    if (shareBtn) {
                        shareBtn.classList.remove("active");
                    }
                }
            }
        });
    });






    return (<>
        <article className={`${styles.card} ${type === 'event' ? styles.event : ''}`} onClick={() => onSelect && onSelect({ id })}>
            <div className={styles.header}>
                {images && images.length > 1 ? (
                    <div className={styles.carousel}>
                        <button className={styles.arrow} onClick={showPrev}>&lt;</button>
                        <img
                            className={styles.thumbnail}
                            src={images[currentImage]}
                            alt={`Imagen ${currentImage + 1} de ${title}`}
                        />
                        <button className={styles.arrow} onClick={showNext}>&gt;</button>
                        <div className={styles.dots}>
                            {images.map((_, idx) => (
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
                        src={images && images.length === 1 ? images[0] : "/images/blocks-8866100_1280.png"}
                        alt="thumbnail"
                    />
                )}
                <span className={styles.favoriteIcon}>
                    <LikeButton
                        postId={id}
                        type={type}
                    />
                </span>
                {type === 'event' && (
                    <span className={styles.eventDate}>{eventInfo}</span>
                )}
            </div>
            <div className={styles.body}>
                <h3 className={styles.title}>{title}</h3>
                {type === 'post' && (
                    <p className={styles.date}>{new Date(creationDate).toLocaleDateString()}</p>
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
                    {type === 'event' && <li className={styles.tagItem}>#Event</li>}
                    {type === 'post' && <li className={styles.tagItem}>#Post</li>}
                </ul>
            </div>
            {/* !-- stadistic!  */}
            <div className={styles.footer}>
                <div className={styles.stats}>
                    {type === 'event' && (
                        <div className={styles.capacityInfo}>
                            Aforo: {maxCapacity}
                        </div>
                    )}
                    {type === 'post' && (
                        <div style={{ marginTop: '1rem' }}>
                            <AccordionComments
                                postId={id}
                                currentUserId={userId}
                                isAdmin={userRole === 'ADMIN'}
                            />
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
        </article>
    </>
    );
}

export default CardItem;