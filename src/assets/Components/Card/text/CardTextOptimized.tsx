import { useTextsWithImagesOptimized } from "@/hooks/useTextsWithImagesOptimized";
import React, { useMemo } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import styles from "./CardText.module.scss";

interface CardTextOptimizedProps {
    category?: string;
    enableDetailedLogging?: boolean;
}

function handleImgLoadingError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    console.warn("🖼️ Image loading failed, using fallback");
    e.currentTarget.src = "/images/agoraLogo.png";
}

const CardTextOptimized: React.FC<CardTextOptimizedProps> = React.memo(({
    category,
    enableDetailedLogging = false
}) => {
    const { texts, loading, error, stats } = useTextsWithImagesOptimized({
        category,
        enableDetailedLogging
    });

    // Configuración del usuario memoizada
    const userConfig = useMemo(() => {
        const userRole = sessionStorage.getItem("role");
        const viewAsUser = sessionStorage.getItem("viewAsUser") === "true";
        const isAdmin = userRole === "ROLE_ADMIN";
        return { userRole, viewAsUser, isAdmin };
    }, []);

    // Estados de carga y error
    if (loading) {
        return (
            <div className={styles.noDataMessage}>
                Cargando textos{category ? ` de ${category}` : ''}...
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.noDataMessage}>
                Error: {error}
                {enableDetailedLogging && (
                    <div style={{ fontSize: '0.8em', marginTop: '10px' }}>
                        <details>
                            <summary>Detalles del error</summary>
                            <pre>{JSON.stringify({ category, error }, null, 2)}</pre>
                        </details>
                    </div>
                )}
            </div>
        );
    }

    if (!texts || texts.length === 0) {
        return (
            <div className={styles.noDataMessage}>
                No hay textos disponibles{category ? ` para la categoría ${category}` : ''}.
            </div>
        );
    }

    // Logging de estadísticas si está habilitado
    if (enableDetailedLogging) {
        console.log(`📊 CardTextOptimized Stats for "${category}":`, stats);
    }

    return (
        <>
            {/* Mostrar estadísticas de imágenes en desarrollo si está habilitado */}
            {enableDetailedLogging && (
                <div style={{
                    padding: '10px',
                    margin: '10px 0',
                    background: '#f0f0f0',
                    borderRadius: '5px',
                    fontSize: '0.9em'
                }}>
                    <strong>📊 Estadísticas de Imágenes:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>Total textos: {stats.total}</li>
                        <li>Con imágenes: {stats.withImages}</li>
                        <li>Calidad excelente: {stats.qualityBreakdown.excellent}</li>
                        <li>Calidad buena: {stats.qualityBreakdown.good}</li>
                        <li>Calidad aceptable: {stats.qualityBreakdown.acceptable}</li>
                        <li>Calidad pobre: {stats.qualityBreakdown.poor}</li>
                        <li>Imágenes corruptas: {stats.qualityBreakdown.corrupted}</li>
                        <li>Sin imágenes: {stats.qualityBreakdown.none}</li>
                    </ul>
                </div>
            )}

            {texts.map(({ text, images, primaryImageUrl, imageQuality }, index: number) => {
                if (enableDetailedLogging) {
                    console.log(`🎨 Rendering "${text.title}" with quality: ${imageQuality}, URL: ${primaryImageUrl?.substring(0, 50)}...`);
                }

                return (
                    <div key={`text-${text.id}`} className={styles.cardContainer}>
                        <div className={styles.cardText}>
                            <Card.Img
                                className={styles.cardImage}
                                src={primaryImageUrl}
                                alt={text.title || "Imagen del texto"}
                                onError={handleImgLoadingError}
                                style={{
                                    float: index % 2 === 0 ? "left" : "right",
                                    // Agregar indicador visual de calidad en desarrollo
                                    ...(enableDetailedLogging && {
                                        border: `3px solid ${imageQuality === 'excellent' ? '#28a745' :
                                                imageQuality === 'good' ? '#20c997' :
                                                    imageQuality === 'acceptable' ? '#ffc107' :
                                                        imageQuality === 'poor' ? '#fd7e14' :
                                                            imageQuality === 'corrupted' ? '#dc3545' :
                                                                '#6c757d'
                                            }`
                                    })
                                }}
                                title={enableDetailedLogging ?
                                    `Calidad: ${imageQuality}, Imágenes: ${images.length}` :
                                    text.title
                                }
                            />

                            <Card.Body>
                                <Card.Title className={styles.cardTitle}>
                                    {text.title}
                                    {enableDetailedLogging && (
                                        <span style={{
                                            fontSize: '0.7em',
                                            color: '#666',
                                            marginLeft: '10px'
                                        }}>
                                            (ID: {text.id}, Imágenes: {images.length}, Calidad: {imageQuality})
                                        </span>
                                    )}
                                </Card.Title>

                                <Card.Text className={styles.cardDescription}>
                                    {typeof text.message === "string"
                                        ? text.message.split('\n').map((line: string, i: number) => (
                                            <span key={i}>{line}<br /></span>
                                        ))
                                        : text.message}
                                </Card.Text>

                                {userConfig.isAdmin && !userConfig.viewAsUser && (
                                    <Button variant="primary">
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

CardTextOptimized.displayName = 'CardTextOptimized';

export default CardTextOptimized;
