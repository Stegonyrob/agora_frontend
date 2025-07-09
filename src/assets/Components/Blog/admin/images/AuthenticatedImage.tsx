import React, { memo, useEffect, useRef, useState } from 'react';
import EventImageService from '../../../../../core/events/EventImageService';

interface AuthenticatedImageProps {
    imageId: number;
    alt: string;
    style?: React.CSSProperties;
    fallbackImageUrl?: string;
}

const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({
    imageId,
    alt,
    style,
    fallbackImageUrl = '/images/avatarGeneric.png',
}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        let blobUrl: string | null = null;

        const loadImage = async () => {
            if (!imageId) {
                if (isMountedRef.current) {
                    setHasError(true);
                    setIsLoading(false);
                }
                return;
            }

            if (isMountedRef.current) {
                setIsLoading(true);
                setHasError(false);
                setImageSrc(null); // Reset image while loading new one
            }

            try {
                const eventImageService = new EventImageService();
                const token = sessionStorage.getItem("accessToken");
                if (!token) {
                    throw new Error("No authentication token available");
                }

                const imageUrl = eventImageService.buildImageUrl(imageId);
                const response = await fetch(imageUrl, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const blob = await response.blob();
                if (blob.size === 0) {
                    throw new Error("Empty image response");
                }

                blobUrl = URL.createObjectURL(blob);

                if (isMountedRef.current) {
                    setImageSrc(blobUrl);
                } else {
                    // Component unmounted before we could set state, clean up blob
                    URL.revokeObjectURL(blobUrl);
                    blobUrl = null;
                }

            } catch (error) {
                console.error(`Error loading authenticated image ${imageId}:`, error);
                if (isMountedRef.current) {
                    setHasError(true);
                }
            } finally {
                if (isMountedRef.current) {
                    setIsLoading(false);
                }
            }
        };

        loadImage();

        return () => {
            isMountedRef.current = false;
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [imageId]);

    if (isLoading) {
        return (
            <div style={{
                ...style,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.1)',
                color: '#666'
            }}>
                Cargando...
            </div>
        );
    }

    if (hasError || !imageSrc) {
        return (
            <img
                src={fallbackImageUrl}
                alt={alt}
                style={style}
            />
        );
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            style={style}
            onError={() => {
                // This can happen if the blob URL becomes invalid.
                // We'll mark it as an error to show the fallback.
                console.warn(`Image load error for blob URL of imageId ${imageId}`);
                setHasError(true);
            }}
        />
    );
};

export default memo(AuthenticatedImage);
