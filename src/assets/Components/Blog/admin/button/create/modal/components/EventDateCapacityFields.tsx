import React from 'react';
import { Form } from 'react-bootstrap';
import styles from '../EventForm.module.scss';

interface EventDateCapacityFieldsProps {
    eventDate: string;
    setEventDate: (value: string) => void;
    capacity: number;
    setCapacity: (value: number) => void;
}

const EventDateCapacityFields: React.FC<EventDateCapacityFieldsProps> = ({
    eventDate,
    setEventDate,
    capacity,
    setCapacity
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
