import React from 'react';
import { Form } from 'react-bootstrap';
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
                <Form.Label className="form-label">
                    Fecha del Evento *
                </Form.Label>
                <Form.Control
                    type="date"
                    className={`form-control ${formErrors.date ? 'is-invalid' : ''}`}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                {formErrors.date && (
                    <div className={styles.errorText}>{formErrors.date}</div>
                )}
            </div>

            <div className={styles.formGroup}>
                <Form.Label className="form-label">
                    Aforo máximo
                </Form.Label>
                <Form.Control
                    type="number"
                    className={`form-control ${formErrors.capacity ? 'is-invalid' : ''}`}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    min="0"
                    placeholder="Capacidad máxima"
                />
                {formErrors.capacity && (
                    <div className={styles.errorText}>{formErrors.capacity}</div>
                )}
                <small className="text-muted">
                    Dejar en 0 = sin límite de aforo
                </small>
            </div>
        </>
    );
};

export default EditEventDateCapacityFields;
