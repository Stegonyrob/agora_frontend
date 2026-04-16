import { LegalTextDTO } from '@/core/legals/LegalTextDTO';
import { LegalTextService } from '@/core/legals/LegalTextService';
import { getLegalTextTemplate, LEGAL_TEXT_TYPES, LegalTextType } from '@/core/legals/LegalTextTemplates';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Form, Modal } from 'react-bootstrap';
import styles from './LegalTextEditorModal.module.scss';

interface LegalTextEditorModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (savedText: LegalTextDTO) => void;
    type: LegalTextType;
    existingText?: LegalTextDTO | null;
}

const LegalTextEditorModal: React.FC<LegalTextEditorModalProps> = ({
    show,
    onHide,
    onSave,
    type,
    existingText
}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    const displayName = LEGAL_TEXT_TYPES[type];

    useEffect(() => {
        if (show) {
            if (existingText) {
                setTitle(existingText.title || '');
                setContent(existingText.content || '');
                if (editorRef.current && !previewMode) {
                    editorRef.current.innerHTML = existingText.content || '';
                }
            } else {
                const template = getLegalTextTemplate(type);
                setTitle(template.title);
                setContent(template.content);
                if (editorRef.current && !previewMode) {
                    editorRef.current.innerHTML = template.content;
                }
            }
            setError(null);
            setPreviewMode(false);
        }
    }, [show, existingText, type]);

    const handleSave = async () => {
        console.log(`🚀 LegalTextEditorModal.handleSave - Iniciando guardado para tipo: ${type}`);

        // Obtener contenido del editor si no está en modo preview
        if (!previewMode && editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }

        const contentToSave = previewMode ? content : (editorRef.current?.innerHTML || content);

        if (!title.trim() || !contentToSave.trim()) {
            console.warn(`⚠️ LegalTextEditorModal.handleSave - Validación fallida: título o contenido vacío`);
            setError('El título y contenido son obligatorios');
            return;
        }

        try {
            setSaving(true);
            setError(null);
            console.log(`🔄 LegalTextEditorModal.handleSave - Iniciando proceso de guardado...`);

            const service = new LegalTextService();
            const data: LegalTextDTO = {
                type,
                title: title.trim(),
                content: contentToSave.trim()
            };
            console.log(`📝 LegalTextEditorModal.handleSave - Datos preparados:`, data);

            let saved;
            let textToUpdate = existingText;
            console.log(`🔍 LegalTextEditorModal.handleSave - Texto existente recibido:`, textToUpdate);

            // Si no tenemos texto existente, obtenerlo del servidor
            if (!textToUpdate?.id) {
                console.log(`🔍 LegalTextEditorModal.handleSave - Obteniendo texto legal existente para tipo: ${type}`);
                try {
                    textToUpdate = await service.getLegalTextByType(type);
                    console.log(`✅ LegalTextEditorModal.handleSave - Texto obtenido del servidor:`, textToUpdate);
                } catch (fetchError) {
                    console.error(`❌ LegalTextEditorModal.handleSave - No se pudo obtener texto existente:`, fetchError);
                    textToUpdate = null;
                }
            }

            // SIEMPRE usar UPDATE con el tipo (el backend no devuelve ID, solo type)
            if (textToUpdate?.type || data.type) {
                console.log(`🔄 LegalTextEditorModal.handleSave - Actualizando texto legal para tipo: ${data.type}`);
                saved = await service.updateLegalText(data.type, data);
                console.log(`✅ LegalTextEditorModal.handleSave - Texto legal actualizado exitosamente:`, saved);
                onSave(saved);
                console.log(`📢 LegalTextEditorModal.handleSave - Callback onSave ejecutado`);
            } else {
                // Si no tenemos tipo válido, mostrar error específico
                console.error(`❌ LegalTextEditorModal.handleSave - No se encontró tipo válido para actualizar`);
                setError('Error: No se puede determinar el tipo de texto legal a actualizar.');
                return;
            }
        } catch (err: any) {
            console.error(`❌ LegalTextEditorModal.handleSave - Error durante el guardado:`, err);
            let errorMessage = 'Error al guardar el texto legal';

            if (err?.response?.status === 409 || err?.message?.includes('Duplicate')) {
                errorMessage = 'Ya existe un texto legal de este tipo. Refresca la página e intenta editarlo.';
            } else if (err?.response?.status === 400) {
                errorMessage = 'Los datos enviados no son válidos. Verifica el título y contenido.';
            } else if (err?.response?.status === 401) {
                errorMessage = 'No tienes autorización. Por favor, inicia sesión nuevamente.';
            } else if (err?.response?.status === 403) {
                errorMessage = 'No tienes permisos para realizar esta acción.';
            } else if (err?.response?.status === 404) {
                errorMessage = 'Texto legal no encontrado. Refresca la página e inténtalo de nuevo.';
            } else if (err?.response?.status >= 500) {
                errorMessage = 'Error del servidor. Inténtalo de nuevo en unos minutos.';
            }

            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const applyFormat = (tag: string) => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (!selectedText) return;

        const element = document.createElement(tag);
        element.textContent = selectedText;

        range.deleteContents();
        range.insertNode(element);

        // Actualizar el estado de content
        setContent(editorRef.current.innerHTML);
    };

    const applyBold = () => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (!selectedText) return;

        const strong = document.createElement('strong');
        strong.textContent = selectedText;

        range.deleteContents();
        range.insertNode(strong);

        setContent(editorRef.current.innerHTML);
    };

    const changeFontSize = (size: string) => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (!selectedText) return;

        const span = document.createElement('span');
        span.style.fontSize = size;
        span.textContent = selectedText;

        range.deleteContents();
        range.insertNode(span);

        setContent(editorRef.current.innerHTML);
    };

    const useDefaultTemplate = () => {
        if (confirm('¿Usar plantilla por defecto? Esto reemplazará el contenido actual.')) {
            const template = getLegalTextTemplate(type);
            setTitle(template.title);
            setContent(template.content);
            if (editorRef.current) {
                editorRef.current.innerHTML = template.content;
            }
        }
    };

    const togglePreview = () => {
        // Guardar el contenido del editor antes de cambiar a preview
        if (!previewMode && editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }
        setPreviewMode(!previewMode);
    };

    const handleClose = () => {
        setTitle('');
        setContent('');
        setError(null);
        setPreviewMode(false);
        if (editorRef.current) {
            editorRef.current.innerHTML = '';
        }
        onHide();
    };

    const handleEditorInput = () => {
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            backdrop="static"
            centered
            scrollable
        >
            <Modal.Header closeButton className={styles.modalHeader}>
                <Modal.Title className={styles.modalTitle}>
                    Editar {displayName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError(null)} className={styles.errorAlert}>
                        {error}
                    </Alert>
                )}

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={saving}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contenido</Form.Label>

                        {previewMode ? (
                            <div
                                className={styles.previewArea}
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        ) : (
                            <>
                                {/* Barra de herramientas de formato */}
                                <div className={styles.editorToolbar}>
                                    <button
                                        type="button"
                                        className={styles.toolbarButton}
                                        onClick={() => applyFormat('h1')}
                                        disabled={saving}
                                        title="Título principal"
                                    >
                                        <i className="bi bi-type-h1"></i> Título
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.toolbarButton}
                                        onClick={() => applyFormat('h2')}
                                        disabled={saving}
                                        title="Subtítulo"
                                    >
                                        <i className="bi bi-type-h2"></i> Subtítulo
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.toolbarButton}
                                        onClick={() => applyFormat('p')}
                                        disabled={saving}
                                        title="Párrafo"
                                    >
                                        <i className="bi bi-text-paragraph"></i> Párrafo
                                    </button>

                                    <div className={styles.toolbarDivider} />

                                    <button
                                        type="button"
                                        className={styles.toolbarButton}
                                        onClick={applyBold}
                                        disabled={saving}
                                        title="Negrita"
                                    >
                                        <i className="bi bi-type-bold"></i> Negrita
                                    </button>

                                    <div className={styles.toolbarDivider} />

                                    <button
                                        type="button"
                                        className={styles.toolbarButton}
                                        onClick={() => changeFontSize('0.875rem')}
                                        disabled={saving}
                                        title="Texto pequeño"
                                    >
                                        <i className="bi bi-fonts"></i> Pequeño
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.toolbarButton}
                                        onClick={() => changeFontSize('1rem')}
                                        disabled={saving}
                                        title="Texto normal"
                                    >
                                        <i className="bi bi-fonts"></i> Normal
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.toolbarButton}
                                        onClick={() => changeFontSize('1.25rem')}
                                        disabled={saving}
                                        title="Texto grande"
                                    >
                                        <i className="bi bi-fonts"></i> Grande
                                    </button>
                                </div>

                                {/* Área de edición */}
                                <div
                                    ref={editorRef}
                                    className={styles.editorArea}
                                    contentEditable={!saving}
                                    onInput={handleEditorInput}
                                    suppressContentEditableWarning={true}
                                />
                            </>
                        )}
                    </Form.Group>

                    {/* Botones de utilidad */}
                    <div className={styles.utilityButtons}>
                        <button
                            type="button"
                            className={`${styles.utilityButton} ${styles.warning}`}
                            onClick={useDefaultTemplate}
                            disabled={saving}
                        >
                            📋 Usar plantilla por defecto
                        </button>
                        <button
                            type="button"
                            className={`${styles.utilityButton} ${styles.info}`}
                            onClick={togglePreview}
                            disabled={saving}
                        >
                            {previewMode ? '✏️ Editar' : '👁️ Vista previa'}
                        </button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer className={styles.modalFooter}>
                <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleClose}
                    disabled={saving}
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={saving || !title.trim()}
                >
                    {saving ? '⏳ Guardando...' : '💾 Guardar'}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default LegalTextEditorModal;
