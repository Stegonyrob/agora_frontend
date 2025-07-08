import React from 'react';
import { Form } from 'react-bootstrap';
import styles from '../EditModalForm.module.scss';

interface EditEventBasicFieldsProps {
    title: string;
    setTitle: (value: string) => void;
    message: string;
    setMessage: (value: string) => void;
    place: string;
    setPlace: (value: string) => void;
    link: string;
    setLink: (value: string) => void;
    formErrors: { [key: string]: string };
}

const EditEventBasicFields: React.FC<EditEventBasicFieldsProps> = ({
    title,
    setTitle,
    message,
    setMessage,
    place,
    setPlace,
    link,
    setLink,
    formErrors
}) => {
    return (
        <>
            <div className={styles.formGroup}>
                <Form.Label className="form-label">
                    Título del Evento *
                </Form.Label>
                <Form.Control
                    type="text"
                    className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Taller de Robótica, Conferencia de IA..."
                    required
                />
                {formErrors.title && (
                    <div className={styles.errorText}>{formErrors.title}</div>
                )}
            </div>

            <div className={styles.formGroup}>
                <Form.Label className="form-label">
                    Descripción del Evento *
                </Form.Label>
                <Form.Control
                    as="textarea"
                    className="form-control"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe el evento, lo que los asistentes aprenderán..."
                    rows={4}
                />
            </div>

            <div className={styles.formGroup}>
                <Form.Label className="form-label">
                    Ubicación *
                </Form.Label>
                <Form.Control
                    type="text"
                    className="form-control"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="Ej: Sala de Conferencias A, Online..."
                />
            </div>

            <div className={styles.formGroup}>
                <Form.Label className="form-label">
                    Enlace adicional (opcional)
                </Form.Label>
                <Form.Control
                    type="url"
                    className="form-control"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com/mas-info"
                />
            </div>
        </>
    );
};

export default EditEventBasicFields;
