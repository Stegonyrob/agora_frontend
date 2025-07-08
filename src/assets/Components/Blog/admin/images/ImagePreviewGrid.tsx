import React from 'react';

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
        <div className={`image-preview-container ${className || ''}`} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '1.2rem',
            margin: '1.5rem 0',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)',
            borderRadius: '1rem',
            border: '2px solid #00bcd4',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            maxHeight: '300px',
            overflowY: 'auto'
        }}>
            {imagePreviews.map((preview, idx) => (
                <div key={idx} style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1',
                    overflow: 'hidden',
                    borderRadius: '0.8rem',
                    border: '3px solid transparent',
                    background: 'linear-gradient(#2a2a2a, #2a2a2a) padding-box, linear-gradient(45deg, #00bcd4, #00e5ff, #26c6da) border-box',
                    boxShadow: '0 4px 15px rgba(0, 188, 212, 0.2), 0 2px 8px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                }}>
                    {preview.isLoading ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            width: '100%',
                            color: '#00bcd4',
                            fontSize: '0.9rem',
                            background: 'linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%)',
                            borderRadius: '0.5rem'
                        }}>
                            <div style={{
                                border: '3px solid rgba(0, 188, 212, 0.3)',
                                borderTop: '3px solid #00bcd4',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <span style={{
                                marginTop: '8px',
                                fontWeight: '500',
                                color: '#b3e5fc'
                            }}>Cargando...</span>
                        </div>
                    ) : (
                        <>
                            <img
                                src={preview.url}
                                alt={`preview-${idx}`}
                                style={{
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '0.5rem',
                                    transition: 'transform 0.3s ease'
                                }}
                                onError={(e) => handleImageError(e, preview.url)}
                            />
                            <button
                                type="button"
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0',
                                    margin: '0',
                                    width: 'auto',
                                    height: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    zIndex: 10
                                }}
                                onClick={() => onRemoveImage(idx)}
                                title="Eliminar imagen"
                            >
                                <i className="bi bi-x-octagon" style={{
                                    fontSize: '20px',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                    lineHeight: '1',
                                    display: 'block'
                                }}></i>
                            </button>
                            {showExistingBadge && preview.isExisting && (
                                <span style={{
                                    position: 'absolute',
                                    bottom: '5px',
                                    left: '5px',
                                    background: 'linear-gradient(45deg, #00bcd4, #26c6da)',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    boxShadow: '0 2px 8px rgba(0, 188, 212, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3)',
                                    zIndex: 5,
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}>Existente</span>
                            )}
                        </>
                    )}
                </div>
            ))}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ImagePreviewGrid;
