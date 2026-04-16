import React from 'react';
import { Button } from 'react-bootstrap';
import { IEvent } from '../../../../../../../core/events/IEvent';
import styles from '../ModalForm.module.scss';

interface EventFormActionsProps {
    isSubmitting: boolean;
    event?: IEvent;
    onClose: () => void;
    mode: "create" | "edit";
}

const EventFormActions: React.FC<EventFormActionsProps> = ({
    isSubmitting,
    event,
    onClose,
    mode
}) => {
    return (
        <div className={styles.submitButtonContainer}>
            <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
            >
                ❌ Cancelar
            </Button>
            <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {mode === "edit" ? "Actualizando..." : "Creando..."}
                    </>
                ) : (
                    mode === "edit" ? "💾 Actualizar Evento" : "🎉 Crear Evento"
                )}
            </Button>
        </div>
    );
};

export default EventFormActions;
