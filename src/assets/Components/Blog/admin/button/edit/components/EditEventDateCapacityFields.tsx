import React from 'react';
import styles from '../EditModalForm.module.scss';

interface EditEventDateCapacityFieldsProps {
    date: string;
    setDate: (value: string) => void;
    capacity: number | string;
    setCapacity: (value: string) => void;
    formErrors: { [key: string]: string };
}

const EditEventDateCapacityFields: React.FC<EditEventDateCapacityFieldsProps> = ({
    date,
    setDate,
    capacity,
    setCapacity,
    formErrors
}) => {
    return (
        <>
            <div className={styles.editFormGroup}>
                <label htmlFor="eventDate" className={styles.editFormLabel}>
                    📅 Fecha del Evento:
                </label>
                <input
                    type="date"
                    id="eventDate"
                    className={`${styles.editFormInput} ${formErrors.date ? styles.editFormInputInvalid : ""}`}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                {formErrors.date && (
                    <div className={styles.editFormErrorText}>{formErrors.date}</div>
                )}
            </div>

            <div className={styles.editFormGroup}>
                <label htmlFor="eventCapacity" className={styles.editFormLabel}>
                    👥 Aforo máximo:
                </label>
                <input
                    type="number"
                    id="eventCapacity"
                    className={`${styles.editFormInput} ${formErrors.capacity ? styles.editFormInputInvalid : ""}`}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    min="0"
                    placeholder="Capacidad máxima"
                />
                {formErrors.capacity && (
                    <div className={styles.editFormErrorText}>{formErrors.capacity}</div>
                )}
                <small className={styles.editImageHelpText}>
                    💡 Dejar en 0 = sin límite de aforo
                </small>
            </div>
        </>
    );
};

export default EditEventDateCapacityFields;
