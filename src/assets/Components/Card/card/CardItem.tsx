import ButtonAttendee from '@/assets/Components/Blog/admin/button/attendee/ButtonAttendee';
import LikeButton from '@/assets/Components/Blog/admin/button/favorite/ButtonFavoriteHeart';
import { IEventImage } from '@/core/events/IEvent';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AccordionComments from '../../Blog/comments/AccordionComments';
import styles from './CardItem.module.scss';

interface CardItemProps {
    type: 'event' | 'post';
    id: number;
    title: string;
    description: string;
    creationDate: string;
    eventDate?: string; // Fecha específica del evento
    favoritesCount: number;
    commentsCount?: number;
    attendeesCount: number;
    location?: string;
    images?: string[] | IEventImage[]; // Soporte para ambos formatos
    tags?: { id: number; name: string; archived?: boolean }[]
    user?: any;
    userRole?: string;
    onSelect?: (item: any) => void;
    maxCapacity?: number;
    userId?: number;
    requireLogin?: boolean;
}

const CardItem: React.FC<CardItemProps> = ({
    type,
    id,
    title,
    description,
    creationDate,
    eventDate,
    favoritesCount,
    commentsCount,
    attendeesCount = 0,
    location,
    images,
    tags = [],
    onSelect,
    maxCapacity = 0,
    userId = 1,
    userRole,
}) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [showFull, setShowFull] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

    // Acceso seguro a perfiles y avatares del store
    const profiles = useSelector((state: RootState) => state.profile.profiles);
    const avatars = useSelector((state: RootState) => state.avatars.avatars);


    // --- Usar directamente las imágenes que vienen del repository ---
    const [processedImages, setProcessedImages] = useState<string[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);

    useEffect(() => {
        async function processImages() {
            setLoadingImages(true);
            try {
                if (type === 'event' && images && Array.isArray(images) && images.length > 0) {
                    const imagePromises = images.map(async (img: any) => {
                        // Si img es un objeto IEventImage con id, obtener JSON del backend
                        if (typeof img === 'object' && img.id !== undefined) {
                            console.log(`🔍 [CardItem] Obteniendo imagen del backend para ID: ${img.id}`);
                            try {
                                const response = await fetch(`http://localhost:8080/api/v1/all/event-images/${img.id}`);
                                if (response.ok) {
                                    const imageData = await response.json();

                                    // Análisis detallado del contenido base64
                                    const base64Data = imageData.imageData;
                                    let detectedMimeType = 'image/jpeg'; // default

                                    if (base64Data) {
                                        // Detectar tipo por header base64
                                        if (base64Data.startsWith('/9j/')) {
                                            detectedMimeType = 'image/jpeg';
                                        } else if (base64Data.startsWith('iVBORw0KGgo')) {
                                            detectedMimeType = 'image/png';
                                        } else if (base64Data.startsWith('R0lGODlh')) {
                                            detectedMimeType = 'image/gif';
                                        }

                                        console.log(`📦 [CardItem] ANÁLISIS COMPLETO para imagen ${img.id}:`, {
                                            id: imageData.id,
                                            imageName: imageData.imageName,
                                            imageTypeFromBackend: imageData.imageType,
                                            detectedMimeType: detectedMimeType,
                                            base64Length: base64Data.length,
                                            base64Header: base64Data.substring(0, 50),
                                            base64First100: base64Data.substring(0, 100),
                                            isValidJpegHeader: base64Data.startsWith('/9j/'),
                                            isValidPngHeader: base64Data.startsWith('iVBORw0KGgo')
                                        });

                                        // Log separado del contenido base64 completo
                                        console.log(`🔍 [CardItem] BASE64 COMPLETO para imagen ${img.id}:`, base64Data);
                                    }

                                    // ✨ LÓGICA HÍBRIDA: Detectar placeholders vs imágenes reales
                                    if (imageData.imageData && imageData.imageData.length > 1000) {
                                        // Base64 largo = imagen real del backend
                                        const dataUrl = `data:${detectedMimeType};base64,${imageData.imageData}`;
                                        console.log(`✅ [CardItem] Usando imagen REAL del backend para ${img.id}:`, {
                                            mimeUsed: detectedMimeType,
                                            dataUrlLength: dataUrl.length,
                                            source: 'backend'
                                        });
                                        return dataUrl;
                                    } else {
                                        // Base64 corto = placeholder, usar imagen local temporal
                                        const localImages = {
                                            // Mapeo de IDs a imágenes locales temporales
                                            1: '/images/img/niñoFichas.jpg',       // Taller juegos mesa 1
                                            2: '/images/img/adolescentesGrupal.jpg', // Taller juegos mesa 2  
                                            3: '/images/img/ivan.jpg',             // Escuela padres 1
                                            4: '/images/img/edificio.jpg'          // Escuela padres 2
                                        };

                                        const fallbackImage = localImages[img.id as keyof typeof localImages] || '/images/img/alumnosOrdenador.jpg';
                                        console.log(`🖼️ [CardItem] Usando imagen LOCAL temporal para ${img.id}:`, {
                                            originalLength: imageData.imageData ? imageData.imageData.length : 0,
                                            localImage: fallbackImage,
                                            source: 'local-fallback',
                                            reason: 'backend-image-too-small'
                                        });
                                        return fallbackImage;
                                    }
                                } else {
                                    console.warn(`❌ [CardItem] Respuesta no OK para imagen ${img.id}: ${response.status}`);
                                    return null;
                                }
                            } catch (error) {
                                console.error(`❌ [CardItem] Error obteniendo imagen ${img.id}:`, error);
                                return null;
                            }
                        }

                        // Si img es un objeto con imageData (base64 o URL)
                        if (typeof img === 'object' && img.imageData) {
                            console.log(`🔍 [CardItem] Procesando imagen con imageData`);
                            // Si es base64, crear data URL
                            if (img.imageData.startsWith('/9j/') || img.imageData.startsWith('iVBORw0KGgo')) {
                                return `data:image/jpeg;base64,${img.imageData}`;
                            }
                            // Si es una URL, usarla directamente
                            return img.imageData;
                        }

                        // Si img es una URL directa (string)
                        if (typeof img === 'string') {
                            console.log(`🔍 [CardItem] Procesando imagen string: ${img}`);
                            if (img.startsWith('http')) {
                                return img;
                            }
                            // Si es base64 sin data URL prefix
                            if (img.startsWith('/9j/') || img.startsWith('iVBORw0KGgo')) {
                                return `data:image/jpeg;base64,${img}`;
                            }
                            return img;
                        }
                        return null;
                    });

                    const urls = await Promise.all(imagePromises);
                    const validUrls = urls.filter((url): url is string => url !== null);
                    setProcessedImages(validUrls);
                    console.log('🖼️ [CardItem] Imágenes procesadas para evento:', { id, urls: validUrls });

                } else if (type === 'post' && images) {
                    // Lógica para posts (sin cambios)
                    let imageUrls: any[] = [];
                    if (Array.isArray(images)) {
                        imageUrls = images.map((img: any) => {
                            if (typeof img === 'string') {
                                return img.startsWith('http') ? img : `/images/posts/${img}`;
                            }
                            if (typeof img === 'object' && img.id) {
                                return `/api/v1/post-images/${img.id}/data`;
                            }
                            return img;
                        });
                    } else if (typeof images === 'string' && images) {
                        const imgStr = images as string;
                        imageUrls = [imgStr.startsWith('http') ? imgStr : `/images/posts/${imgStr}`];
                    }
                    setProcessedImages(imageUrls.filter(Boolean));
                    console.log('🖼️ [CardItem] Imágenes de post procesadas:', { id, imageUrls });
                } else {
                    // Sin imágenes disponibles
                    setProcessedImages([]);
                    console.log('📭 [CardItem] Sin imágenes para mostrar:', { id, type });
                }
            } catch (error) {
                console.error('❌ [CardItem] Error procesando imágenes:', error);
                setProcessedImages([]);
            } finally {
                setLoadingImages(false);
            }
        }

        processImages();
    }, [type, id, images]);    // LOGS detallados como en admin
    useEffect(() => {
        console.log('🔍 [CardItem] Debug:', {
            id,
            type,
            title,
            description,
            images,
            processedImages
        });
    }, [id, type, title, description, images, processedImages]);

    const showPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev === 0 ? (processedImages.length || 1) - 1 : prev - 1));
    };

    const showNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (processedImages && prev === processedImages.length - 1 ? 0 : prev + 1));
    };

    // Fecha y lugar juntos para eventos
    const displayDate = type === 'event' && eventDate ? eventDate : creationDate;
    const eventInfo = type === 'event' && location
        ? `${location} · ${new Date(displayDate).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })}`
        : undefined;

    // Share Button Popup
    // ...existing code...

    // Renderizado de imágenes replicando lógica admin
    return (
        <>
            <article className={`${styles.card} ${type === 'event' ? styles.event : ''}`} onClick={() => onSelect && onSelect({ id })}>
                <div className={styles.header}>
                    {loadingImages ? (
                        <div className={styles.imagePlaceholder}>
                            <div className={styles.loadingSpinner}></div>
                            <span className={styles.loadingText}>Cargando imágenes...</span>
                        </div>
                    ) : processedImages && processedImages.length > 1 ? (
                        <div className={styles.carousel}>
                            <button className={styles.arrow} onClick={showPrev}>&lt;</button>
                            <img
                                className={styles.thumbnail}
                                src={processedImages[currentImage] || "/images/blocks-8866100_1280.png"}
                                alt={`Imagen ${currentImage + 1} de ${title}`}
                                onError={(e) => {
                                    console.error('❌ [CardItem] Error cargando imagen carousel:', {
                                        originalSrc: processedImages[currentImage],
                                        imageIndex: currentImage,
                                        totalImages: processedImages.length,
                                        allImages: processedImages,
                                        errorEvent: e,
                                        fallbackUsed: "/images/blocks-8866100_1280.png"
                                    });
                                    e.currentTarget.src = "/images/blocks-8866100_1280.png";
                                }}
                            />
                            <button className={styles.arrow} onClick={showNext}>&gt;</button>
                            <div className={styles.dots}>
                                {processedImages.map((_, idx) => (
                                    <span
                                        key={idx}
                                        className={currentImage === idx ? styles.dot + ' ' + styles.active : styles.dot}
                                        onClick={e => { e.stopPropagation(); setCurrentImage(idx); }}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <img
                            className={styles.thumbnail}
                            src={processedImages && processedImages.length > 0 && processedImages[0] ? processedImages[0] : "/images/blocks-8866100_1280.png"}
                            alt="thumbnail"
                            onError={(e) => {
                                console.error('❌ [CardItem] Error cargando imagen simple:', {
                                    originalSrc: processedImages && processedImages.length > 0 ? processedImages[0] : 'sin imagen',
                                    hasProcessedImages: !!processedImages,
                                    processedImagesLength: processedImages ? processedImages.length : 0,
                                    allImages: processedImages,
                                    errorEvent: e,
                                    fallbackUsed: "/images/blocks-8866100_1280.png"
                                });
                                e.currentTarget.src = "/images/blocks-8866100_1280.png";
                            }}
                        />
                    )}
                    <span className={styles.favoriteIcon}>
                        <LikeButton
                            postId={id}
                            type={type} />
                    </span>
                    {type === 'event' && (
                        <span className={styles.eventDate}>{eventInfo}</span>
                    )}
                </div>
                <div className={styles.body}>
                    <h3 className={styles.title}>{title}</h3>
                    {type === 'post' && (
                        <p className={styles.date}>{new Date(displayDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        })}</p>
                    )}
                    <p className={styles.description}>
                        {type === 'post' && description.length > 250
                            ? (
                                <>
                                    {showFull ? description : `${description.slice(0, 250)}... `}
                                    <button
                                        className={styles.seeMore}
                                        onClick={e => { e.stopPropagation(); setShowFull(!showFull); }}
                                    >
                                        {showFull ? 'Ver menos' : 'Ver más'}
                                    </button>
                                </>
                            )
                            : description
                        }
                    </p>
                    <ul className={styles.tags}>
                        {tags && tags.length > 0 ? (
                            tags.map((tag) => (
                                <li key={tag.id} className={styles.tagItem}>#{tag.name}</li>
                            ))
                        ) : (
                            <>
                                {type === 'event' && <li className={styles.tagItem}>#Event</li>}
                                {type === 'post' && <li className={styles.tagItem}>#Post</li>}
                            </>
                        )}
                    </ul>
                </div>
                {/* !-- stadistic!  */}
                <div className={styles.footer}>
                    <div className={styles.stats}>
                        {type === 'event' && (
                            <div className={styles.capacityInfo}>
                                Aforo: {maxCapacity}
                            </div>
                        )}
                        {type === 'post' && (
                            <div style={{ marginTop: '1rem' }}>
                                <AccordionComments postId={id} />

                            </div>
                        )}
                        {type === 'event' && (
                            <ButtonAttendee
                                eventId={id}
                                maxCapacity={maxCapacity}
                            />
                        )}
                    </div>
                    {type === 'event' && (
                        <div className={styles.share}>
                            <button
                                className={styles.share}
                                onClick={e => { e.stopPropagation(); setShareOpen(!shareOpen); }}
                            >
                                <i className="fa-solid fa-share"></i>
                            </button>
                            <ul className={`${styles.popup} ${shareOpen ? styles.active : ""}`}>
                                <li>
                                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-twitter-x"></i>
                                    </a>
                                    <a href={`https://wa.me/?text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-whatsapp"></i>
                                    </a>
                                    <a href={`https://wa.me/?text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-facebook"></i>
                                    </a>
                                    <a href={`https://wa.me/?text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-instagram"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </article >
        </>
    );
}

export default CardItem;