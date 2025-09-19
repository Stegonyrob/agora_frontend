import React from 'react';
// Importamos los estilos de la tarjeta original para reutilizar su estructura
import itemGenericStyles from './ItemGeneric.module.scss';
// Importamos los estilos específicos del esqueleto para colores y animación
import skeletonStyles from './ItemGenericSkeleton.module.scss';

interface ItemGenericSkeletonProps {
    type: 'post' | 'event'; // El esqueleto debe saber qué tipo de ítem simular
}

const ItemGenericSkeleton: React.FC<ItemGenericSkeletonProps> = ({ type }) => {
    const showLoadingImages = type === 'event'; // Solo los eventos cargan imágenes de forma asíncrona

    return (
        // Aplicamos la clase .card del estilo original y la clase .is-skeleton para estilos específicos
        <div className={`${itemGenericStyles.card} ${type === 'event' ? itemGenericStyles.event : ''} ${skeletonStyles.isSkeleton}`}>
            <div className={itemGenericStyles.info}>
                <div className={itemGenericStyles.separator}></div>
                <div className={itemGenericStyles.row}>
                    <span className={itemGenericStyles.id}>
                        <div className={`${skeletonStyles.skeletonLine} ${skeletonStyles.skeletonIdPlaceholder}`}></div>
                    </span>
                    <span className={itemGenericStyles.date}>
                        <div className={`${skeletonStyles.skeletonLine} ${skeletonStyles.skeletonDatePlaceholder}`}></div>
                    </span>
                    <div className={itemGenericStyles.statusContainer}>
                        <span className={itemGenericStyles.statusBlock}>
                            <div className={`${skeletonStyles.skeletonLine} ${skeletonStyles.skeletonStatusPlaceholder}`}></div>
                        </span>
                    </div>
                </div>
                <h2 className={itemGenericStyles.title}>
                    <div className={`${skeletonStyles.skeletonLine} ${skeletonStyles.skeletonTitlePlaceholder}`}></div>
                </h2>

                <div className={itemGenericStyles.tagsRow}>
                    <span className={itemGenericStyles.tagBadge}>
                        <div className={`${skeletonStyles.skeletonLine} ${skeletonStyles.skeletonTagPlaceholder}`}></div>
                    </span>
                    <span className={itemGenericStyles.tagBadge}>
                        <div className={`${skeletonStyles.skeletonLine} ${skeletonStyles.skeletonTagPlaceholder}`}></div>
                    </span>
                    <span className={itemGenericStyles.tagBadge}>
                        <div className={`${skeletonStyles.skeletonLine} ${skeletonStyles.skeletonTagPlaceholder}`}></div>
                    </span>
                </div>

                {type === 'event' && (
                    <div className={itemGenericStyles.imagePreviewContainer}>
                        {showLoadingImages ? (
                            <div className={itemGenericStyles.imagePlaceholder}>
                                <div className={skeletonStyles.loadingSpinner}></div>
                                <span className={itemGenericStyles.loadingText}>
                                    <div className={`${skeletonStyles.skeletonLine} ${skeletonStyles.skeletonLoadingTextPlaceholder}`}></div>
                                </span>
                            </div>
                        ) : (
                            // Fallback para cuando no hay spinner, muestra placeholders de imágenes
                            Array.from({ length: 3 }).map((_, idx) => ( // Simula 3 imágenes
                                <div key={idx} className={itemGenericStyles.imagePreview}>
                                    <div className={skeletonStyles.previewImagePlaceholder}></div>
                                    <div className={skeletonStyles.removeButtonPlaceholder}></div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {type === 'post' && (
                    // Para posts, asumimos que siempre habrá al menos un placeholder de imagen si no está en carga
                    <div className={itemGenericStyles.imagePreviewContainer}>
                        {Array.from({ length: 1 }).map((_, idx) => ( // Simula 1 imagen para posts
                            <div key={idx} className={itemGenericStyles.imagePreview}>
                                <div className={skeletonStyles.previewImagePlaceholder}></div>
                                <div className={skeletonStyles.removeButtonPlaceholder}></div>
                            </div>
                        ))}
                    </div>
                )}

                <div className={itemGenericStyles.messageRow}>
                    <div className={itemGenericStyles.message}>
                        <div className={`${skeletonStyles.skeletonLine} ${skeletonStyles.skeletonMessageLine}`}></div>
                        <div className={`${skeletonStyles.skeletonLine} ${skeletonStyles.skeletonMessageLine}`}></div>
                        <div className={`${skeletonStyles.skeletonLine} ${skeletonStyles.skeletonMessageLine} ${skeletonStyles.short}`}></div>
                        <div className={`${skeletonStyles.skeletonLine} ${skeletonStyles.skeletonMessageLine} ${skeletonStyles.shortest}`}></div>
                        <button className={itemGenericStyles.toggleButton}>
                            <div className={skeletonStyles.skeletonCircle}></div>
                        </button>
                    </div>
                    <div className={itemGenericStyles.actions}>
                        <div className={`${skeletonStyles.skeletonRect} ${skeletonStyles.skeletonActionButton}`}></div>
                        <div className={`${skeletonStyles.skeletonRect} ${skeletonStyles.skeletonActionButton}`}></div>
                        {type === 'event' && (
                            <div className={`${skeletonStyles.skeletonRect} ${skeletonStyles.skeletonActionButton}`}></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemGenericSkeleton;