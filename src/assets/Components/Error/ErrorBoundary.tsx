/**
 * 🛡️ Error Boundary - Captura errores React no manejados
 * 
 * Este componente:
 * 1. Captura errores de React que no fueron manejados
 * 2. Los envía al sistema de logging
 * 3. Muestra una UI de error amigable al usuario
 * 4. Evita que la app se crashee completamente
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Card, Container } from 'react-bootstrap';
import { logger } from '../../../core/logging/LoggerService';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    errorId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // Actualizar el state para mostrar la UI de error
        return {
            hasError: true,
            error,
            errorId: `err_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const errorId = `err_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

        // Log del error usando nuestro sistema de logging
        logger.critical('React Error Boundary: Error no manejado capturado', {
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            },
            errorInfo: {
                componentStack: errorInfo.componentStack
            },
            errorId,
            url: globalThis.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        }, {
            component: 'ErrorBoundary'
        });

        // Actualizar state con información del error
        this.setState({
            errorInfo,
            errorId
        });

        // Llamar callback personalizado si existe
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // En desarrollo, también loggear a console para debugging
        if (import.meta.env.NODE_ENV === 'development') {
            console.group(`🚨 Error Boundary - ${errorId}`);
            console.error('Error:', error);
            console.error('Component Stack:', errorInfo.componentStack);
            console.groupEnd();
        }
    }

    handleReload = () => {
        logger.info('Error Boundary: Usuario solicitó recarga de página', {
            errorId: this.state.errorId
        }, {
            component: 'ErrorBoundary'
        });

        globalThis.location.reload();
    };

    handleGoHome = () => {
        logger.info('Error Boundary: Usuario navegó a inicio', {
            errorId: this.state.errorId
        }, {
            component: 'ErrorBoundary'
        });

        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null
        });

        globalThis.location.href = '/';
    };

    handleRetry = () => {
        logger.info('Error Boundary: Usuario intentó reintentar', {
            errorId: this.state.errorId
        }, {
            component: 'ErrorBoundary'
        });

        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null
        });
    };

    render() {
        if (this.state.hasError) {
            // Si hay un fallback personalizado, usarlo
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // UI de error por defecto
            return (
                <Container className="mt-5">
                    <Card className="mx-auto" style={{ maxWidth: '600px' }}>
                        <Card.Header className="bg-danger text-white">
                            <h4 className="mb-0">🚨 Algo salió mal</h4>
                        </Card.Header>
                        <Card.Body>
                            <Alert variant="danger">
                                <Alert.Heading>Error en la aplicación</Alert.Heading>
                                <p>
                                    Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado
                                    automáticamente y trabajará para solucionarlo.
                                </p>

                                {import.meta.env.NODE_ENV === 'development' && this.state.error && (
                                    <details className="mt-3">
                                        <summary style={{ cursor: 'pointer' }}>
                                            <strong>Detalles del error (solo visible en desarrollo)</strong>
                                        </summary>
                                        <pre className="mt-2 p-2 bg-light" style={{ fontSize: '0.8rem', overflow: 'auto' }}>
                                            <strong>Error:</strong> {this.state.error.message}
                                            {'\n'}
                                            <strong>Stack:</strong> {this.state.error.stack}
                                            {'\n'}
                                            <strong>Component Stack:</strong> {this.state.errorInfo?.componentStack}
                                        </pre>
                                    </details>
                                )}

                                <hr />
                                <div className="d-flex gap-2 flex-wrap">
                                    <Button variant="primary" onClick={this.handleRetry}>
                                        🔄 Intentar de nuevo
                                    </Button>
                                    <Button variant="secondary" onClick={this.handleGoHome}>
                                        🏠 Ir al inicio
                                    </Button>
                                    <Button variant="outline-secondary" onClick={this.handleReload}>
                                        ↻ Recargar página
                                    </Button>
                                </div>

                                {this.state.errorId && (
                                    <small className="text-muted mt-2 d-block">
                                        ID del error: <code>{this.state.errorId}</code>
                                    </small>
                                )}
                            </Alert>
                        </Card.Body>
                    </Card>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
