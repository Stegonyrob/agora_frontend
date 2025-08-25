/**
 * 📊 Componente de Monitoreo de Logs
 * 
 * Este componente permite:
 * 1. Ver logs en tiempo real
 * 2. Filtrar por nivel de log
 * 3. Exportar logs para análisis
 * 4. Configurar el logger en tiempo real
 * 5. Ver estadísticas del sistema de logging
 */

import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { logger } from '../../core/logging/LoggerService';

interface LogEntry {
    timestamp: number;
    level: string;
    message: string;
    data?: any;
    context?: any;
}

const LogMonitor: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
    const [filterLevel, setFilterLevel] = useState<string>('ALL');
    const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
    const [stats, setStats] = useState<any>({});

    // Mock de logs para demostración (en producción vendría del LoggerService)
    const mockLogs: LogEntry[] = [
        {
            timestamp: Date.now() - 5000,
            level: 'INFO',
            message: 'Usuario inició sesión exitosamente',
            data: { userId: '[MASKED]', component: 'FormLogin' },
            context: { component: 'FormLogin', url: '/login' }
        },
        {
            timestamp: Date.now() - 3000,
            level: 'WARN',
            message: 'Token CSRF próximo a expirar',
            data: { expiresIn: '5 minutos' },
            context: { component: 'CSRFService' }
        },
        {
            timestamp: Date.now() - 1000,
            level: 'ERROR',
            message: 'Error de validación en formulario',
            data: { field: 'email', error: 'Formato inválido' },
            context: { component: 'RegisterForm', userId: '[MASKED]' }
        },
        {
            timestamp: Date.now() - 500,
            level: 'DEBUG',
            message: 'Interceptor CSRF activado para request POST',
            data: { url: '/api/v1/posts', hasToken: true },
            context: { component: 'CSRFInterceptor' }
        }
    ];

    useEffect(() => {
        // Simular logs iniciales
        setLogs(mockLogs);
        setFilteredLogs(mockLogs);

        // Obtener estadísticas del logger
        const loggerStats = logger.getStats();
        setStats(loggerStats);
    }, []);

    useEffect(() => {
        // Filtrar logs por nivel
        if (filterLevel === 'ALL') {
            setFilteredLogs(logs);
        } else {
            setFilteredLogs(logs.filter(log => log.level === filterLevel));
        }
    }, [logs, filterLevel]);

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                // Simular nuevo log cada 10 segundos
                const newLog: LogEntry = {
                    timestamp: Date.now(),
                    level: ['DEBUG', 'INFO', 'WARN', 'ERROR'][Math.floor(Math.random() * 4)],
                    message: `Log automático ${new Date().toLocaleTimeString()}`,
                    data: { randomValue: Math.random() },
                    context: { component: 'LogMonitor' }
                };

                setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 99)]); // Mantener solo 100 logs
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [autoRefresh]);

    const handleClearLogs = () => {
        setLogs([]);
        setFilteredLogs([]);
        logger.clear();
    };

    const handleExportLogs = () => {
        const dataStr = JSON.stringify(filteredLogs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `logs-${new Date().toISOString()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    };

    const handleTestLogs = () => {
        logger.debug('Test log DEBUG desde LogMonitor', { testData: 'debug' });
        logger.info('Test log INFO desde LogMonitor', { testData: 'info' });
        logger.warn('Test log WARN desde LogMonitor', { testData: 'warn' });
        logger.error('Test log ERROR desde LogMonitor', new Error('Test error'));
    };

    const getLevelBadgeVariant = (level: string): string => {
        switch (level) {
            case 'DEBUG': return 'secondary';
            case 'INFO': return 'primary';
            case 'WARN': return 'warning';
            case 'ERROR': return 'danger';
            default: return 'light';
        }
    };

    const formatTimestamp = (timestamp: number): string => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <Card className="mt-4">
            <Card.Header>
                <Row className="align-items-center">
                    <Col>
                        <h5 className="mb-0">📊 Monitor de Logs del Sistema</h5>
                    </Col>
                    <Col xs="auto">
                        <Badge bg={stats.environment === 'development' ? 'warning' : 'success'}>
                            {stats.environment || 'unknown'}
                        </Badge>
                    </Col>
                </Row>
            </Card.Header>

            <Card.Body>
                {/* Controles */}
                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Filtrar por nivel:</Form.Label>
                            <Form.Select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                            >
                                <option value="ALL">Todos</option>
                                <option value="DEBUG">Debug</option>
                                <option value="INFO">Info</option>
                                <option value="WARN">Advertencias</option>
                                <option value="ERROR">Errores</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Auto-refresh:</Form.Label>
                            <Form.Check
                                type="switch"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                label={autoRefresh ? 'Activado' : 'Desactivado'}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6} className="d-flex align-items-end gap-2">
                        <Button variant="primary" size="sm" onClick={handleTestLogs}>
                            🧪 Generar Logs de Prueba
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleExportLogs}>
                            📥 Exportar Logs
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={handleClearLogs}>
                            🗑️ Limpiar
                        </Button>
                    </Col>
                </Row>

                {/* Estadísticas */}
                <Alert variant="info">
                    <Row>
                        <Col><strong>Logs en buffer:</strong> {stats.bufferSize || 0}</Col>
                        <Col><strong>Total logs mostrados:</strong> {filteredLogs.length}</Col>
                        <Col><strong>Consola habilitada:</strong> {stats.config?.enableConsole ? '✅' : '❌'}</Col>
                        <Col><strong>Logging remoto:</strong> {stats.config?.enableRemoteLogging ? '✅' : '❌'}</Col>
                    </Row>
                </Alert>

                {/* Tabla de logs */}
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table striped bordered hover size="sm">
                        <thead className="sticky-top bg-light">
                            <tr>
                                <th style={{ width: '140px' }}>Timestamp</th>
                                <th style={{ width: '80px' }}>Nivel</th>
                                <th style={{ width: '120px' }}>Componente</th>
                                <th>Mensaje</th>
                                <th style={{ width: '100px' }}>Datos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted">
                                        No hay logs para mostrar
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log, index) => (
                                    <tr key={index}>
                                        <td style={{ fontSize: '0.8rem' }}>
                                            {formatTimestamp(log.timestamp)}
                                        </td>
                                        <td>
                                            <Badge bg={getLevelBadgeVariant(log.level)}>
                                                {log.level}
                                            </Badge>
                                        </td>
                                        <td>
                                            <small>{log.context?.component || 'Unknown'}</small>
                                        </td>
                                        <td>{log.message}</td>
                                        <td>
                                            {log.data && (
                                                <details>
                                                    <summary style={{ cursor: 'pointer', fontSize: '0.8rem' }}>
                                                        Ver datos
                                                    </summary>
                                                    <pre style={{ fontSize: '0.7rem', margin: '5px 0' }}>
                                                        {JSON.stringify(log.data, null, 2)}
                                                    </pre>
                                                </details>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>

                {/* Configuración en tiempo real */}
                <Card className="mt-3">
                    <Card.Header>
                        <h6 className="mb-0">⚙️ Configuración del Logger</h6>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <strong>Configuración actual:</strong>
                                <pre style={{ fontSize: '0.8rem', backgroundColor: '#f8f9fa', padding: '10px' }}>
                                    {JSON.stringify(stats.config, null, 2)}
                                </pre>
                            </Col>
                            <Col md={6}>
                                <Alert variant="warning" className="mb-0">
                                    <strong>⚠️ Nota:</strong> En producción, muchos de estos logs no serán visibles
                                    por razones de seguridad y rendimiento. Este monitor es principalmente para desarrollo.
                                </Alert>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Card.Body>
        </Card>
    );
};

export default LogMonitor;
