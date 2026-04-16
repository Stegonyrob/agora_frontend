import React from 'react';
import { Form } from 'react-bootstrap';
import styles from '../ModalForm.module.scss';

interface EventBasicFieldsProps {
    title: string;
    setTitle: (value: string) => void;
    message: string;
    setMessage: (value: string) => void;
    location: string;
    setLocation: (value: string) => void;
    link: string;
    setLink: (value: string) => void;
}

const EventBasicFields: React.FC<EventBasicFieldsProps> = ({
    title,
    setTitle,
    message,
    setMessage,
    location,
    setLocation,
    link,
    setLink
}) => {
    return (
        <>
            <Form.Group className={styles.formGroup} controlId="formEventTitle">
                <Form.Label>
                    <strong>📝 Título del Evento *</strong>
                </Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Taller de Robótica, Conferencia de IA..."
                    autoComplete="off"
                    data-lpignore="true"
                    required
                />
            </Form.Group>

            <Form.Group className={styles.formGroup} controlId="formEventDescription">
                <Form.Label>
                    <strong>📄 Descripción del Evento *</strong>
                </Form.Label>
                <Form.Control
                    as="textarea"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe el evento, qué actividades se realizarán, a quién está dirigido..."
                    required
                />
            </Form.Group>

            <Form.Group className={styles.formGroup} controlId="formEventLocation">
                <Form.Label>
                    <strong>📍 Ubicación *</strong>
                </Form.Label>
                <Form.Control
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej: Auditorio Principal, Sala 2, Online..."
                    required
                />
            </Form.Group>

            <Form.Group className={styles.formGroup} controlId="formEventLink">
                <Form.Label>
                    <strong>🔗 Enlace (opcional)</strong>
                </Form.Label>
                <Form.Control
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Ej: https://zoom.us/j/1234567890"
                />
            </Form.Group>
        </>
    );
};

export default EventBasicFields;
