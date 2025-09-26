import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../EditModalForm.module.scss';

interface EditTextFormActionsProps {
    onSubmit: () => void;
    onCancel: () => void;
    isSubmitting?: boolean;
    globalError?: string | null;
}

const EditTextFormActions: React.FC<EditTextFormActionsProps> = ({
    onSubmit,
    onCancel,
    isSubmitting = false,
    globalError = null
}) => {
    return (
        <div className={styles.submitButtonContainer}>
            {globalError && (
                <div className={styles.errorMessage}>
                    ❌ {globalError}
                </div>
            )}

            <div className={styles.buttonGroup}>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className={styles.cancelButton}
                >
                    Cancelar
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className={styles.submitButton}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Actualizando...
                        </>
                    ) : (
                        'Actualizar Texto'
                    )}
                </Button>
            </div>
        </div>
    );
};

export default EditTextFormActions;
