import React from 'react';
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
        <>
            {submitError && (
                <div className={styles.globalError}>{submitError}</div>
            )}

            <div className={styles.submitButtonContainer}>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Guardando..." : "💾 Actualizar Evento"}
                </button>
            </div>
        </>
    );
};

export default EditEventFormActions;
