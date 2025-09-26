import IText from '@/core/texts/IText';
import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../ModalForm.module.scss';
interface TextFormActionsProps {

    isSubmitting: boolean;
    text?: IText;
    onClose: () => void;
}

const TextFormActions: React.FC<TextFormActionsProps> = ({
    isSubmitting,
    text,
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
                        {text ? "Actualizando..." : "Creando..."}
                    </>
                ) : (
                    text ? "💾 Actualizar Texto" : "🎉 Crear Texto"
                )}
            </Button>
        </div>
    );
};



export default TextFormActions;
