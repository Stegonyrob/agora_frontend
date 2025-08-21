import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../EventForm.module.scss'; // Usar los mismos estilos que eventos

interface PostFormActionsProps {
    onSubmit: () => void;
    onCancel: () => void;
    isSubmitting?: boolean;
    globalError?: string | null;
    isEditMode?: boolean;
}

const PostFormActions: React.FC<PostFormActionsProps> = ({
    onSubmit,
    onCancel,
    isSubmitting = false,
    globalError = null,
    isEditMode = false
}) => {
    return (
        <div className={styles.formActions}>
            {globalError && (
                <div className={styles.errorMessage}>
                    {globalError}
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
                    type="button"
                    variant="primary"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className={styles.submitButton}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            {isEditMode ? 'Actualizando...' : 'Creando...'}
                        </>
                    ) : (
                        isEditMode ? 'Actualizar Post' : 'Crear Post'
                    )}
                </Button>
            </div>
        </div>
    );
};

export default PostFormActions;
