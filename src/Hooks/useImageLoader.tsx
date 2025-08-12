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
    imageData?: string[] | IEventImage[] | IPostImage[]
): UseImageLoaderResult => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper function to detect MIME type from base64 header
    const detectMimeType = (base64Data: string): string => {
        if (base64Data.startsWith('/9j/')) return 'image/jpeg';
        if (base64Data.startsWith('iVBORw0KGgo')) return 'image/png';
        if (base64Data.startsWith('R0lGODlh')) return 'image/gif';
        return 'image/jpeg'; // default
    };

    // Helper function para mapear nombres de archivos de posts a imágenes locales
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

    // Process different image data formats
    const processImageData = (img: any): string | null => {
        console.log('🖼️ [useImageLoader] processImageData called with:', img);

        if (typeof img === 'object' && img.imageData) {
            console.log('🖼️ [useImageLoader] Found imageData in object:', {
                imageDataLength: img.imageData.length,
                imageDataStart: img.imageData.substring(0, 50)
            });

            if (img.imageData.startsWith('/9j/') || img.imageData.startsWith('iVBORw0KGgo')) {
                const mimeType = detectMimeType(img.imageData);
                const dataUrl = `data:${mimeType};base64,${img.imageData}`;
                console.log('🖼️ [useImageLoader] Generated data URL from imageData:', {
                    mimeType,
                    dataUrlLength: dataUrl.length
                });
                return dataUrl;
            }
            return img.imageData;
        }

        if (typeof img === 'string') {
            console.log('🖼️ [useImageLoader] Processing string image:', img.substring(0, 50));
            if (img.startsWith('http')) return img;
            if (img.startsWith('/9j/') || img.startsWith('iVBORw0KGgo')) {
                const mimeType = detectMimeType(img);
                return `data:${mimeType};base64,${img}`;
            }
            return type === 'post' ? `/images/posts/${img}` : img;
        }

        console.log('🖼️ [useImageLoader] Could not process image data:', typeof img);
        return null;
    };

    useEffect(() => {
        const loadImages = async () => {
            console.log('🎯 [useImageLoader] ==> Starting image loading process:', {
                type,
                hasImageData: !!imageData,
                imageDataType: typeof imageData,
                imageDataLength: Array.isArray(imageData) ? imageData.length : 0,
                imageData
            });

            if (!imageData || !Array.isArray(imageData) || imageData.length === 0) {
                console.log('❌ [useImageLoader] No valid image data provided - setting empty array');
                setImages([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                console.log(`🔄 [useImageLoader] Processing ${imageData.length} images for type: ${type}`);

                const eventImageRepo = new EventImageRepository();
                const postImageRepo = new PostImageRepository();

                const imagePromises = imageData.map(async (img: any, index: number) => {
                    console.log(`🖼️ [useImageLoader] Processing image ${index + 1}/${imageData.length}:`, {
                        imageType: typeof img,
                        isObject: typeof img === 'object',
                        hasImageData: typeof img === 'object' && !!img.imageData,
                        hasId: typeof img === 'object' && !!img.id,
                        isMock: typeof img === 'object' && !!img.isMock,
                        imageData: img
                    });

                    // Load from backend API for events with IDs
                    if (type === 'event' && typeof img === 'object' && img.id !== undefined) {
                        try {
                            console.log(`🖼️ [useImageLoader] Loading from API for image ID: ${img.id}`);
                            const imageData = await eventImageRepo.getPublicImageJson(img.id);
                            console.log(`🖼️ [useImageLoader] API response for ${img.id}:`, imageData);

                            if (imageData.imageData) {
                                const mimeType = detectMimeType(imageData.imageData);
                                const dataUrl = `data:${mimeType};base64,${imageData.imageData}`;

                                // Si es muy pequeño (< 500 chars), usar fallback local directamente
                                if (imageData.imageData.length < 500) {
                                    const localImages = {
                                        1: '/images/img/niñoFichas.jpg',
                                        2: '/images/img/adolescentesGrupal.jpg',
                                        3: '/images/img/ivan.jpg',
                                        4: '/images/img/edificio.jpg'
                                    };
                                    const fallbackImage = localImages[img.id as keyof typeof localImages] || '/images/img/alumnosOrdenador.jpg';
                                    console.log(`🖼️ [useImageLoader] Using LOCAL fallback (too small) for ${img.id}:`, {
                                        originalLength: imageData.imageData.length,
                                        fallbackImage
                                    });
                                    return fallbackImage;
                                } else {
                                    console.log(`✅ [useImageLoader] Using backend image for ${img.id}:`, {
                                        mimeType,
                                        base64Length: imageData.imageData.length,
                                        dataUrlLength: dataUrl.length
                                    });
                                    return dataUrl;
                                }
                            }
                        } catch (error) {
                            console.error(`🖼️ [useImageLoader] Error loading image ${img.id}:`, error);
                        }
                    }

                    // Load images for posts - using real Swagger endpoints with blob URLs
                    if (type === 'post') {
                        console.log(`🖼️ [useImageLoader] Processing POST image:`, img);

                        // Si es un objeto con ID real (no mock)
                        if (typeof img === 'object' && img !== null && img.id && img.id !== null && !img.isMock) {
                            try {
                                console.log(`🖼️ [useImageLoader] Loading POST image from API for image ID: ${img.id}`);

                                // Para posts, usar blob URL ya que las URLs con token fallan en browser
                                console.log(`🔄 [useImageLoader] Converting POST image ${img.id} to blob URL...`);
                                const blobUrl = await postImageRepo.getImageAsBlob(img.id);
                                console.log(`✅ [useImageLoader] Created blob URL for POST image ${img.id}: ${blobUrl.substring(0, 50)}...`);
                                return blobUrl;

                            } catch (error) {
                                console.warn(`⚠️ [useImageLoader] Backend POST image failed for ${img.id}, using fallback:`, error);
                            }
                        }

                        // Para objetos mock o strings, usar fallback inteligente
                        if (typeof img === 'object' && img !== null) {
                            const imageName = img.imageName || String(img);
                            console.log(`🖼️ [useImageLoader] Using POST object fallback for: ${imageName}`);
                            return getPostImageFallback(imageName);
                        } else if (typeof img === 'string') {
                            console.log(`🖼️ [useImageLoader] Using POST string fallback for: ${img}`);
                            return getPostImageFallback(img);
                        }
                    }

                    // Handle other image formats (direct base64, URLs, etc.)
                    const processedImage = processImageData(img);
                    console.log(`🖼️ [useImageLoader] Processed image ${index}:`, processedImage);
                    return processedImage;
                });

                const urls = await Promise.all(imagePromises);
                const validUrls = urls.filter((url): url is string => url !== null);
                console.log('🖼️ [useImageLoader] Final processed images:', validUrls);
                setImages(validUrls);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error loading images';
                console.error('🖼️ [useImageLoader] Error:', errorMessage);
                setError(errorMessage);
                setImages([]);
            } finally {
                setLoading(false);
            }
        };

        loadImages();
    }, [type, imageData]);

    // Cleanup blob URLs when component unmounts or images change
    useEffect(() => {
        return () => {
            images.forEach(url => {
                if (url.startsWith('blob:')) {
                    console.log(`🧹 [useImageLoader] Cleaning up blob URL: ${url.substring(0, 50)}...`);
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [images]);

    return { images, loading, error };
};
