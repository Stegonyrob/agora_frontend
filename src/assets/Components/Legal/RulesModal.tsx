import LegalTextGeneric from '@/assets/Components/Legal/LegalTextGeneric';
import { LegalTextDTO } from '@/core/legals/LegalTextDTO';
import { LegalTextService } from '@/core/legals/LegalTextService';
import { getLegalTextTemplate } from '@/core/legals/LegalTextTemplates';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

interface RulesModalProps {
    show: boolean;
    onHide: () => void;
    onAccept: (accepted: boolean) => void;
    isAccepted: boolean;
}

const RulesModal: React.FC<RulesModalProps> = ({ show, onHide, onAccept, isAccepted }) => {
    const [rulesText, setRulesText] = useState<LegalTextDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (show) {
            loadRules();
        }
    }, [show]);

    const loadRules = async () => {
        try {
            setLoading(true);
            const service = new LegalTextService();
            const data = await service.getLegalTextByType('blog-rules');
            setRulesText(data);
        } catch (error) {
            console.error('Error loading rules:', error);
            // Si no hay reglas en el servidor, usar plantilla por defecto
            const template = getLegalTextTemplate('blog-rules');
            setRulesText({
                type: 'blog-rules',
                title: template.title,
                content: template.content
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onAccept(e.target.checked);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>📋 Reglas de la Comunidad</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {loading ? (
                    <div className="text-center p-4">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : rulesText ? (
                    <LegalTextGeneric
                        type="blog-rules"
                        mainTitle={rulesText.title || 'Reglas de la Comunidad'}
                        text={rulesText.content || ''}
                        updatedAt={rulesText.updatedAt ?? ""}
                    />
                ) : (
                    <p>No se pudieron cargar las reglas.</p>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Form.Check
                    type="checkbox"
                    id="accept-rules"
                    label="He leído y acepto las reglas de la comunidad"
                    checked={isAccepted}
                    onChange={handleAcceptChange}
                    className="me-auto"
                />
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RulesModal;
