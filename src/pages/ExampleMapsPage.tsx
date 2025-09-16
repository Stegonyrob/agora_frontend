import CardTextWithMaps from '@/assets/Components/Card/text/CardTextWithMaps';
import GoogleMapsWrapper from '@/components/maps/GoogleMapsWrapper';
import React from 'react';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';

const ExampleMapsPage: React.FC = () => {
    return (
        <Container className="my-4">
            <Row>
                <Col>
                    <h1 className="mb-4">🗺️ Ejemplo de Google Maps - Ágora Centro Educativo</h1>

                    {/* Instrucciones de configuración */}
                    <Alert variant="info" className="mb-4">
                        <Alert.Heading>📋 Configuración Necesaria</Alert.Heading>
                        <p>Para que el mapa funcione correctamente, necesitas:</p>
                        <ol>
                            <li>Una API key de Google Maps configurada en <code>VITE_GOOGLE_MAPS_API_KEY</code></li>
                            <li>Permisos de geolocalización en el navegador para calcular rutas</li>
                            <li>Conexión a internet activa</li>
                        </ol>
                        <hr />
                        <p className="mb-0">
                            <strong>💡 Tip:</strong> Si no tienes API key, el componente mostrará un botón para abrir Google Maps en una nueva pestaña.
                        </p>
                    </Alert>

                    {/* Ejemplo 1: Mapa standalone */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h3>🗺️ Opción 1: Mapa Independiente</h3>
                        </Card.Header>
                        <Card.Body>
                            <p>Este es el componente de mapa independiente que puedes usar en cualquier parte de tu aplicación:</p>
                            <GoogleMapsWrapper
                                address="Calle Nicaragua 16, Gijón-Oeste, 33213, Gijón, Asturias, España"
                                centerName="Ágora Centro Educativo"
                            />
                        </Card.Body>
                    </Card>

                    {/* Ejemplo 2: Textos con mapa integrado */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h3>📄 Opción 2: Textos con Mapa Integrado</h3>
                        </Card.Header>
                        <Card.Body>
                            <p>Esta es la sección "Nosotros" con el mapa integrado automáticamente:</p>
                            <CardTextWithMaps
                                category="nosotros"
                                showMaps={true}
                            />
                        </Card.Body>
                    </Card>

                    {/* Funcionalidades disponibles */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h3>⚡ Funcionalidades Disponibles</h3>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <h5>🧭 Navegación</h5>
                                    <ul>
                                        <li><strong>¿Cómo llegar?</strong> - Calcula ruta desde tu ubicación</li>
                                        <li><strong>Ver en Google Maps</strong> - Abre la app nativa</li>
                                        <li><strong>Navegación directa</strong> - Inicia navegación GPS</li>
                                    </ul>
                                </Col>
                                <Col md={6}>
                                    <h5>🎯 Características</h5>
                                    <ul>
                                        <li><strong>Geolocalización automática</strong></li>
                                        <li><strong>Cálculo de rutas en tiempo real</strong></li>
                                        <li><strong>Información de distancia y tiempo</strong></li>
                                        <li><strong>Marcador personalizado con logo</strong></li>
                                    </ul>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Código de ejemplo */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h3>💻 Código de Ejemplo</h3>
                        </Card.Header>
                        <Card.Body>
                            <h5>Uso Básico:</h5>
                            <pre className="bg-light p-3 rounded">
                                {`// Mapa independiente
import GoogleMapsWrapper from '@/components/maps/GoogleMapsWrapper';

<GoogleMapsWrapper
  address="Calle Nicaragua 16, Gijón-Oeste, 33213, Gijón, Asturias, España"
  centerName="Ágora Centro Educativo"
/>

// Textos con mapa integrado
import CardTextWithMaps from '@/assets/Components/Card/text/CardTextWithMaps';

<CardTextWithMaps 
  category="nosotros" 
  showMaps={true}
/>`}
                            </pre>

                            <h5 className="mt-4">Configuración de Variables de Entorno:</h5>
                            <pre className="bg-light p-3 rounded">
                                {`# En tu archivo .env
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui`}
                            </pre>
                        </Card.Body>
                    </Card>

                    {/* Instrucciones de implementación */}
                    <Alert variant="success">
                        <Alert.Heading>🚀 ¿Cómo implementar en tu página?</Alert.Heading>
                        <p>Para usar el mapa en la sección "Nosotros" de tu web:</p>
                        <ol>
                            <li>Reemplaza <code>CardText</code> por <code>CardTextWithMaps</code> en tu componente</li>
                            <li>Agrega la prop <code>showMaps={'{true}'}</code></li>
                            <li>Configura tu API key de Google Maps</li>
                            <li>¡Listo! El mapa aparecerá automáticamente en "Donde Estamos"</li>
                        </ol>
                    </Alert>
                </Col>
            </Row>
        </Container>
    );
};

export default ExampleMapsPage;
