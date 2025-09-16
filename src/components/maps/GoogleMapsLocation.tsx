import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import './GoogleMapsLocation.scss';

interface GoogleMapsLocationProps {
    address?: string;
    centerName?: string;
    className?: string;
}

// Coordenadas de Ágora Centro Educativo
const AGORA_LOCATION = {
    address: "Calle Nicaragua 16, Gijón-Oeste, 33213, Gijón, Asturias, España",
    lat: 43.5321,  // Coordenadas aproximadas de Gijón Oeste
    lng: -5.6615,
    name: "Ágora Centro Educativo"
};

const GoogleMapsLocation: React.FC<GoogleMapsLocationProps> = ({
    address = AGORA_LOCATION.address,
    centerName = AGORA_LOCATION.name,
    className = ""
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

    // Verificar si Google Maps está disponible
    const isGoogleMapsLoaded = useCallback(() => {
        return typeof window !== 'undefined' && window.google && window.google.maps;
    }, []);

    // Inicializar el mapa
    const initializeMap = useCallback(() => {
        if (!mapRef.current || !isGoogleMapsLoaded()) return;

        try {
            const mapInstance = new google.maps.Map(mapRef.current, {
                center: { lat: AGORA_LOCATION.lat, lng: AGORA_LOCATION.lng },
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: true,
                mapTypeControl: true,
                fullscreenControl: true,
                zoomControl: true,
            });

            // Marker para Ágora Centro Educativo
            const agoraMarker = new google.maps.Marker({
                position: { lat: AGORA_LOCATION.lat, lng: AGORA_LOCATION.lng },
                map: mapInstance,
                title: centerName,
                icon: {
                    url: '/images/agoraLogo.png',
                    scaledSize: new google.maps.Size(40, 40),
                },
            });

            // Info Window para el centro
            const infoWindow = new google.maps.InfoWindow({
                content: `
          <div style="padding: 10px; max-width: 300px;">
            <h5 style="margin: 0 0 10px 0; color: #333;">${centerName}</h5>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">${address}</p>
            <div style="text-align: center;">
              <button 
                onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}', '_blank')" 
                style="background: #4285f4; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;"
              >
                🧭 Abrir en Google Maps
              </button>
            </div>
          </div>
        `,
            });

            // Mostrar info window al hacer clic en el marker
            agoraMarker.addListener('click', () => {
                infoWindow.open(mapInstance, agoraMarker);
            });

            // Servicios de direcciones
            const directionsServiceInstance = new google.maps.DirectionsService();
            const directionsRendererInstance = new google.maps.DirectionsRenderer({
                draggable: true,
                panel: undefined,
            });

            directionsRendererInstance.setMap(mapInstance);

            setMap(mapInstance);
            setDirectionsService(directionsServiceInstance);
            setDirectionsRenderer(directionsRendererInstance);

            console.log('✅ Google Maps inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando Google Maps:', error);
            setError('Error al inicializar el mapa');
        }
    }, [address, centerName]);

    // Obtener ubicación del usuario
    const getUserLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError('La geolocalización no está soportada en este navegador');
            return;
        }

        setIsLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('✅ Ubicación del usuario obtenida:', position.coords);
                setUserLocation(position);
                setIsLoading(false);
            },
            (error) => {
                console.error('❌ Error obteniendo ubicación:', error);
                let errorMessage = 'Error obteniendo tu ubicación';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Permiso de ubicación denegado. Por favor, permite el acceso a tu ubicación.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Información de ubicación no disponible.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Tiempo de espera agotado al obtener la ubicación.';
                        break;
                }

                setError(errorMessage);
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 minutos
            }
        );
    }, []);

    // Calcular y mostrar ruta
    const calculateRoute = useCallback(() => {
        if (!directionsService || !directionsRenderer || !userLocation || !map) {
            console.warn('⚠️ Servicios de direcciones no disponibles');
            return;
        }

        setIsLoading(true);
        setError(null);

        const origin = new google.maps.LatLng(
            userLocation.coords.latitude,
            userLocation.coords.longitude
        );

        const destination = new google.maps.LatLng(
            AGORA_LOCATION.lat,
            AGORA_LOCATION.lng
        );

        const request: google.maps.DirectionsRequest = {
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
        };

        directionsService.route(request, (result, status) => {
            setIsLoading(false);

            if (status === google.maps.DirectionsStatus.OK && result) {
                console.log('✅ Ruta calculada exitosamente');
                directionsRenderer.setDirections(result);

                // Ajustar el zoom para mostrar toda la ruta
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(origin);
                bounds.extend(destination);
                map.fitBounds(bounds);

                // Mostrar información de la ruta
                const route = result.routes[0];
                const leg = route.legs[0];

                const routeInfo = `
          <div style="padding: 15px; max-width: 350px;">
            <h5 style="margin: 0 0 10px 0; color: #333;">🧭 Ruta a ${centerName}</h5>
            <p style="margin: 5px 0; font-size: 14px;"><strong>📏 Distancia:</strong> ${leg.distance?.text}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>⏱️ Tiempo estimado:</strong> ${leg.duration?.text}</p>
            <p style="margin: 10px 0 5px 0; font-size: 12px; color: #666;">
              Desde: ${leg.start_address}<br>
              Hasta: ${leg.end_address}
            </p>
            <div style="text-align: center; margin-top: 15px;">
              <button 
                onclick="window.open('https://www.google.com/maps/dir/${userLocation.coords.latitude},${userLocation.coords.longitude}/${encodeURIComponent(address)}', '_blank')" 
                style="background: #34a853; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; margin-right: 10px;"
              >
                🚗 Navegar
              </button>
              <button 
                onclick="this.parentElement.parentElement.parentElement.style.display='none'" 
                style="background: #ea4335; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;"
              >
                ❌ Cerrar
              </button>
            </div>
          </div>
        `;

                const routeInfoWindow = new google.maps.InfoWindow({
                    content: routeInfo,
                    position: destination,
                });

                routeInfoWindow.open(map);
            } else {
                console.error('❌ Error calculando la ruta:', status);
                setError('No se pudo calcular la ruta. Inténtalo de nuevo.');
            }
        });
    }, [directionsService, directionsRenderer, userLocation, map, address, centerName]);

    // Inicializar cuando Google Maps esté disponible
    useEffect(() => {
        if (isGoogleMapsLoaded()) {
            initializeMap();
        } else {
            // Esperar a que Google Maps se cargue
            const checkGoogleMaps = setInterval(() => {
                if (isGoogleMapsLoaded()) {
                    clearInterval(checkGoogleMaps);
                    initializeMap();
                }
            }, 100);

            return () => clearInterval(checkGoogleMaps);
        }
    }, [initializeMap, isGoogleMapsLoaded]);

    // Calcular ruta automáticamente cuando tengamos ubicación del usuario
    useEffect(() => {
        if (userLocation && directionsService && directionsRenderer && map) {
            calculateRoute();
        }
    }, [userLocation, directionsService, directionsRenderer, map, calculateRoute]);

    return (
        <div className={`google-maps-location ${className}`}>
            {/* Controles */}
            <div className="map-controls">
                <Button
                    variant="primary"
                    onClick={getUserLocation}
                    disabled={isLoading}
                    className="me-2"
                >
                    {isLoading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                            />
                            Obteniendo ubicación...
                        </>
                    ) : (
                        <>
                            📍 ¿Cómo llegar?
                        </>
                    )}
                </Button>

                <Button
                    variant="outline-secondary"
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')}
                >
                    🗺️ Ver en Google Maps
                </Button>
            </div>

            {/* Alertas de error */}
            {error && (
                <Alert variant="warning" className="mt-2" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Información de ubicación */}
            <div className="location-info">
                <h5>{centerName}</h5>
                <p>{address}</p>
            </div>

            {/* Contenedor del mapa */}
            <div
                ref={mapRef}
                className="map-container"
                style={{
                    width: '100%',
                    height: '400px',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                }}
            />

            {/* Instrucciones */}
            <div className="map-instructions">
                <small className="text-muted">
                    💡 <strong>Instrucciones:</strong>
                    <ul>
                        <li>Haz clic en "¿Cómo llegar?" para obtener indicaciones desde tu ubicación</li>
                        <li>Haz clic en el marcador del mapa para más opciones</li>
                        <li>Utiliza "Ver en Google Maps" para abrir la aplicación nativa</li>
                    </ul>
                </small>
            </div>
        </div>
    );
};

export default GoogleMapsLocation;
