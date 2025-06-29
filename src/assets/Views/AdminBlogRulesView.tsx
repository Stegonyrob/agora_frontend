import BlogRules from '@/assets/Components/Legal/BlogRules';
import BlogRulesEditor from '@/assets/Components/Legal/BlogRulesEditor';
import { LegalTextDTO } from '@/core/legals/LegalTextDTO';
import { LegalTextService } from '@/core/legals/LegalTextService';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap';
import styles from './AdminBlogRulesView.module.scss';

const AdminBlogRulesView: React.FC = () => {
    const [blogRules, setBlogRules] = useState<LegalTextDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    useEffect(() => {
        loadBlogRules();
    }, []);

    const loadBlogRules = async () => {
        try {
            setLoading(true);
            setError(null);
            const legalTextService = new LegalTextService();
            const rulesData = await legalTextService.getLegalTextByType('blog-rules');

            setBlogRules(rulesData);
            if (rulesData?.updatedAt) {
                setLastUpdated(new Date(rulesData.updatedAt).toLocaleString('es-ES'));
            }
        } catch (error) {
            console.error('Error loading blog rules:', error);
            setError('Error al cargar las reglas. Es posible que no hayan sido creadas aún.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEditor = () => {
        setShowEditor(true);
    };

    const handleCloseEditor = () => {
        setShowEditor(false);
    };

    const handleSaveRules = async (updatedRules: LegalTextDTO) => {
        setBlogRules(updatedRules);
        if (updatedRules.updatedAt) {
            setLastUpdated(new Date(updatedRules.updatedAt).toLocaleString('es-ES'));
        }
        // Recargar los datos para asegurar sincronización
        setTimeout(() => {
            loadBlogRules();
        }, 1000);
    };

    if (loading) {
        return (
            <Container className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Cargando reglas de la comunidad...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className={styles.container}>
            <Row className={styles.header}>
                <Col>
                    <div className={styles.titleSection}>
                        <h1 className={styles.pageTitle}>
                            📋 Administración de Reglas de la Comunidad
                        </h1>
                        <p className={styles.pageDescription}>
                            Gestiona las reglas que ven los usuarios durante el registro y en la sección de comunidad.
                        </p>
                    </div>
                </Col>
            </Row>

            {error && (
                <Row className="mb-4">
                    <Col>
                        <Alert variant="warning" className={styles.errorAlert}>
                            <Alert.Heading>⚠️ Atención</Alert.Heading>
                            <p>{error}</p>
                            <p><strong>Solución:</strong> Haz clic en "Crear/Editar Reglas" para crear las reglas por primera vez.</p>
                        </Alert>
                    </Col>
                </Row>
            )}

            <Row className="mb-4">
                <Col>
                    <Card className={styles.controlCard}>
                        <Card.Body>
                            <div className={styles.controlSection}>
                                <div className={styles.controlInfo}>
                                    <h5>🛠️ Panel de Control</h5>
                                    <p className={styles.controlDescription}>
                                        Edita el contenido de las reglas que verán los usuarios.
                                        Los cambios son inmediatos y los usuarios existentes deberán aceptar las nuevas reglas.
                                    </p>
                                    {lastUpdated && (
                                        <small className={styles.lastUpdateInfo}>
                                            <strong>Última actualización:</strong> {lastUpdated}
                                        </small>
                                    )}
                                </div>
                                <div className={styles.controlButtons}>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={handleOpenEditor}
                                        className={styles.editButton}
                                    >
                                        {blogRules ? '✏️ Editar Reglas' : '➕ Crear Reglas'}
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <Card className={styles.previewCard}>
                        <Card.Header className={styles.previewHeader}>
                            <h5>👁️ Vista Previa - Cómo ven los usuarios las reglas</h5>
                        </Card.Header>
                        <Card.Body className={styles.previewBody}>
                            {blogRules ? (
                                <div className={styles.previewContainer}>
                                    <BlogRules />
                                </div>
                            ) : (
                                <div className={styles.noRulesMessage}>
                                    <div className={styles.noRulesIcon}>📝</div>
                                    <h4>No hay reglas configuradas</h4>
                                    <p>Haz clic en "Crear Reglas" para establecer las reglas de la comunidad.</p>
                                    <p className={styles.defaultNote}>
                                        <strong>Nota:</strong> Se mostrarán reglas por defecto hasta que configures las personalizadas.
                                    </p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal del Editor */}
            <BlogRulesEditor
                show={showEditor}
                onHide={handleCloseEditor}
                onSave={handleSaveRules}
            />

            <div className={styles.helpSection}>
                <Card className={styles.helpCard}>
                    <Card.Body>
                        <h6>💡 Consejos para editar las reglas:</h6>
                        <ul className={styles.helpList}>
                            <li><strong>Título claro:</strong> Usa un título descriptivo como "Reglas de la Comunidad Ágora"</li>
                            <li><strong>Estructura organizada:</strong> Usa encabezados (H2, H3) para organizar las secciones</li>
                            <li><strong>Listas numeradas/viñetas:</strong> Para reglas específicas usa listas</li>
                            <li><strong>RGPD obligatorio:</strong> Incluye información sobre protección de datos</li>
                            <li><strong>Información de contacto:</strong> Siempre incluye cómo contactarte</li>
                            <li><strong>Vista previa:</strong> Usa el botón "Vista Previa" para ver cómo se verá</li>
                        </ul>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
};

export default AdminBlogRulesView;
