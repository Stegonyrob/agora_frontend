/**
 * 🛠️ Página de Herramientas
 * 
 * Esta página contiene herramientas de desarrollo y testing,
 * incluyendo el componente de prueba de CSRF y el monitor de logs.
 */

import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import CSRFTestComponent from '../components/tools/CSRFTestComponent';
import LogMonitor from '../components/tools/LogMonitor';

const ToolsPage: React.FC = () => {
    return (
        <Container className="py-4">
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h2>🛠️ Herramientas de Desarrollo</h2>
                        </Card.Header>
                        <Card.Body>
                            <p>Esta página contiene herramientas útiles para desarrollo y testing.</p>
                        </Card.Body>
                    </Card>

                    {/* Componente de prueba de CSRF */}
                    <CSRFTestComponent />

                    {/* Monitor de Logs */}
                    <LogMonitor />
                </Col>
            </Row>
        </Container>
    );
};

export default ToolsPage;