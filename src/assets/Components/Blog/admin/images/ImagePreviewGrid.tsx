import React, { useState } from 'react';
import styles from './ImagePreviewGrid.module.scss';

export interface ImagePreview {
    url: string;
    isLoading: boolean;
    file?: File;
    isExisting?: boolean;
    id?: number;
}

// Función para validar si una imagen es válida (base64, blob URL o URL regular)
const isValidBase64Image = (url: string): boolean => {
    if (!url) {
        return false;
    }

    // ✅ Blob URLs son siempre válidas (creadas por URL.createObjectURL)
    if (url.startsWith('blob:')) {
        console.log('✅ [ImagePreviewGrid] Blob URL válida:', url.substring(0, 50));
        return true;
    }

    // ✅ URLs HTTP/HTTPS regulares son válidas
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
        console.log('✅ [ImagePreviewGrid] URL regular válida:', url.substring(0, 50));
        return true;
    }

    // ✅ Validar data URLs (base64)
    if (url.startsWith('data:image/')) {
        // Extraer la parte base64
        const base64Part = url.split(',')[1];
        if (!base64Part || base64Part.length < 1000) { // Aumentado a 1000 para detectar imágenes demasiado pequeñas
            console.warn('🚨 [ImagePreviewGrid] Imagen base64 muy pequeña o vacía:', {
                hasBase64Part: !!base64Part,
                length: base64Part?.length,
                threshold: 1000
            });
            return false;
        }

        try {
            // Verificar que el base64 sea válido
            const decoded = atob(base64Part);

            // Verificar que tenga un tamaño mínimo razonable para una imagen real
            if (decoded.length < 500) {
                console.warn('🚨 [ImagePreviewGrid] Imagen decodificada muy pequeña:', {
                    decodedLength: decoded.length,
                    minSize: 500
                });
                return false;
            }

            return true;
        } catch (error) {
            console.error('🚨 [ImagePreviewGrid] Base64 inválido:', error);
            return false;
        }
    }

    console.warn('🚨 [ImagePreviewGrid] URL no reconocida:', url.substring(0, 50));
    return false;
}; interface ImagePreviewGridProps {
    imagePreviews: ImagePreview[];
    onRemoveImage: (index: number) => void;
    fallbackImageUrl?: string;
    className?: string;
}

const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({
    imagePreviews,
    onRemoveImage,
    fallbackImageUrl = '/images/blocks-8866100_1280.png', // Imagen que ya existe en tu proyecto
    className
}) => {
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    console.log('🖼️ [ImagePreviewGrid] Renderizando:', {
        imagePreviewsCount: imagePreviews.length,
        imagePreviews: imagePreviews.map((p, i) => {
            const urlStr = typeof p.url === 'string' ? p.url : '';
            return {
                index: i,
                hasUrl: !!p.url,
                urlStart: urlStr.substring(0, 30),
                isLoading: p.isLoading,
                isExisting: p.isExisting,
                id: p.id,
                isValid: isValidBase64Image(urlStr)
            };
        })
    });

    const handleImageError = (idx: number, preview: ImagePreview) => {
        const urlStr = typeof preview.url === 'string' ? preview.url : '';
        console.error(`❌ [ImagePreviewGrid] Error cargando imagen ${idx}:`, {
            src: urlStr.substring(0, 100),
            isValid: isValidBase64Image(urlStr),
            fallback: fallbackImageUrl
        });
        setImageErrors(prev => new Set(prev).add(idx));
    };

    const getImageSrc = (preview: ImagePreview, idx: number): string => {
        const urlStr = typeof preview.url === 'string' ? preview.url : '';
        // Si ya tuvimos un error con esta imagen, usar fallback
        if (imageErrors.has(idx)) {
            return fallbackImageUrl;
        }

        // ✅ Para blob URLs, usar directamente sin validación adicional
        if (urlStr.startsWith('blob:')) {
            return urlStr;
        }

        // ✅ Para URLs regulares, usar directamente
        if (urlStr.startsWith('http') || urlStr.startsWith('/')) {
            return urlStr;
        }

        // ✅ Para data URLs, validar antes de usar
        if (urlStr.startsWith('data:image/') && !isValidBase64Image(urlStr)) {
            console.warn(`⚠️ [ImagePreviewGrid] Usando fallback para imagen base64 inválida ${idx}`);
            return fallbackImageUrl;
        }

        return urlStr || fallbackImageUrl;
    };

    if (imagePreviews.length === 0) {
        console.log('📝 [ImagePreviewGrid] No hay imágenes para mostrar');
        return null;
    }

    return (
        <div className={`${styles.imagePreviewContainer} ${className || ''}`}>
            {imagePreviews.map((preview, idx) => {
                const urlStr = typeof preview.url === 'string' ? preview.url : '';
                console.log(`🔍 [ImagePreviewGrid] Renderizando imagen ${idx}:`, {
                    hasUrl: !!preview.url,
                    isLoading: preview.isLoading,
                    urlLength: urlStr.length,
                    urlStart: urlStr.substring(0, 50),
                    isValid: isValidBase64Image(urlStr),
                    hasError: imageErrors.has(idx)
                });

                const key = preview.isExisting && preview.id
                    ? `existing-${preview.id}`
                    : preview.url || `new-${idx}`;

                const imageSrc = getImageSrc(preview, idx);
                const isUsingFallback = imageSrc === fallbackImageUrl;

                return (
                    <div key={key} className={styles.imagePreview}>
                        {preview.isLoading ? (
                            <div className={styles.imagePlaceholder}>
                                <div className={styles.loadingSpinner}></div>
                                <span>Cargando...</span>
                            </div>
                        ) : (
                            <>
                                <img
                                    src={imageSrc}
                                    alt={`preview-${idx}`}
                                    className={styles.previewImage}
                                    onLoad={() => {
                                        console.log(`✅ [ImagePreviewGrid] Imagen ${idx} cargada:`, {
                                            src: imageSrc.substring(0, 50),
                                            isUsingFallback
                                        });
                                    }}
                                    onError={() => handleImageError(idx, preview)}
                                />
                                {isUsingFallback && (
                                    <div className={styles.errorBadge}>
                                        <i className="bi bi-exclamation-triangle"></i>
                                        <span>Error</span>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className={styles.removeButton}
                                    onClick={() => onRemoveImage(idx)}
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
