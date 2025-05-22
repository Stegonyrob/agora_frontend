import React from 'react';
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
}

const CardItem: React.FC<CardItemProps> = ({
    type,
    id,
    title,
    description,
    creationDate,
    favoritesCount,
    commentsCount,
    images,
    onSelect,
}) => {
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
                        <span></span>
                        <ul className={styles.tags}>
                            {type === 'event' && <li className="tag-item">#Event</li>}
                            {type === 'post' && <li className="tag-item">#Post</li>}
                        </ul>
                    </div>
                </article>
            </div>
        </section>
    );
};

export default CardItem;
