import GoogleMapsWrapper from "@/components/maps/GoogleMapsWrapper";
import { useTextsWithImages } from "@/hooks/useTextsWithImages";
import React, { useMemo } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import styles from "./CardText.module.scss";

interface CardTextWithMapsProps {
    category?: string;
    showMaps?: boolean; // Nueva prop para controlar si mostrar mapas
}

function handleImgLoadingError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    e.currentTarget.src = "/images/agoraLogo.png";
}

const CardTextWithMaps: React.FC<CardTextWithMapsProps> = React.memo(({
    category,
    showMaps = false
}) => {
    const { texts, loading, error } = useTextsWithImages(category);

    // Memoizar datos del usuario para evitar re-renders innecesarios
    const userConfig = useMemo(() => {
        const userRole = sessionStorage.getItem("role");
        const viewAsUser = sessionStorage.getItem("viewAsUser") === "true";
        const isAdmin = userRole === "ROLE_ADMIN";
        return { userRole, viewAsUser, isAdmin };
    }, []);

    if (loading) {
        return <div className={styles.noDataMessage}>Cargando textos...</div>;
    }

    if (error) {
        return <div className={styles.noDataMessage}>Error: {error}</div>;
    }

    if (!texts || texts.length === 0) {
        return <div className={styles.noDataMessage}>No hay datos disponibles.</div>;
    }

    // === DOCUMENTACIÓN DEL RENDERIZADO FINAL ===
    console.log(`🎨 === CARDTEXT RENDERIZANDO CATEGORÍA "${category}" ===`);
    console.log(`📊 Total textos a renderizar: ${texts.length}`);
    console.log(`🗺️ Mostrar mapas: ${showMaps}`);

    return (
        <>
            {texts.map(({ text, images }, index: number) => {
                console.log(`🎨 === RENDERIZANDO TEXTO ${index + 1} ===`);
                console.log(`   📌 ID: ${text.id}`);
                console.log(`   📌 Título: "${text.title}"`);
                console.log(`   📌 Categoría: "${text.category}"`);

                // Construir URL de imagen correctamente
                const getCategoryFallbackImage = (category: string): string => {
                    const fallbacks: { [key: string]: string } = {
                        'nosotros': '/images/agoraLogoTras.png',
                        'servicios': '/images/agoraLogo.png',
                        'equipo': '/images/avatarGeneric.png',
                        'neurodiversidad': '/images/agoraLogo.png',
                        'cea': '/images/agoraLogo.png',
                        'atencion': '/images/agoraLogo.png',
                        'aprendizaje': '/images/agoraLogo.png',
                        'desarrollo': '/images/agoraLogo.png',
                        'comunicacion': '/images/agoraLogo.png'
                    };
                    return fallbacks[category] || '/images/agoraLogo.png';
                };

                let primaryImage = getCategoryFallbackImage(text.category);

                if (images.length > 0) {
                    const img = images[0];
                    const imageDataLength = img.imageData?.length || 0;

                    // ⚠️ DIAGNÓSTICO DE TAMAÑO DE IMAGEN
                    if (imageDataLength > 0 && imageDataLength < 5000) {
                        console.warn(`⚠️ === IMAGEN SOSPECHOSAMENTE PEQUEÑA PARA "${text.title}" ===`);
                        console.warn(`   📏 Tamaño: ${imageDataLength} caracteres (muy pequeño)`);
                    }

                    // Decidir método de carga de imagen con lógica mejorada
                    if (img.imageData && imageDataLength >= 5000) {
                        // Solo usar imageData si es lo suficientemente grande
                        primaryImage = img.imageData.startsWith('data:')
                            ? img.imageData
                            : `data:image/jpeg;base64,${img.imageData}`;
                        console.log(`✅ === USANDO IMAGEDATA PARA "${text.title}" ===`);
                    } else if (img.imageData && imageDataLength > 0) {
                        // Para imágenes pequeñas, usar endpoint URL
                        const endpointUrl = `${import.meta.env.VITE_API_ENDPOINT_TEXT_IMAGES || '/api/v1/text-images'}/${img.id}/data`;
                        primaryImage = endpointUrl;
                        console.log(`🔗 === USANDO ENDPOINT URL PARA "${text.title}" (IMAGEN PEQUEÑA) ===`);
                        console.log(`   📌 Endpoint URL: ${endpointUrl}`);
                    } else {
                        primaryImage = `${import.meta.env.VITE_API_ENDPOINT_TEXT_IMAGES || '/api/v1/text-images'}/${img.id}/data`;
                        console.log(`🔗 === USANDO ENDPOINT URL PARA "${text.title}" ===`);
                    }
                } else if (text.name_image) {
                    primaryImage = text.name_image;
                    console.log(`🏷️ === USANDO LEGACY NAME_IMAGE PARA "${text.title}" ===`);
                }

                // Determinar si este texto debe mostrar el mapa
                const shouldShowMap = showMaps &&
                    category === 'nosotros' &&
                    (text.title.toLowerCase().includes('donde') ||
                        text.title.toLowerCase().includes('ubicación') ||
                        text.title.toLowerCase().includes('estamos'));

                return (
                    <div key={`text-${text.id}`} className={styles.cardContainer}>
                        <div className={styles.cardText}>
                            <Card.Img
                                className={styles.cardImage}
                                src={primaryImage}
                                alt={text.message || "Default description"}
                                onError={handleImgLoadingError}
                                style={{ float: index % 2 === 0 ? "left" : "right" }}
                            />
                            <Card.Body>
                                <Card.Title className={styles.cardTitle}>
                                    {text.title}
                                </Card.Title>
                                <Card.Text className={styles.cardDescription}>
                                    {typeof text.message === "string"
                                        ? text.message.split('\n').map((line: string, i: number) => (
                                            <span key={i}>{line}<br /></span>
                                        ))
                                        : text.message}
                                </Card.Text>

                                {/* 🗺️ MAPA INTEGRADO - Solo para sección "Donde Estamos" */}
                                {shouldShowMap && (
                                    <div className="mt-4">
                                        <hr />
                                        <h6 className="mb-3">📍 Nuestra Ubicación</h6>
                                        <GoogleMapsWrapper
                                            address="Calle Nicaragua 16, Gijón-Oeste, 33213, Gijón, Asturias, España"
                                            centerName="Ágora Centro Educativo"
                                            className="mb-3"
                                        />
                                    </div>
                                )}

                                {userConfig.isAdmin && !userConfig.viewAsUser && (
                                    <Button
                                        variant="primary"
                                        className="mt-2"
                                    >
                                        Editar
                                    </Button>
                                )}
                            </Card.Body>
                        </div>
                    </div>
                );
            })}
        </>
    );
});

CardTextWithMaps.displayName = 'CardTextWithMaps';

export default CardTextWithMaps;
