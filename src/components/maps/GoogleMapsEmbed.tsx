import React, { useState } from 'react';
import { Alert, Button, ButtonGroup } from 'react-bootstrap';
import './GoogleMapsEmbed.scss';
import GoogleMapsWrapper from './GoogleMapsWrapper';

interface GoogleMapsEmbedProps {
    address?: string;
    centerName?: string;
    className?: string;
    embedUrl?: string;
    showModeToggle?: boolean;
}

// URL de embed para Ágora Centro Educativo (coordenadas de Gijón Oeste)
const AGORA_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2896.547!2d-5.6615!3d43.5321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDMxJzU1LjYiTiA1wrAzOSc0MS40Ilc!5e0!3m2!1ses!2ses!4v1694789234567";

const GoogleMapsEmbed: React.FC<GoogleMapsEmbedProps> = ({
    address = "Calle Nicaragua 16, Gijón-Oeste, 33213, Gijón, Asturias, España",
    centerName = "Ágora Centro Educativo",
    className = "",
    embedUrl = AGORA_EMBED_URL,
    showModeToggle = true
}) => {
    const [mapMode, setMapMode] = useState<'embed' | 'interactive'>('embed');

    // URL de embed personalizada para Ágora
    const customEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'demo'}&q=${encodeURIComponent(address)}&zoom=15&maptype=roadmap&language=es&region=ES`;

    return (
        <div className={`google-maps-embed ${className}`}>
            {/* Controles de modo (opcional) */}
            {showModeToggle && (
                <div className="map-mode-controls mb-3">
                    <ButtonGroup className="w-100">
                        <Button
                            variant={mapMode === 'embed' ? 'primary' : 'outline-primary'}
                            onClick={() => setMapMode('embed')}
                        >
                            🗺️ Vista Simple
                        </Button>
                        <Button
                            variant={mapMode === 'interactive' ? 'primary' : 'outline-primary'}
                            onClick={() => setMapMode('interactive')}
                        >
                            🧭 Con Navegación
                        </Button>
                    </ButtonGroup>
                </div>
            )}

            {/* Información de ubicación */}
            <div className="location-header mb-3">
                <h5 className="mb-1">{centerName}</h5>
                <p className="text-muted mb-0">{address}</p>
            </div>

            {/* Mapa según el modo seleccionado */}
            {mapMode === 'embed' ? (
                <div className="embed-container">
                    <iframe
                        loading="lazy"
                        src={import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? customEmbedUrl : embedUrl}
                        width="100%"
                        height="450"
                        style={{
                            border: 0,
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Mapa de ${centerName}`}
                    />

                    {/* Controles adicionales para embed */}
                    <div className="embed-controls mt-3">
                        <div className="d-flex justify-content-center gap-2">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')}
                            >
                                🗺️ Abrir en Google Maps
                            </Button>
                            <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank')}
                            >
                                🧭 Cómo llegar
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <GoogleMapsWrapper
                    address={address}
                    centerName={centerName}
                />
            )}

            {/* Información adicional */}
            <div className="map-info mt-3">
                <Alert variant="light" className="mb-0">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <div>
                            <strong>📍 Ubicación:</strong> {address}
                        </div>
                        <div className="mt-2 mt-md-0">
                            <Button
                                variant="link"
                                size="sm"
                                className="p-0"
                                onClick={() => navigator.clipboard?.writeText(address)}
                            >
                                📋 Copiar dirección
                            </Button>
                        </div>
                    </div>
                </Alert>
            </div>
        </div>
    );
};

export default GoogleMapsEmbed;