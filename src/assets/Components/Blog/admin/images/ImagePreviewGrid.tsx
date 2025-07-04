import React from 'react';
import styles from './ImagePreviewGrid.module.scss';

export interface ImagePreview {
    url: string;
    isLoading: boolean;
    file?: File;
    isExisting?: boolean;
    id?: number; // Para imágenes existentes del backend
}

interface ImagePreviewGridProps {
    imagePreviews: ImagePreview[];
    onRemoveImage: (index: number) => void;
    fallbackImageUrl?: string;
    showExistingBadge?: boolean;
    className?: string;
}

const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({
    imagePreviews,
    onRemoveImage,
    fallbackImageUrl = '/images/avatarGeneric.png',
    showExistingBadge = true,
    className
}) => {
    if (imagePreviews.length === 0) {
        return null;
    }

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, url: string) => {
        console.error('Error al cargar imagen:', url);
        e.currentTarget.src = fallbackImageUrl;
    };

    return (
        <div className={`${styles.imagePreviewContainer} ${className || ''}`}>
            {imagePreviews.map((preview, idx) => (
                <div key={idx} className={styles.imagePreview}>
                    {preview.isLoading ? (
                        <div className={styles.imagePlaceholder}>
                            <div className={styles.loadingSpinner}></div>
                            <span className={styles.loadingText}>Cargando...</span>
                        </div>
                    ) : (
                        <>
                            <img
                                src={preview.url}
                                alt={`preview-${idx}`}
                                className={styles.previewImage}
                                onError={(e) => handleImageError(e, preview.url)}
                            />
                            <button
                                type="button"
                                className={styles.removeButton}
                                onClick={() => onRemoveImage(idx)}
                                title="Eliminar imagen"
                            >
                                <i className="bi bi-x-octagon"></i>
                            </button>
                            {showExistingBadge && preview.isExisting && (
                                <span className={styles.existingBadge}>Existente</span>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ImagePreviewGrid;
