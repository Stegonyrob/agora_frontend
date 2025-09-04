import React from 'react';
import { Form } from 'react-bootstrap';
import styles from '../ModalForm.module.scss';



interface TextBasicFieldsProps {
    title: string;
    setTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;

}

const TextBasicFields: React.FC<TextBasicFieldsProps> = ({
    title,
    setTitle,
    description,
    setDescription,
}) => {
    return (
        <>
            <Form.Group className={styles.formGroup} controlId="formTextTitle">
                <Form.Label>
                    <strong>📝 Título del Texto *</strong>
                </Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Escribe un título atractivo para tu texto..."
                    autoComplete="off"
                    data-lpignore="true"
                    required
                />
            </Form.Group>

            <Form.Group className={styles.formGroup} controlId="formTextDescription">
                <Form.Label>
                    <strong>💬 Contenido del Texto *</strong>
                </Form.Label>
                <Form.Control
                    as="textarea"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Escribe el contenido de tu post aquí..."
                    required
                />
            </Form.Group>
        </>
    );
};

export default TextBasicFields;
