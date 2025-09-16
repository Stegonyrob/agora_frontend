import React from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import GoogleMapsLocation from './GoogleMapsLocation';

interface GoogleMapsWrapperProps {
    address?: string;
    centerName?: string;
    className?: string;
    apiKey?: string;
}

const GoogleMapsWrapper: React.FC<GoogleMapsWrapperProps> = ({
    address,
    centerName,
    className,
    apiKey
}) => {
    // Usar la API key desde el environment o la proporcionada
    const mapsApiKey = apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    const { isLoaded, loadError, isLoading } = useGoogleMaps({
        apiKey: mapsApiKey,
        libraries: ['geometry', 'places'],
        region: 'ES',
        language: 'es'
    });

    // Mostrar estado de carga
    if (isLoading) {
        return (
            <div className="text-center p-4">
                <Spinner animation="border" role="status" className="mb-2">
                    <span className="visually-hidden">Cargando mapa...</span>
                </Spinner>
                <p>Cargando Google Maps...</p>
            </div>
        );
    }

    // Mostrar error si no se puede cargar
    if (loadError) {
        return (
            <Alert variant="warning">
                <Alert.Heading>⚠️ Error al cargar el mapa</Alert.Heading>
                <p>{loadError}</p>
                <hr />
                <div className="d-flex justify-content-center">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || 'Calle Nicaragua 16, Gijón, España')}`, '_blank')}
                    >
                        🗺️ Ver en Google Maps
                    </button>
                </div>
            </Alert>
        );
    }

    // Mostrar mensaje si no hay API key
    if (!mapsApiKey) {
        return (
            <Alert variant="info">
                <Alert.Heading>🗺️ Mapa no disponible</Alert.Heading>
                <p>Para mostrar el mapa interactivo, necesitas configurar una API key de Google Maps.</p>
                <hr />
                <div className="text-center">
                    <button
                        className="btn btn-primary"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || 'Calle Nicaragua 16, Gijón, España')}`, '_blank')}
                    >
                        🗺️ Ver ubicación en Google Maps
                    </button>
                </div>
                <hr />
                <details className="mt-3">
                    <summary style={{ cursor: 'pointer' }}>💡 ¿Cómo configurar la API key?</summary>
                    <div className="mt-2">
                        <ol>
                            <li>Ve a <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                            <li>Crea un nuevo proyecto o selecciona uno existente</li>
                            <li>Habilita la "Maps JavaScript API"</li>
                            <li>Crea credenciales (API key)</li>
                            <li>Agrega la key como <code>VITE_GOOGLE_MAPS_API_KEY</code> en tu archivo .env</li>
                        </ol>
                    </div>
                </details>
            </Alert>
        );
    }

    // Mostrar el mapa cuando esté cargado
    if (isLoaded) {
        return (
            <GoogleMapsLocation
                address={address}
                centerName={centerName}
                className={className}
            />
        );
    }

    // Estado por defecto
    return (
        <div className="text-center p-4">
            <p>Preparando el mapa...</p>
        </div>
    );
};

export default GoogleMapsWrapper;
