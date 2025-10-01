import React from 'react';
import { Form } from 'react-bootstrap';
import DatePickerInput from '../../create/modal/components/DatePickerInput';
import TimePicker from '../../create/modal/components/TimePicker';
import styles from '../EditModalForm.module.scss';

interface EditEventDateCapacityFieldsProps {
    date: string;
    setDate: (value: string) => void;
    capacity: number | string;
    setCapacity: (value: string) => void;
    formErrors: { [key: string]: string };
    time: string;
    setTime: (value: string) => void;
}

const EditEventDateCapacityFields: React.FC<EditEventDateCapacityFieldsProps> = ({
    date,
    setDate,
    capacity,
    setCapacity,
    formErrors,
    time,
    setTime
}) => {
    return (

        <div className={`${styles.formGroup} row`}>
            <DatePickerInput eventDate={date} setEventDate={setDate} />
            <div className={styles.formGroup}>
                <Form.Label className="form-label">
                    Hora del Evento *
                </Form.Label>
                <TimePicker value={time} setTime={setTime} />
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
        </div>
    );
};

export default EditEventDateCapacityFields;
