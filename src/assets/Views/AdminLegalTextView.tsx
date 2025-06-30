import LegalTextGeneric from '@/assets/Components/Legal/LegalTextGeneric';
import { LegalTextDTO } from '@/core/legals/LegalTextDTO';
import { LegalTextService } from '@/core/legals/LegalTextService';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import styles from './scss/AdminLegalTextView.module.scss';

const AdminLegalTextView: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const [legalText, setLegalText] = useState<LegalTextDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const [editForm, setEditForm] = useState({
        title: '',
        content: ''
    });
    const [saving, setSaving] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [previewMode, setPreviewMode] = useState(false);

    const validTypes: { [key: string]: string } = {
        'terms': 'Términos y Condiciones',
        'privacy': 'Política de Privacidad',
        'cookies': 'Política de Cookies',
        'blog-rules': 'Reglas del Blog'
    };

    const currentType = type || 'terms';
    const displayName = validTypes[currentType] || 'Texto Legal';

    useEffect(() => {
        loadLegalText();
    }, [currentType]);

    const loadLegalText = async () => {
        try {
            setLoading(true);
            setError(null);
            const legalTextService = new LegalTextService();
            const textData = await legalTextService.getLegalTextByType(currentType);

            setLegalText(textData);
            setEditForm({
                title: textData.title || getDefaultTitle(),
                content: textData.content || getDefaultContent()
            });

            if (textData?.updatedAt) {
                setLastUpdated(new Date(textData.updatedAt).toLocaleString('es-ES'));
            }
        } catch (error) {
            console.error('Error loading legal text:', error);
            setError(`Error al cargar ${displayName.toLowerCase()}. Es posible que no hayan sido creados aún.`);
            // Cargar valores por defecto
            setEditForm({
                title: getDefaultTitle(),
                content: getDefaultContent()
            });
        } finally {
            setLoading(false);
        }
    };

    const getDefaultTitle = () => {
        return displayName + ' - Ágora Centro Educativo';
    };

    const getDefaultContent = () => {
        switch (currentType) {
            case 'terms':
                return `<h2>Términos y Condiciones de Uso</h2>
<p>Bienvenido a Ágora Centro Educativo de Apoyo Especializado. Al utilizar nuestros servicios, usted acepta cumplir con estos términos.</p>
<h3>1. Uso del Servicio</h3>
<p>Nuestros servicios están destinados a proporcionar apoyo educativo especializado.</p>
<h3>2. Responsabilidades del Usuario</h3>
<p>Los usuarios se comprometen a utilizar el servicio de manera responsable.</p>
<h3>3. Contacto</h3>
<p>Para cualquier consulta: centroeducativoagora@gmail.com</p>`;

            case 'privacy':
                return `<h2>Política de Privacidad</h2>
<p>En Ágora Centro Educativo respetamos su privacidad y nos comprometemos a proteger sus datos personales.</p>
<h3>1. Información que Recopilamos</h3>
<p>Recopilamos información necesaria para brindar nuestros servicios educativos.</p>
<h3>2. Uso de la Información</h3>
<p>Utilizamos su información únicamente para los fines educativos acordados.</p>
<h3>3. Protección de Datos</h3>
<p>Implementamos medidas de seguridad para proteger su información.</p>
<h3>4. Contacto</h3>
<p>Para consultas sobre privacidad: centroeducativoagora@gmail.com</p>`;

            case 'cookies':
                return `<h2>Política de Cookies</h2>
<p>Este sitio web utiliza cookies para mejorar su experiencia de navegación.</p>
<h3>1. ¿Qué son las cookies?</h3>
<p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo.</p>
<h3>2. Cookies que Utilizamos</h3>
<p>Utilizamos cookies esenciales para el funcionamiento del sitio y cookies analíticas para mejorar nuestros servicios.</p>
<h3>3. Control de Cookies</h3>
<p>Puede controlar y eliminar cookies a través de la configuración de su navegador.</p>
<h3>4. Contacto</h3>
<p>Para consultas: centroeducativoagora@gmail.com</p>`;

            case 'blog-rules':
                return `<h2>Reglas de la Comunidad Ágora</h2>
<p>Bienvenido a la comunidad de Ágora Centro Educativo. Para mantener un ambiente respetuoso y constructivo, te pedimos que sigas estas reglas:</p>
<h3>1. Respeto y Cortesía</h3>
<p>Trata a todos los miembros con respeto. No se tolerarán insultos, discriminación o comportamiento ofensivo.</p>
<h3>2. Contenido Apropiado</h3>
<p>Comparte contenido relacionado con educación y apoyo. Evita spam, contenido inapropiado o comercial no autorizado.</p>
<h3>3. Privacidad</h3>
<p>Respeta la privacidad de otros. No compartas información personal sin consentimiento.</p>
<h3>4. Moderación</h3>
<p>Los moderadores pueden editar o eliminar contenido que no cumpla estas reglas.</p>
<h3>5. Contacto</h3>
<p>Para consultas sobre las reglas: centroeducativoagora@gmail.com</p>`;

            default:
                return '<p>Contenido por defecto</p>';
        }
    };

    const handleOpenEditor = () => {
        setShowEditor(true);
    };

    const handleCloseEditor = () => {
        setShowEditor(false);
        setPreviewMode(false);
    };

    // Funciones para formatear texto automáticamente
    const addTitle = () => {
        const newText = '\n<h2>Nuevo Título</h2>\n';
        setEditForm(prev => ({ ...prev, content: prev.content + newText }));
    };

    const addSubtitle = () => {
        const newText = '\n<h3>Nuevo Subtítulo</h3>\n';
        setEditForm(prev => ({ ...prev, content: prev.content + newText }));
    };

    const addParagraph = () => {
        const newText = '\n<p>Escribe aquí tu párrafo...</p>\n';
        setEditForm(prev => ({ ...prev, content: prev.content + newText }));
    };

    const addList = () => {
        const newText = '\n<ul>\n<li>Primer elemento</li>\n<li>Segundo elemento</li>\n<li>Tercer elemento</li>\n</ul>\n';
        setEditForm(prev => ({ ...prev, content: prev.content + newText }));
    };

    const addNumberedList = () => {
        const newText = '\n<ol>\n<li>Primer punto</li>\n<li>Segundo punto</li>\n<li>Tercer punto</li>\n</ol>\n';
        setEditForm(prev => ({ ...prev, content: prev.content + newText }));
    };

    const addBold = () => {
        const newText = '<strong>Texto en negrita</strong>';
        setEditForm(prev => ({ ...prev, content: prev.content + newText }));
    };

    const addEmail = () => {
        const newText = '<a href="mailto:centroeducativoagora@gmail.com">centroeducativoagora@gmail.com</a>';
        setEditForm(prev => ({ ...prev, content: prev.content + newText }));
    };

    const clearContent = () => {
        if (confirm('¿Estás seguro de que quieres borrar todo el contenido?')) {
            setEditForm(prev => ({ ...prev, content: '' }));
        }
    };

    const useTemplate = () => {
        if (confirm('¿Quieres usar la plantilla por defecto? Esto reemplazará el contenido actual.')) {
            setEditForm(prev => ({
                ...prev,
                title: getDefaultTitle(),
                content: getDefaultContent()
            }));
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const legalTextService = new LegalTextService();

            const legalTextData: LegalTextDTO = {
                type: currentType,
                title: editForm.title,
                content: editForm.content
            };

            let savedText;
            if (legalText?.id) {
                savedText = await legalTextService.updateLegalText(legalText.id, legalTextData);
            } else {
                savedText = await legalTextService.createLegalText(legalTextData);
            }

            setLegalText(savedText);
            if (savedText.updatedAt) {
                setLastUpdated(new Date(savedText.updatedAt).toLocaleString('es-ES'));
            }

            setShowEditor(false);
            setTimeout(() => {
                loadLegalText();
            }, 1000);
        } catch (error) {
            console.error('Error saving legal text:', error);
            alert('Error al guardar. Por favor, inténtelo de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Cargando {displayName.toLowerCase()}...</p>
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
                            📄 Administrar {displayName}
                        </h1>
                        <p className={styles.pageDescription}>
                            Edita el contenido de {displayName.toLowerCase()} que verán los usuarios.
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
                            <p><strong>Solución:</strong> Haz clic en "Crear/Editar" para crear el contenido por primera vez.</p>
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
                                        Edita el contenido que verán los usuarios en la página de {displayName.toLowerCase()}.
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
                                        {legalText ? '✏️ Editar' : '➕ Crear'}
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
                            <h5>👁️ Vista Previa - Cómo lo ven los usuarios</h5>
                        </Card.Header>
                        <Card.Body className={styles.previewBody}>
                            {legalText ? (
                                <div className={styles.previewContainer}>
                                    <LegalTextGeneric
                                        type={currentType}
                                        mainTitle={legalText.title}
                                        text={legalText.content}
                                        updatedAt={legalText.updatedAt ?? ""}
                                    />
                                </div>
                            ) : (
                                <div className={styles.noContentMessage}>
                                    <div className={styles.noContentIcon}>📝</div>
                                    <h4>No hay contenido configurado</h4>
                                    <p>Haz clic en "Crear" para establecer el contenido de {displayName.toLowerCase()}.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Editor Modal */}
            {showEditor && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>✏️ Editor Simple de {displayName}</h3>
                            <Button variant="outline-secondary" onClick={handleCloseEditor}>
                                ✕
                            </Button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.editorHelp}>
                                <h5>📝 Guía Rápida:</h5>
                                <p>Usa los botones de abajo para agregar elementos. No necesitas saber programación.</p>
                            </div>

                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label><strong>📋 Título del Documento</strong></Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Ej: Política de Cookies - Ágora Centro Educativo"
                                        className={styles.titleInput}
                                    />
                                </Form.Group>

                                {/* Barra de herramientas */}
                                <div className={styles.toolbar}>
                                    <h6>🛠️ Herramientas de Formato:</h6>
                                    <div className={styles.toolbarButtons}>
                                        <Button variant="outline-primary" size="sm" onClick={addTitle}>
                                            📝 Título Grande
                                        </Button>
                                        <Button variant="outline-secondary" size="sm" onClick={addSubtitle}>
                                            📄 Subtítulo
                                        </Button>
                                        <Button variant="outline-info" size="sm" onClick={addParagraph}>
                                            📃 Párrafo
                                        </Button>
                                        <Button variant="outline-success" size="sm" onClick={addList}>
                                            • Lista
                                        </Button>
                                        <Button variant="outline-warning" size="sm" onClick={addNumberedList}>
                                            1. Lista Numerada
                                        </Button>
                                        <Button variant="outline-dark" size="sm" onClick={addBold}>
                                            <strong>Negrita</strong>
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={addEmail}>
                                            📧 Email
                                        </Button>
                                    </div>
                                    <div className={styles.toolbarActions}>
                                        <Button variant="outline-warning" size="sm" onClick={useTemplate}>
                                            🔄 Usar Plantilla
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={clearContent}>
                                            🗑️ Borrar Todo
                                        </Button>
                                        <Button
                                            variant={previewMode ? "primary" : "outline-primary"}
                                            size="sm"
                                            onClick={() => setPreviewMode(!previewMode)}
                                        >
                                            👁️ {previewMode ? "Editar" : "Vista Previa"}
                                        </Button>
                                    </div>
                                </div>

                                <Form.Group className="mb-3">
                                    <Form.Label><strong>📝 Contenido del Documento</strong></Form.Label>
                                    {previewMode ? (
                                        <div className={styles.previewArea}>
                                            <div dangerouslySetInnerHTML={{ __html: editForm.content }} />
                                        </div>
                                    ) : (
                                        <>
                                            <Form.Control
                                                as="textarea"
                                                rows={12}
                                                value={editForm.content}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                                                placeholder="El contenido aparecerá aquí. Usa los botones de arriba para agregar elementos..."
                                                className={styles.contentTextarea}
                                            />
                                            <div className={styles.helpText}>
                                                <small>
                                                    💡 <strong>Consejos:</strong>
                                                    <br />• Usa los botones de arriba para agregar elementos
                                                    <br />• Puedes editar el texto que aparece entre las etiquetas
                                                    <br />• Cambia "Texto de ejemplo" por tu contenido real
                                                    <br />• Usa "Vista Previa" para ver cómo se verá
                                                </small>
                                            </div>
                                        </>
                                    )}
                                </Form.Group>
                            </Form>
                        </div>
                        <div className={styles.modalFooter}>
                            <Button variant="secondary" onClick={handleCloseEditor}>
                                ❌ Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                disabled={saving}
                                className={styles.saveButton}
                            >
                                {saving ? '⏳ Guardando...' : '💾 Guardar'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default AdminLegalTextView;
