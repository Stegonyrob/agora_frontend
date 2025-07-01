import { LegalTextDTO } from '@/core/legals/LegalTextDTO';
import { LegalTextService } from '@/core/legals/LegalTextService';
import { getLegalTextTemplate, LEGAL_TEXT_TYPES, LegalTextType } from '@/core/legals/LegalTextTemplates';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';

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

    const displayName = LEGAL_TEXT_TYPES[type];

    useEffect(() => {
        if (show) {
            if (existingText) {
                setTitle(existingText.title || '');
                setContent(existingText.content || '');
            } else {
                const template = getLegalTextTemplate(type);
                setTitle(template.title);
                setContent(template.content);
            }
            setError(null);
            setPreviewMode(false);
        }
    }, [show, existingText, type]);

    const handleSave = async () => {
        console.log(`🚀 LegalTextEditorModal.handleSave - Iniciando guardado para tipo: ${type}`);

        if (!title.trim() || !content.trim()) {
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
                content: content.trim()
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

    const addTemplate = (template: string) => {
        setContent(prev => prev + template);
    };

    const useDefaultTemplate = () => {
        if (confirm('¿Usar plantilla por defecto? Esto reemplazará el contenido actual.')) {
            const template = getLegalTextTemplate(type);
            setTitle(template.title);
            setContent(template.content);
        }
    };

    const togglePreview = () => {
        setPreviewMode(!previewMode);
    };

    const handleClose = () => {
        setTitle('');
        setContent('');
        setError(null);
        setPreviewMode(false);
        onHide();
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
            <Modal.Header closeButton>
                <Modal.Title>
                    Editar {displayName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError(null)}>
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

                    {!previewMode ? (
                        <Form.Group className="mb-3">
                            <Form.Label>Contenido</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={10}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={saving}
                                placeholder="Escribe aquí el contenido del texto legal..."
                            />
                        </Form.Group>
                    ) : (
                        <div className="mb-3">
                            <label className="form-label">Vista previa</label>
                            <div
                                className="border p-3 rounded bg-light"
                                style={{ minHeight: '200px', whiteSpace: 'pre-wrap' }}
                            >
                                {content}
                            </div>
                        </div>
                    )}

                    <div className="d-flex gap-2 mb-3">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => addTemplate('\n\n**Cláusula adicional:**\n')}
                            disabled={saving}
                        >
                            + Cláusula
                        </Button>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => addTemplate('\n\n**Nota importante:**\n')}
                            disabled={saving}
                        >
                            + Nota
                        </Button>
                        <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={useDefaultTemplate}
                            disabled={saving}
                        >
                            Usar plantilla por defecto
                        </Button>
                        <Button
                            variant="outline-info"
                            size="sm"
                            onClick={togglePreview}
                            disabled={saving}
                        >
                            {previewMode ? 'Editar' : 'Vista previa'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={saving}
                >
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={saving || !title.trim() || !content.trim()}
                >
                    {saving ? 'Guardando...' : 'Guardar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LegalTextEditorModal;
