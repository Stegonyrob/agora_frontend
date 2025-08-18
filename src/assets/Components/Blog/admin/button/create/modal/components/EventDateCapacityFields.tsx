import React from 'react';
import { Form } from 'react-bootstrap';
import styles from '../EventForm.module.scss';

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
            <Form.Group className="col-md-6" controlId="formEventDate">
                <Form.Label>
                    <strong>📅 Fecha del Evento *</strong>
                </Form.Label>
                <Form.Control
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                />
            </Form.Group>
            <div className={styles.formGroup}>
                <Form.Label className="form-label">
                    Hora del Evento *
                </Form.Label>
                <Form.Control
                    type="time"
                    className="form-control"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
            </div>
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
                <Form.Text className="text-muted">
                    💡 Dejar en 0 = sin límite de aforo
                </Form.Text>
            </Form.Group>
        </div>
    );
};

export default EventDateCapacityFields;
