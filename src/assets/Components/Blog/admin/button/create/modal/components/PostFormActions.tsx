import { IPost } from '@/core/posts/IPost';
import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../ModalForm.module.scss'; // Usar los mismos estilos que eventos

interface PostFormActionsProps {

    isSubmitting?: boolean;
    globalError?: string | null;
    post?: IPost
    onClose: () => void;
}

const PostFormActions: React.FC<PostFormActionsProps> = ({
    post,
    isSubmitting = false,
    globalError = null,

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
                        {post ? "Actualizando..." : "Creando..."}
                    </>
                ) : (
                    post ? "💾 Actualizar Post" : "🎉 Crear Post"
                )}
            </Button>
        </div>
    );
};

export default PostFormActions;
