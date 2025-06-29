import { Editor } from '@tinymce/tinymce-react';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { LegalTextDTO } from '../../../core/legals/LegalTextDTO';
import { LegalTextService } from '../../../core/legals/LegalTextService';
import styles from './BlogRulesEditor.module.scss';

interface BlogRulesEditorProps {
    show: boolean;
    onHide: () => void;
    onSave?: (updatedRules: LegalTextDTO) => void;
}

const BlogRulesEditor: React.FC<BlogRulesEditorProps> = ({ show, onHide, onSave }) => {
    const [blogRules, setBlogRules] = useState<LegalTextDTO | null>(null);
    const [editorContent, setEditorContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar reglas existentes cuando se abre el modal
    useEffect(() => {
        if (show) {
            loadBlogRules();
        }
    }, [show]);

    const loadBlogRules = async () => {
        try {
            setLoading(true);
            setError(null);
            const legalTextService = new LegalTextService();
            const rulesData = await legalTextService.getLegalTextByType('blog-rules');

            if (rulesData) {
                setBlogRules(rulesData);
                setTitle(rulesData.title);
                setEditorContent(rulesData.content);
            } else {
                // Si no existen reglas, crear unas por defecto
                setTitle('Reglas de la Comunidad Ágora');
                setEditorContent(getDefaultRulesHTML());
            }
        } catch (error) {
            console.error('Error loading blog rules:', error);
            setError('Error al cargar las reglas existentes');
            // Cargar reglas por defecto
            setTitle('Reglas de la Comunidad Ágora');
            setEditorContent(getDefaultRulesHTML());
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            if (!title.trim() || !editorContent.trim()) {
                setError('El título y el contenido son obligatorios');
                return;
            }

            const legalTextService = new LegalTextService();

            const updatedRules: LegalTextDTO = {
                type: 'blog-rules',
                title: title.trim(),
                content: editorContent,
                updatedAt: new Date().toISOString()
            };

            // Guardar en el backend
            let savedRules: LegalTextDTO;

            if (blogRules?.id) {
                // Actualizar reglas existentes
                savedRules = await legalTextService.updateLegalText(blogRules.id, updatedRules);
            } else {
                // Crear nuevas reglas
                savedRules = await legalTextService.createLegalText(updatedRules);
            }

            setBlogRules(savedRules);
            onSave?.(savedRules);

            // Mostrar mensaje de éxito brevemente
            alert('¡Reglas guardadas exitosamente! Los usuarios verán los cambios inmediatamente.');

            onHide();
        } catch (error) {
            console.error('Error saving blog rules:', error);
            setError('Error al guardar las reglas. Por favor, inténtalo de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    const getDefaultRulesHTML = (): string => {
        return `
      <h2>Bienvenido a la Comunidad Ágora</h2>
      <p>Estas reglas están diseñadas para mantener un ambiente seguro, respetuoso y enriquecedor para todos los miembros de nuestra comunidad educativa.</p>

      <h3>Normas de Convivencia</h3>
      <ul>
        <li><strong>Respeto y tolerancia:</strong> Mantén siempre un trato respetuoso hacia todos los miembros de la comunidad.</li>
        <li><strong>Prohibición de lenguaje soez:</strong> Está prohibido el uso de lenguaje vulgar u obsceno.</li>
        <li><strong>Cero tolerancia al racismo:</strong> No se permitirán comentarios discriminatorios.</li>
        <li><strong>Contenido educativo apropiado:</strong> Todo el contenido debe ser apropiado para un entorno educativo.</li>
      </ul>

      <h3>Protección de Datos - RGPD</h3>
      <p>En conformidad con el RGPD, tienes los siguientes derechos:</p>
      <ul>
        <li>Derecho de acceso a tus datos personales</li>
        <li>Derecho de rectificación de información incorrecta</li>
        <li>Derecho de supresión de tus datos</li>
        <li>Derecho a la portabilidad de datos</li>
      </ul>

      <h3>Contacto</h3>
      <p>Para cualquier consulta: <strong>contacto@agoraeducativo.es</strong></p>
      <p>Teléfono: <strong>+34 693 54 59 93</strong></p>
    `;
    };

    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    const handleEditorChange = (content: string) => {
        setEditorContent(content);
    };

    if (loading) {
        return (
            <Modal show={show} onHide={onHide} size="lg" centered>
                <Modal.Body className="text-center">
                    <p>Cargando editor de reglas...</p>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            centered
            className={styles.editorModal}
        >
            <Modal.Header closeButton className={styles.modalHeader}>
                <Modal.Title>Editor de Reglas de la Comunidad</Modal.Title>
            </Modal.Header>

            <Modal.Body className={styles.modalBody}>
                {error && (
                    <div className={styles.errorAlert}>
                        <strong>Error:</strong> {error}
                    </div>
                )}

                <div className={styles.editorContainer}>
                    {/* Campo de título */}
                    <div className={styles.titleSection}>
                        <label htmlFor="rules-title" className={styles.titleLabel}>
                            Título de las Reglas:
                        </label>
                        <input
                            id="rules-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.titleInput}
                            placeholder="Ej: Reglas de la Comunidad Ágora"
                        />
                    </div>

                    {/* Botones de control */}
                    <div className={styles.controlButtons}>
                        <Button
                            variant={showPreview ? "secondary" : "info"}
                            onClick={togglePreview}
                            size="sm"
                        >
                            {showPreview ? "🖊️ Editar" : "👁️ Vista Previa"}
                        </Button>
                    </div>

                    {/* Editor o Vista Previa */}
                    {showPreview ? (
                        <div className={styles.previewContainer}>
                            <h4>Vista Previa - Cómo verán los usuarios:</h4>
                            <div className={styles.previewContent}>
                                <h2>{title}</h2>
                                <div dangerouslySetInnerHTML={{ __html: editorContent }} />
                            </div>
                        </div>
                    ) : (
                        <div className={styles.editorWrapper}>
                            <Editor
                                apiKey="no-api-key" // Para uso gratuito
                                value={editorContent}
                                onEditorChange={handleEditorChange}
                                init={{
                                    height: 500,
                                    menubar: true,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | bold italic underline strikethrough | ' +
                                        'alignleft aligncenter alignright alignjustify | ' +
                                        'bullist numlist outdent indent | removeformat | help',
                                    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }',
                                    branding: false,
                                    resize: false,
                                    statusbar: true,
                                    elementpath: false,
                                    language: 'es'
                                }}
                            />
                        </div>
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer className={styles.modalFooter}>
                <div className={styles.footerInfo}>
                    <small className={styles.lastUpdated}>
                        {blogRules?.updatedAt && (
                            <>Última actualización: {new Date(blogRules.updatedAt).toLocaleString('es-ES')}</>
                        )}
                    </small>
                </div>

                <div className={styles.footerButtons}>
                    <Button variant="secondary" onClick={onHide} disabled={saving}>
                        Cancelar
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleSave}
                        disabled={saving || !title.trim() || !editorContent.trim()}
                    >
                        {saving ? "Guardando..." : "💾 Guardar Reglas"}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default BlogRulesEditor;
