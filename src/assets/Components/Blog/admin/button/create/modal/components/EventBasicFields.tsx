import React from 'react';
import { Form } from 'react-bootstrap';
import styles from '../EventForm.module.scss';

interface EventBasicFieldsProps {
    title: string;
    setTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    location: string;
    setLocation: (value: string) => void;
    link: string;
    setLink: (value: string) => void;
}

const EventBasicFields: React.FC<EventBasicFieldsProps> = ({
    title,
    setTitle,
    description,
    setDescription,
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    placeholder="Ej: Aula 1, Centro Cívico, Salón de Actos..."
                    autoComplete="off"
                    data-lpignore="true"
                    required
                />
            </Form.Group>

            <Form.Group className={styles.formGroup} controlId="formEventLink">
                <Form.Label>
                    <strong>🔗 Enlace adicional (opcional)</strong>
                </Form.Label>
                <Form.Control
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://ejemplo.com/mas-informacion"
                />
                <Form.Text className="text-muted">
                    💡 Link para más información, inscripciones, etc.
                </Form.Text>
            </Form.Group>
        </>
    );
};

export default EventBasicFields;
