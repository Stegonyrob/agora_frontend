import React, { useState } from 'react';
import { Alert, Button, Card, Form, InputGroup } from 'react-bootstrap';

const GoogleMapsEmbedGenerator: React.FC = () => {
    const [embedUrl, setEmbedUrl] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [address, setAddress] = useState('Calle Nicaragua 16, Gijón, España');

    // Función para extraer información de la URL de embed
    const parseEmbedUrl = (url: string) => {
        try {
            // Extraer coordenadas y otros parámetros de la URL
            const coordsMatch = url.match(/!2d(-?\d+\.?\d*)!3d(-?\d+\.?\d*)/);
            const nameMatch = url.match(/!2s([^!]+)/);
            const zoomMatch = url.match(/!4f(\d+\.?\d*)/);

            if (coordsMatch) {
                const lng = parseFloat(coordsMatch[1]);
                const lat = parseFloat(coordsMatch[2]);
                const name = nameMatch ? decodeURIComponent(nameMatch[1]) : 'Ubicación';
                const zoom = zoomMatch ? parseFloat(zoomMatch[1]) : 13;

                return {
                    lng,
                    lat,
                    name,
                    zoom,
                    isValid: true
                };
            }

            return { isValid: false };
        } catch (error) {
            return { isValid: false };
        }
    };

    // Generar código React del componente
    const generateReactCode = () => {
        if (!embedUrl) {
            setGeneratedCode('');
            return;
        }

        const parsed = parseEmbedUrl(embedUrl);

        if (parsed.isValid) {
            const reactCode = `// Componente de Google Maps para ${parsed.name}
import React from 'react';

const GoogleMapsLocation = () => {
  return (
    <div className="google-maps-container">
      {/* Información de ubicación */}
      <div className="location-info mb-3">
        <h5>${parsed.name}</h5>
        <p>${address}</p>
      </div>
      
      {/* Mapa embebido */}
      <div className="map-embed">
        <iframe
          loading="lazy"
          src="${embedUrl}"
          width="100%"
          height="450"
          style={{
            border: 0,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de ${parsed.name}"
        />
      </div>
      
      {/* Controles adicionales */}
      <div className="map-controls mt-3 text-center">
        <button
          className="btn btn-primary me-2"
          onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}', '_blank')}
        >
          🗺️ Ver en Google Maps
        </button>
        <button
          className="btn btn-success"
          onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}', '_blank')}
        >
          🧭 Cómo llegar
        </button>
      </div>
    </div>
  );
};

export default GoogleMapsLocation;

// CSS (opcional - agregar a tu archivo de estilos)
/*
.google-maps-container {
  .location-info {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #007bff;
  }
  
  .map-embed iframe:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: box-shadow 0.3s ease;
  }
  
  .map-controls .btn:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
  }
}
*/`;

            setGeneratedCode(reactCode);
        } else {
            setGeneratedCode('❌ URL de embed no válida. Por favor, verifica la URL.');
        }
    };

    // Generar URL de embed automáticamente desde dirección
    const generateEmbedFromAddress = () => {
        const encodedAddress = encodeURIComponent(address);
        const autoUrl = `https://www.google.com/maps/embed/v1/place?key=TU_API_KEY&q=${encodedAddress}&zoom=15`;
        setEmbedUrl(autoUrl);
    };

    return (
        <div className="container my-4">
            <Card>
                <Card.Header>
                    <h3>🗺️ Generador de Google Maps Embed</h3>
                    <p className="mb-0 text-muted">Convierte una URL de Google Maps en código React</p>
                </Card.Header>
                <Card.Body>
                    {/* Instrucciones */}
                    <Alert variant="info">
                        <h6>📋 Instrucciones:</h6>
                        <ol className="mb-0">
                            <li>Ve a <a href="https://maps.google.com" target="_blank" rel="noopener">Google Maps</a></li>
                            <li>Busca tu ubicación</li>
                            <li>Haz clic en "Compartir" → "Incorporar un mapa"</li>
                            <li>Copia la URL del iframe y pégala abajo</li>
                        </ol>
                    </Alert>

                    {/* Dirección */}
                    <Form.Group className="mb-3">
                        <Form.Label>📍 Dirección de tu negocio:</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Ej: Calle Nicaragua 16, Gijón, España"
                            />
                            <Button variant="outline-secondary" onClick={generateEmbedFromAddress}>
                                🔄 Auto-generar
                            </Button>
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Esta dirección se usará en los botones de navegación
                        </Form.Text>
                    </Form.Group>

                    {/* URL de embed */}
                    <Form.Group className="mb-3">
                        <Form.Label>🔗 URL de Google Maps Embed:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={embedUrl}
                            onChange={(e) => setEmbedUrl(e.target.value)}
                            placeholder="Pega aquí la URL que comienza con: https://www.google.com/maps/embed?pb=..."
                        />
                    </Form.Group>

                    {/* Botón para generar */}
                    <div className="text-center mb-4">
                        <Button
                            variant="success"
                            size="lg"
                            onClick={generateReactCode}
                            disabled={!embedUrl}
                        >
                            ⚡ Generar Código React
                        </Button>
                    </div>

                    {/* Código generado */}
                    {generatedCode && (
                        <div>
                            <h5>📄 Código React Generado:</h5>
                            <div className="position-relative">
                                <pre
                                    className="bg-dark text-light p-3 rounded"
                                    style={{ maxHeight: '400px', overflow: 'auto' }}
                                >
                                    <code>{generatedCode}</code>
                                </pre>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    className="position-absolute top-0 end-0 m-2"
                                    onClick={() => navigator.clipboard?.writeText(generatedCode)}
                                >
                                    📋 Copiar
                                </Button>
                            </div>

                            {/* Vista previa */}
                            <div className="mt-4">
                                <h6>👀 Vista Previa:</h6>
                                <div
                                    className="border rounded p-3"
                                    dangerouslySetInnerHTML={{
                                        __html: `<iframe src="${embedUrl}" width="100%" height="300" style="border:0; border-radius: 8px;" allowfullscreen="" loading="lazy"></iframe>`
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Ejemplo para Ágora */}
                    <Alert variant="success" className="mt-4">
                        <h6>🎯 Para tu caso específico (Ágora Centro Educativo):</h6>
                        <p>Tu URL de embed debería verse algo así:</p>
                        <code className="d-block bg-light p-2 rounded text-wrap">
                            https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2896.547!2d-5.6615!3d43.5321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDMxJzU1LjYiTiA1wrAzOSc0MS40Ilc!5e0!3m2!1ses!2ses
                        </code>
                        <p className="mt-2 mb-0">
                            <strong>Coordenadas detectadas:</strong> Gijón, Asturias (43.5321, -5.6615)
                        </p>
                    </Alert>
                </Card.Body>
            </Card>
        </div>
    );
};

export default GoogleMapsEmbedGenerator;