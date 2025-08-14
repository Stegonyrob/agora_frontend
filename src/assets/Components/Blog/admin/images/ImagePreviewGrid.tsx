import React, { useState } from 'react';
import styles from './ImagePreviewGrid.module.scss';

export interface ImagePreview {
    url: string;
    isLoading: boolean;
    file?: File;
    isExisting?: boolean;
    id?: number;      // Para imágenes existentes
    tempId?: string;  // Para imágenes nuevas
}

interface ImagePreviewGridProps {
    imagePreviews: ImagePreview[];
    onRemoveImage: (identifier: number | string) => void; // Recibe id o tempId
    fallbackImageUrl?: string;
    className?: string;
    showExistingBadge?: boolean; // Nueva prop
}

const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({
    imagePreviews,
    onRemoveImage,
    fallbackImageUrl = '/images/blocks-8866100_1280.png',
    className,
    showExistingBadge = false // Valor por defecto
}) => {
    const [imageErrors, setImageErrors] = useState<Set<number | string>>(new Set());

    const handleImageError = (identifier: number | string) => {
        setImageErrors(prev => new Set(prev).add(identifier));
    };

    const getImageSrc = (preview: ImagePreview): string => {
        const urlStr = typeof preview.url === 'string' ? preview.url : '';
        if (
            (preview.id && imageErrors.has(preview.id)) ||
            (preview.tempId && imageErrors.has(preview.tempId))
        ) {
            return fallbackImageUrl;
        }
        return urlStr || fallbackImageUrl;
    };

    if (imagePreviews.length === 0) return null;

    return (
        <div className={`${styles.imagePreviewContainer} ${className || ''}`}>
            {imagePreviews.map((preview, idx) => {
                // Garantiza unicidad absoluta de la key
                let key = '';
                if (preview.isExisting && preview.id !== undefined) {
                    key = `existing-${preview.id}`;
                } else if (!preview.isExisting && preview.tempId) {
                    key = `new-${preview.tempId}`;
                } else {
                    key = `url-${preview.url}`;
                }
                // Si hay duplicados, añade el índice para blindar
                key = `${key}-${idx}`;

                const identifier = preview.isExisting && preview.id
                    ? preview.id
                    : preview.tempId || preview.url;

                const imageSrc = getImageSrc(preview);

                return (
                    <div key={key} className={styles.imagePreview}>
                        {showExistingBadge && preview.isExisting && (
                            <span className={styles.existingBadge}>Existente</span>
                        )}
                        {preview.isLoading ? (
                            <div className={styles.imagePlaceholder}>
                                <div className={styles.loadingSpinner}></div>
                                <span>Cargando...</span>
                            </div>
                        ) : (
                            <>
                                <img
                                    src={imageSrc}
                                    alt="preview"
                                    className={styles.previewImage}
                                    onError={() => handleImageError(identifier)}
                                />
                                {imageSrc === fallbackImageUrl && (
                                    <div className={styles.errorBadge}>
                                        <i className="bi bi-exclamation-triangle"></i>
                                        <span>Error</span>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className={styles.removeButton}
                                    onClick={() => onRemoveImage(identifier)}
                                    title="Eliminar imagen"
                                >
                                    <i className="bi bi-x-octagon"></i>
                                </button>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ImagePreviewGrid;