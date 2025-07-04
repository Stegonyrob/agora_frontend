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
                <div className={styles.editFormGlobalError}>{submitError}</div>
            )}

            <div className={styles.editSubmitButtonContainer}>
                <button
                    type="submit"
                    className={styles.editSubmitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Guardando..." : "💾 Actualizar Evento"}
                </button>
            </div>
        </>
    );
};

export default EditEventFormActions;
