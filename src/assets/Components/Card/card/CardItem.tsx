import ButtonAttendee from '@/assets/Components/Blog/admin/button/attendee/ButtonAttendee';
import LikeButton from '@/assets/Components/Blog/admin/button/favorite/ButtonFavoriteHeart';
import ButtonComment from '@/assets/Components/Blog/comment/ButtonComent';
import React, { useState } from 'react';
import styles from './CardItem.module.css';

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
    images?: any[];
    user?: any;
    userRole?: string;
    onSelect?: (item: any) => void;
    maxCapacity?: number;
    userId?: number;
}

const CardItem: React.FC<CardItemProps> = ({
    type,
    id,
    title,
    description,
    creationDate,
    favoritesCount,
    commentsCount,
    attendentsCount = 0,
    location,
    images,
    onSelect,
    maxCapacity = 10,
    userId = 1,
}) => {
    const [currentAttendees, setCurrentAttendees] = useState(attendentsCount);
    const availableSpots = type === 'event' ? Math.max(maxCapacity - currentAttendees, 0) : 0;

    const handleAttendeeRegistered = () => {
        setCurrentAttendees(prev => prev + 1);
    };

    return (
        <section className={styles.container} onClick={() => onSelect && onSelect({ id })}>
            <div className={styles.articles}>
                <article className={styles.card}>
                    <div className={styles.header}>
                        <img className={styles.thumbnail} src={images?.[0]} alt="thumbnail" />
                    </div>
                    <div className={styles.body}>
                        <h3 className={styles.title}>{title}</h3>
                        <p className={styles.date}>{new Date(creationDate).toLocaleDateString()}</p>
                        <p className={styles.description}>{description}</p>
                        <ul className={styles.tags}>
                            {type === 'event' && <li className="tag-item">#Event</li>}
                            {type === 'post' && <li className="tag-item">#Post</li>}
                        </ul>
                    </div>
                    <div className={styles.footer}>
                        <div className={styles.stats}>
                            {/* Botón de favoritos */}
                            <LikeButton
                                userId={userId}
                                postId={id}
                                posts={[]} // Si tu lógica lo requiere, pásale los posts reales
                                onSelect={() => { }} // Puedes implementar lógica si lo necesitas
                            />
                            {/* Botón de comentarios solo para posts */}
                            {type === 'post' && (
                                <ButtonComment
                                    postId={id}
                                    userId={userId}
                                    counter={commentsCount || 0}
                                />
                            )}
                        </div>
                        <span className={styles.favorites}>Favoritos: {favoritesCount}</span>
                        {type === 'post' && commentsCount !== undefined && (
                            <span className={styles.comments}>Comentarios: {commentsCount}</span>
                        )}
                        {type === 'event' && (
                            <>
                                <span className={styles.attendents}>
                                    Asistentes: {currentAttendees}
                                </span>
                                <span className={styles.available}>
                                    {availableSpots > 0
                                        ? `Quedan ${availableSpots} lugares`
                                        : 'Evento lleno'}
                                </span>
                                <ButtonAttendee eventId={id} onRegister={handleAttendeeRegistered} />
                            </>
                        )}
                        {type === 'event' && (
                            <span className={styles.location}>Lugar: {location}</span>
                        )}
                    </div>
                </article>
            </div>
        </section>
    );
};

export default CardItem;