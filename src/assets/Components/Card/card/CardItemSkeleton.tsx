import React from 'react';
import styles from './CardItemSkeleton.module.scss'; // Su propio archivo SCSS

interface CardItemSkeletonProps {
    type: 'event' | 'post'; // El esqueleto debe saber qué tipo de tarjeta simular
}

const CardItemSkeleton: React.FC<CardItemSkeletonProps> = ({ type }) => {
    return (
        <article className={`${styles.card} ${type === 'event' ? styles.event : ''}`}>
            <div className={styles.header}>
                <div className={styles.thumbnailPlaceholder}>
                    {/* El cuadrado que simula el contenido de la imagen con object-fit: contain */}
                    <div className={styles.skeletonImageCenterPlaceholder}></div>
                </div>
                <span className={styles.favoriteIcon}>
                    <div className={styles.skeletonCirclePlaceholder}></div> {/* Placeholder para el corazón */}
                </span>
                {type === 'event' && (
                    <span className={styles.eventDate}>
                        <div className={`${styles.skeletonLinePlaceholder} ${styles.skeletonEventDatePlaceholder}`}></div>
                    </span>
                )}
            </div>
            <div className={styles.body}>
                <h3 className={styles.title}>
                    <div className={`${styles.skeletonLinePlaceholder} ${styles.skeletonTitlePlaceholder}`}></div>
                </h3>
                {type === 'post' && (
                    <p className={styles.date}>
                        <div className={`${styles.skeletonLinePlaceholder} ${styles.skeletonDatePlaceholder}`}></div>
                    </p>
                )}
                <p className={styles.description}>
                    <div className={`${styles.skeletonLinePlaceholder} ${styles.skeletonDescriptionLine}`}></div>
                    <div className={`${styles.skeletonLinePlaceholder} ${styles.skeletonDescriptionLine} ${styles.short}`}></div>
                    <div className={`${styles.skeletonLinePlaceholder} ${styles.skeletonDescriptionLine} ${styles.shortest}`}></div>
                    {type === 'post' && (
                        <button className={styles.seeMore}>
                            <div className={`${styles.skeletonLinePlaceholder} ${styles.skeletonSeeMorePlaceholder}`}></div>
                        </button>
                    )}
                </p>
                <ul className={styles.tags}>
                    <li className={styles.tagItem}>
                        <div className={`${styles.skeletonLinePlaceholder} ${styles.skeletonTagPlaceholder}`}></div>
                    </li>
                    <li className={styles.tagItem}>
                        <div className={`${styles.skeletonLinePlaceholder} ${styles.skeletonTagPlaceholder}`}></div>
                    </li>
                    <li className={styles.tagItem}>
                        <div className={`${styles.skeletonLinePlaceholder} ${styles.skeletonTagPlaceholder}`}></div>
                    </li>
                </ul>
            </div>
            <div className={styles.footer}>
                <div className={styles.stats}>
                    {type === 'event' && (
                        <div className={styles.capacityInfo}>
                            <div className={`${styles.skeletonLinePlaceholder} ${styles.skeletonCapacityPlaceholder}`}></div>
                        </div>
                    )}
                    {type === 'post' && (
                        <div className={styles.accordionCommentsPlaceholder}>
                            <div className={`${styles.skeletonLinePlaceholder} ${styles.skeletonCommentsPlaceholder}`}></div>
                        </div>
                    )}
                    {type === 'event' && (
                        <div className={styles.buttonAttendeePlaceholder}>
                            <div className={`${styles.skeletonRectPlaceholder}`}></div>
                        </div>
                    )}
                </div>
                {type === 'event' && (
                    <div className={styles.share}>
                        <button className={styles.shareBtn}>
                            <div className={styles.skeletonCirclePlaceholder}></div> {/* Placeholder para el icono de compartir */}
                        </button>
                        {/* No simulamos el popup, ya que está oculto por defecto */}
                    </div>
                )}
            </div>
        </article>
    );
};

export default CardItemSkeleton;