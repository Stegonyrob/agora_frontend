import ButtonAttendee from '@/assets/Components/Blog/admin/button/attendee/ButtonAttendee';
import LikeButton from '@/assets/Components/Blog/admin/button/favorite/ButtonFavoriteHeart';
import ButtonComment from '@/assets/Components/Blog/comment/ButtonComent';
import React, { useState } from 'react';
import styles from './CardItem.module.scss';

interface CardItemProps {
    type: 'event' | 'post';
    id: number;
    title: string;
    description: string;
    creationDate: string;
    favoritesCount: number;
    commentsCount?: number;
    attendentsCount?: number;
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
    attendentsCount,
    location,
    images,
    onSelect,
    maxCapacity = 0,
    userId = 1,

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

    return (
        <article className={styles.card} onClick={() => onSelect && onSelect({ id })}>
            <div className={styles.header}>
                {/* Imagen y corazón arriba a la derecha */}
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
                                    className={currentImage === idx ? styles.activeDot : styles.dot}
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
                {/* Corazón arriba a la derecha */}
                <span className={styles.favoriteIcon}>
                    <LikeButton
                        userId={userId}
                        postId={id}
                        posts={[]} // Puedes ajustar esto si tienes eventos
                        requireLogin={type === 'post'}
                        onSelect={() => {
                            console.log('LikeButton clicked para postId:', id, 'userId:', userId);
                        }}
                        type={type} // <-- ¡Esto es lo importante!
                    />
                </span>
                {/* Fecha y lugar para eventos */}
                {type === 'event' && (
                    <span className={styles["event-date"]}>{eventInfo}</span>
                )}
            </div>
            <div className={styles.body}>
                <h3 className={styles.title}>{title}</h3>
                {/* Solo para post: fecha debajo del título */}
                {type === 'post' && (
                    <p className={styles.date}>{new Date(creationDate).toLocaleDateString()}</p>
                )}
                {/* Descripción: ver más para post largos */}
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
                {/* Tags */}
                <ul className={styles.tags}>
                    {type === 'event' && <li className={styles["tag-item"]}>#Event</li>}
                    {type === 'post' && <li className={styles["tag-item"]}>#Post</li>}
                </ul>
            </div>
            <div className={styles.footer}>
                <div className={styles.stats}>
                    {/* Comentarios solo para post */}
                    {type === 'post' && (
                        <ButtonComment
                            postId={id}
                            userId={userId}
                            counter={commentsCount || 0}
                        />
                    )}
                    {/* Asistiré solo para eventos */}
                    {type === 'event' && (
                        <ButtonAttendee
                            eventId={id}
                            maxCapacity={maxCapacity}
                        />
                    )}
                </div>
                {/* Compartir solo para eventos */}
                {type === 'event' && (
                    <div className={styles.share}>
                        <button
                            className={styles["share-btn"]}
                            onClick={e => { e.stopPropagation(); setShareOpen(!shareOpen); }}
                        >
                            <i className="fa-solid fa-share"></i>
                        </button>
                        <ul className={`${styles.popup} ${shareOpen ? styles.active : ""}`}>
                            <li>
                                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                                    <i className="bx bxl-twitter"></i>
                                </a>
                            </li>
                            <li>
                                <a href={`https://wa.me/?text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                                    <i className="bx bxl-whatsapp"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </article>
    );
};

export default CardItem;