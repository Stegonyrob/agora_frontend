import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../ModalForm.module.scss'; // Usar los mismos estilos que eventos

interface PostFormActionsProps {
    onSubmit: () => void;
    onCancel: () => void;
    isSubmitting?: boolean;
    globalError?: string | null;
    isEditMode?: boolean;
    onClose: () => void;
}

const PostFormActions: React.FC<PostFormActionsProps> = ({
    onSubmit,
    onCancel,
    isSubmitting = false,
    globalError = null,
    isEditMode = false,
    onClose
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
                        {event ? "Actualizando..." : "Creando..."}
                    </>
                ) : (
                    event ? "💾 Actualizar Post" : "🎉 Crear Post"
                )}
            </Button>
        </div>
    );
};

export default PostFormActions;
