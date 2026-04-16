import { IText } from '@/core/texts/IText';
import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../ModalForm.module.scss';
interface TextFormActionsProps {
    isSubmitting: boolean;
    text?: IText;
    onClose: () => void;
    mode: "create" | "edit";
}

const TextFormActions: React.FC<TextFormActionsProps> = ({
    isSubmitting,
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
                    mode === "edit" ? "💾 Actualizar Texto" : "🎉 Crear Texto"
                )}
            </Button>
        </div>
    );
};



export default TextFormActions;
