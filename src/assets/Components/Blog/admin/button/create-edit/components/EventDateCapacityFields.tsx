import React from 'react';
import { Form } from 'react-bootstrap'; // 👈 Usaremos InputGroup
import 'react-day-picker/dist/style.css';
import styles from '../ModalForm.module.scss';
import DatePickerInput from './DatePickerInput';

const TimePicker = React.lazy(() => import('./TimePicker'));

interface EventDateCapacityFieldsProps {
    eventDate: string;
    setEventDate: (value: string) => void;
    capacity: number;
    setCapacity: (value: number) => void;
    time: string;
    setTime: (value: string) => void;
}

const EventDateCapacityFields: React.FC<EventDateCapacityFieldsProps> = ({
    eventDate,
    setEventDate,
    capacity,
    setCapacity,
    time,
    setTime
}) => {
    return (
        <div className={`${styles.formGroup} row`}>
            <DatePickerInput eventDate={eventDate} setEventDate={setEventDate} />
            <div className={styles.formGroup}>
                <Form.Label className="form-label">
                    Hora del Evento *
                </Form.Label>
                <React.Suspense fallback={null}>
                    <TimePicker value={time} setTime={setTime} />
                </React.Suspense>
            </div>
            {/* ... (Aforo) ... */}
            <Form.Group className="col-md-6" controlId="formEventCapacity">
                <Form.Label>
                    <strong>Aforo máximo 👥</strong>
                </Form.Label>
                <Form.Control
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    min="0"
                    placeholder="Ej: 25, 50, 100..."
                />
                <Form.Text className={styles.helpText}>
                    💡 Dejar en 0 = sin límite de aforo
                </Form.Text>
            </Form.Group>
        </div>
    );
};

export default EventDateCapacityFields;