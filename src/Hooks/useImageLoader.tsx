import { IEventImage } from '@/core/events/IEvent';
import { EventImageService } from '@/core/events/images/EventImageService';
import { logger } from '@/core/logging/LoggerService';
import { IPostImage } from '@/core/posts/images/IPostImage';
import { PostImageService } from '@/core/posts/images/PostImageService';
import { useEffect, useState } from 'react';

interface UseImageLoaderResult {
    images: string[];
    loading: boolean;
    error: string | null;
}

export const useImageLoader = (
    type: 'event' | 'post',
    imageData?: string[] | IEventImage[] | IPostImage[],
    isAdminContext: boolean = false
): UseImageLoaderResult => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const detectMimeType = (base64Data: string): string => {
        if (base64Data.startsWith('/9j/')) return 'image/jpeg';
        if (base64Data.startsWith('iVBORw0KGgo')) return 'image/png';
        if (base64Data.startsWith('R0lGODlh')) return 'image/gif';
        return 'image/jpeg'; // default
    };

    const getPostImageFallback = (imageName: string): string => {
        const postImageFallbacks: Record<string, string> = {
            'selectividad_alimentaria_1.jpg': '/images/img/niñoFichas.jpg',
            'selectividad_alimentaria_2.jpg': '/images/img/adolescentesGrupal.jpg',
            'presuncion_competencia_1.jpg': '/images/img/ivan.jpg',
            'presuncion_competencia_2.jpg': '/images/img/edificio.jpg',
            'comunicacion_caa_1.jpg': '/images/img/alumnosOrdenador.jpg',
            'experiencias_alimentarias_1.jpg': '/images/img/escritorio.jpg',
            'experiencias_alimentarias_2.jpg': '/images/img/niñoFichas.jpg',
            'mitos_autismo_1.jpg': '/images/img/adolescentesGrupal.jpg',
            'apoyo_centrado_persona_1.jpg': '/images/img/ivan.jpg',
            'apoyo_centrado_persona_2.jpg': '/images/img/edificio.jpg'
        };

        return postImageFallbacks[imageName] || `/images/posts/${imageName}`;
    };

    const processImageData = (img: any): string | null => {
        if (typeof img === 'object' && img.imageData) {
            if (img.imageData.startsWith('/9j/') || img.imageData.startsWith('iVBORw0KGgo')) {
                const mimeType = detectMimeType(img.imageData);
                const dataUrl = `data:${mimeType};base64,${img.imageData}`;
                return dataUrl;
            }
            return img.imageData;
        }

        if (typeof img === 'string') {
            if (img.startsWith('http')) return img;
            if (img.startsWith('/9j/') || img.startsWith('iVBORw0KGgo')) {
                const mimeType = detectMimeType(img);
                return `data:${mimeType};base64,${img}`;
            }
            return type === 'post' ? `/images/posts/${img}` : img;
        }

        return null;
    };

    useEffect(() => {
        const loadImages = async () => {
            if (!imageData || !Array.isArray(imageData) || imageData.length === 0) {
                setImages([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                logger.debug('useImageLoader: Iniciando carga de imágenes', {
                    type,
                    imageCount: imageData.length,
                    isAdminContext
                }, {
                    component: 'useImageLoader'
                });

                if (type === 'event') {
                    // Usar EventImageService para eventos
                    const eventImageService = new EventImageService();

                    // Si los elementos tienen ID, obtener desde el servicio
                    const firstItem = imageData[0];
                    if (typeof firstItem === 'object' && firstItem !== null && 'eventId' in firstItem) {
                        const eventId = (firstItem as IEventImage).eventId;
                        const imagesWithUrls = await eventImageService.getEventImagesWithUrls(eventId, isAdminContext);
                        const urls = imagesWithUrls
                            .filter(img => img.url)
                            .map(img => img.url!);

                        console.log('📷 [useImageLoader] URLs finales de evento:', {
                            eventId,
                            imageCount: urls.length,
                            urls
                        });

                        logger.debug('useImageLoader: Imágenes de evento cargadas', {
                            eventId,
                            imageCount: urls.length
                        }, {
                            component: 'useImageLoader'
                        });

                        setImages(urls);
                        return;
                    }
                }

                if (type === 'post') {
                    const postImageService = new PostImageService();

                    const imagePromises = imageData.map(async (img: any, index: number) => {
                        if (typeof img === 'object' && img !== null && img.id && img.id !== null && !img.isMock) {
                            try {
                                // Use new imagePath-based system for posts if available
                                if (img.imagePath) {
                                    return postImageService.buildImageUrl(img.imagePath);
                                }

                                // If no imagePath but has imageName, try static image
                                if (img.imageName) {
                                    return `http://localhost:8080/temp_images/${img.imageName}`;
                                }

                                // Last resort: try to construct URL from ID (but this may fail)
                                logger.warn('useImageLoader: No imagePath or imageName available, skipping image', {
                                    imageId: img.id,
                                    imageObject: img
                                }, {
                                    component: 'useImageLoader'
                                });
                                return null;
                            } catch (error) {
                                logger.error('useImageLoader: Error cargando imagen de post', {
                                    imageId: img.id,
                                    error: error instanceof Error ? error.message : String(error)
                                }, {
                                    component: 'useImageLoader'
                                });
                                return null;
                            }
                        }

                        if (typeof img === 'object' && img !== null) {
                            const imageName = img.imageName || String(img);
                            return getPostImageFallback(imageName);
                        } else if (typeof img === 'string') {
                            return getPostImageFallback(img);
                        }

                        return processImageData(img);
                    });

                    const urls = await Promise.all(imagePromises);
                    const validUrls = urls.filter((url): url is string => url !== null);
                    setImages(validUrls);
                    return;
                }

                // Fallback para otros tipos o casos legacy
                const imagePromises = imageData.map(async (img: any) => {
                    return processImageData(img);
                });

                const urls = await Promise.all(imagePromises);
                const validUrls = urls.filter((url): url is string => url !== null);
                setImages(validUrls);

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error loading images';
                logger.error('useImageLoader: Error general cargando imágenes', {
                    type,
                    isAdminContext,
                    error: errorMessage
                }, {
                    component: 'useImageLoader'
                });
                setError(errorMessage);
                setImages([]);
            } finally {
                setLoading(false);
            }
        };

        loadImages();
    }, [type, imageData, isAdminContext]);

    useEffect(() => {
        return () => {
            images.forEach(url => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [images]);

    return { images, loading, error };
};
