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
            <div className={styles.formGroup}>
                <label htmlFor="eventDate" className={styles.titleLabel}>
                    📅 Fecha del Evento:
                </label>
                <input
                    type="date"
                    id="eventDate"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="eventCapacity" className={styles.titleLabel}>
                    👥 Aforo máximo:
                </label>
                <input
                    type="number"
                    id="eventCapacity"
                    className={`form-control ${formErrors.capacity ? styles.isInvalid : ""}`}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    min="0"
                    placeholder="Capacidad máxima"
                />
                {formErrors.capacity && (
                    <div className={styles.errorText}>{formErrors.capacity}</div>
                )}
                <small className="text-muted">
                    💡 Dejar en 0 = sin límite de aforo
                </small>
            </div>
        </>
    );
};

export default EditEventDateCapacityFields;
