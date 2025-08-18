import { IEventImage } from '@/core/events/IEvent';
import { EventImageRepository } from '@/core/events/images/EventImageRepository';
import { IPostImage } from '@/core/posts/images/IPostImage';
import { PostImageRepository } from '@/core/posts/images/PostImageRepository';
import { useEffect, useState } from 'react';

interface UseImageLoaderResult {
    images: string[];
    loading: boolean;
    error: string | null;
}

export const useImageLoader = (
    type: 'event' | 'post',
    imageData?: string[] | IEventImage[] | IPostImage[],
    isAdminContext: boolean = false  // Nuevo parámetro para contexto de admin
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
                const eventImageRepo = new EventImageRepository();
                const postImageRepo = new PostImageRepository();

                const imagePromises = imageData.map(async (img: any, index: number) => {
                    if (type === 'event' && typeof img === 'object' && img.id !== undefined) {
                        try {
                            let blobUrl: string;

                            if (isAdminContext) {
                                blobUrl = await eventImageRepo.getImageAsBlob(img.id);
                            } else {
                                blobUrl = await eventImageRepo.getPublicImageAsBlob(img.id);
                            }

                            return blobUrl;
                        } catch (error) {
                        }
                    }

                    if (type === 'post') {
                        if (typeof img === 'object' && img !== null && img.id && img.id !== null && !img.isMock) {
                            try {
                                const blobUrl = await postImageRepo.getImageAsBlob(img.id);
                                return blobUrl;

                            } catch (error) {
                            }
                        }

                        if (typeof img === 'object' && img !== null) {
                            const imageName = img.imageName || String(img);
                            return getPostImageFallback(imageName);
                        } else if (typeof img === 'string') {
                            return getPostImageFallback(img);
                        }
                    }

                    return processImageData(img);
                });

                const urls = await Promise.all(imagePromises);
                const validUrls = urls.filter((url): url is string => url !== null);
                setImages(validUrls);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error loading images';
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
