/**
 * 🧪 Componente de prueba para CSRF Protection
 * 
 * Este componente demuestra cómo usar la protección CSRF y permite
 * probar su funcionamiento.
 */

import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import useCSRFProtection from '../../hooks/useCSRFProtection';

const CSRFTestComponent: React.FC = () => {
    const [testResult, setTestResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        testField: ''
    });

    // 🛡️ Usar protección CSRF
    const {
        csrfToken,
        csrfFormData,
        csrfHeaders,
        validateToken,
        rotateToken,
        validateOrigin,
        isLoading: csrfLoading
    } = useCSRFProtection();

    const handleTestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTestResult('');

        try {
            // Simular una request protegida por CSRF
            const testUrl = import.meta.env.VITE_API_BASE_URL + '/api/test-csrf';

            console.log('🧪 CSRFTest: Enviando request de prueba', {
                url: testUrl,
                headers: csrfHeaders,
                data: { ...formData, ...csrfFormData }
            });

            const response = await axios.post(testUrl, {
                ...formData,
                ...csrfFormData
            }, {
                headers: csrfHeaders
            });

            setTestResult(`✅ Éxito: ${JSON.stringify(response.data)}`);
        } catch (error: any) {
            console.error('🧪 CSRFTest: Error en test:', error);
            setTestResult(`❌ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleValidateToken = () => {
        const testToken = prompt('Ingresa un token para validar (deja vacío para usar el token actual):');
        const tokenToValidate = testToken || csrfToken;
        const isValid = validateToken(tokenToValidate);
        setTestResult(`🔍 Token "${tokenToValidate.substring(0, 8)}..." es ${isValid ? 'VÁLIDO ✅' : 'INVÁLIDO ❌'}`);
    };

    const handleRotateToken = () => {
        const oldToken = csrfToken.substring(0, 8);
        rotateToken();
        setTestResult(`🔄 Token rotado: ${oldToken}... → ${csrfToken.substring(0, 8)}...`);
    };

    const handleValidateOrigin = () => {
        const testOrigin = prompt('Ingresa un origen para validar (deja vacío para usar el origen actual):');
        const originToValidate = testOrigin || window.location.origin;
        const isValid = validateOrigin(originToValidate);
        setTestResult(`🌐 Origen "${originToValidate}" es ${isValid ? 'VÁLIDO ✅' : 'INVÁLIDO ❌'}`);
    };

    return (
        <Card className="mt-4">
            <Card.Header>
                <h5>🛡️ Test de Protección CSRF</h5>
            </Card.Header>
            <Card.Body>
                <Alert variant="info">
                    <strong>Token CSRF actual:</strong> {csrfToken.substring(0, 16)}...
                    <br />
                    <strong>Estado:</strong> {csrfLoading ? 'Cargando...' : 'Listo'}
                </Alert>

                <Form onSubmit={handleTestSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Campo de prueba:</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.testField}
                            onChange={(e) => setFormData({ testField: e.target.value })}
                            placeholder="Ingresa cualquier valor para probar..."
                        />
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isLoading || csrfLoading}
                        >
                            {isLoading ? 'Enviando...' : '🧪 Probar Request con CSRF'}
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={handleValidateToken}
                            disabled={csrfLoading}
                        >
                            🔍 Validar Token
                        </Button>

                        <Button
                            variant="warning"
                            onClick={handleRotateToken}
                            disabled={csrfLoading}
                        >
                            🔄 Rotar Token
                        </Button>

                        <Button
                            variant="info"
                            onClick={handleValidateOrigin}
                            disabled={csrfLoading}
                        >
                            🌐 Validar Origen
                        </Button>
                    </div>
                </Form>

                {testResult && (
                    <Alert variant={testResult.includes('✅') ? 'success' : 'danger'} className="mt-3">
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{testResult}</pre>
                    </Alert>
                )}

                <Alert variant="light" className="mt-3">
                    <h6>📋 Información técnica:</h6>
                    <ul>
                        <li><strong>Headers CSRF:</strong> {JSON.stringify(csrfHeaders, null, 2)}</li>
                        <li><strong>Form Data:</strong> {JSON.stringify(csrfFormData, null, 2)}</li>
                        <li><strong>Origen actual:</strong> {window.location.origin}</li>
                    </ul>
                </Alert>
            </Card.Body>
        </Card>
    );
};

export default CSRFTestComponent;
