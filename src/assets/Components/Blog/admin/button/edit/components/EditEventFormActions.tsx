import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../EditModalForm.module.scss';

interface EditEventFormActionsProps {
    isSubmitting?: boolean;
    submitError?: string | null;
}

const EditEventFormActions: React.FC<EditEventFormActionsProps> = ({
    isSubmitting,
    submitError
}) => {
    return (
        <div className={styles.submitButtonContainer}>
            {submitError && (
                <div className={styles.globalError}>
                    {submitError}
                </div>
            )}

            <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Actualizando...
                    </>
                ) : (
                    'Actualizar Evento'
                )}
            </Button>
        </div>
    );
};

export default EditEventFormActions;
