import LegalTextGeneric from '@/assets/Components/Legal/LegalTextGeneric';
import { LegalTextDTO } from '@/core/legals/LegalTextDTO';
import { LegalTextService } from '@/core/legals/LegalTextService';
import { LEGAL_TEXT_TYPES, LegalTextType } from '@/core/legals/LegalTextTemplates';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import LegalTextEditorModal from './LegalTextEditorModal';
import styles from './LegalTextManager.module.scss';

interface LegalTextManagerProps {
    type: LegalTextType;
    asAdmin?: boolean;
}

const LegalTextManager: React.FC<LegalTextManagerProps> = ({ type, asAdmin = false }) => {
    const [legalText, setLegalText] = useState<LegalTextDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);

    const displayName = LEGAL_TEXT_TYPES[type] || 'Texto Legal';

    useEffect(() => {
        console.log('[LegalTextManager] useEffect - tipo:', type, 'asAdmin:', asAdmin);
        loadLegalText();
    }, [type]);

    const loadLegalText = async () => {
        try {
            setLoading(true);
            console.log(`[LegalTextManager] Cargando texto legal para tipo: ${type}, asAdmin:`, asAdmin);
            const service = new LegalTextService();
            const data = await service.getLegalTextByType(type);
            console.log(`[LegalTextManager] Texto legal cargado:`, data);
            setLegalText(data);
        } catch (error) {
            console.error(`[LegalTextManager] Error loading legal text for type ${type}:`, error, 'asAdmin:', asAdmin);
            setLegalText(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = (updatedText: LegalTextDTO) => {
        console.log(`[LegalTextManager] handleSave - Texto legal guardado exitosamente:`, updatedText, 'asAdmin:', asAdmin);
        setLegalText(updatedText);
        setShowEditor(false);
        setTimeout(() => {
            console.log(`[LegalTextManager] handleSave - Ejecutando recarga programada, asAdmin:`, asAdmin);
            loadLegalText();
        }, 500);
    };

    if (loading) {
        console.log('[LegalTextManager] loading... asAdmin:', asAdmin);
        return (
            <Container>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Cargando {displayName.toLowerCase()}...</p>
                </div>
            </Container>
        );
    }

    // Vista de usuario (similar a tu TermsView original)
    if (!asAdmin) {
        console.log('[LegalTextManager] Renderizando vista usuario. asAdmin:', asAdmin);
        return (
            <div className={styles.userView}>
                {legalText ? (
                    <LegalTextGeneric
                        type={type}
                        mainTitle={legalText.title}
                        text={legalText.content}
                        updatedAt={legalText.updatedAt ?? ""}
                    />
                ) : (
                    <p>Contenido no disponible</p>
                )}
            </div>
        );
    }

    // Vista de administrador
    console.log('[LegalTextManager] Renderizando vista admin. asAdmin:', asAdmin);
    return (
        <Container fluid className={styles.adminContainer}>
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h4>📄 {displayName}</h4>
                        </Card.Header>
                        <Card.Body>
                            <div className={styles.adminControls}>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        console.log('[LegalTextManager] Botón editar/crear presionado. asAdmin:', asAdmin);
                                        setShowEditor(true);
                                    }}
                                    className="me-2"
                                >
                                    {legalText ? '✏️ Editar' : '➕ Crear'}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h5>👁️ Vista Previa</h5>
                        </Card.Header>
                        <Card.Body>
                            {legalText ? (
                                <LegalTextGeneric
                                    type={type}
                                    mainTitle={legalText.title}
                                    text={legalText.content}
                                    updatedAt={legalText.updatedAt ?? ""}
                                />
                            ) : (
                                <div className={styles.noContent}>
                                    <p>No hay contenido configurado.</p>
                                    <p>Haz clic en "Crear" para establecer el contenido.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <LegalTextEditorModal
                show={showEditor}
                onHide={() => {
                    console.log('[LegalTextManager] Modal cerrado. asAdmin:', asAdmin);
                    setShowEditor(false);
                }}
                onSave={handleSave}
                type={type}
                existingText={legalText}
            />
        </Container>
    );
};

export default LegalTextManager;
