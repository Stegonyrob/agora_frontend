import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import BlogRules from './BlogRules';
import styles from './RulesModal.module.scss';

interface RulesModalProps {
    show: boolean;
    onHide: () => void;
    onAccept: () => void;
    isAccepted: boolean;
}

const RulesModal: React.FC<RulesModalProps> = ({ show, onHide, onAccept, isAccepted }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
            backdrop="static"
            keyboard={false}
            className={styles.rulesModal}
        >
            <Modal.Header>
                <Modal.Title className={styles.modalTitle}>
                    Términos y Condiciones de Uso
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className={styles.modalBody}>
                <div className={styles.rulesWrapper}>
                    <BlogRules />
                </div>

                <div className={styles.acceptanceSection}>
                    <div className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            id="acceptRules"
                            checked={isAccepted}
                            onChange={onAccept}
                            className={styles.checkbox}
                        />
                        <label htmlFor="acceptRules" className={styles.checkboxLabel}>
                            He leído y acepto las reglas de la comunidad, las condiciones de uso y
                            la política de protección de datos conforme al RGPD.
                        </label>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer className={styles.modalFooter}>
                <Button
                    variant="secondary"
                    onClick={onHide}
                    className={styles.cancelButton}
                >
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={onHide}
                    disabled={!isAccepted}
                    className={styles.continueButton}
                >
                    Continuar con el Registro
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RulesModal;
