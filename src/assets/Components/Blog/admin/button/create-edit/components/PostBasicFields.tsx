import React from 'react';
import { Form } from 'react-bootstrap';
import styles from '../ModalForm.module.scss'; // Usar los mismos estilos que eventos

interface PostBasicFieldsProps {
    title: string;
    setTitle: (value: string) => void;
    message: string;
    setMessage: (value: string) => void;
}

const PostBasicFields: React.FC<PostBasicFieldsProps> = ({
    title,
    setTitle,
    message,
    setMessage
}) => {
    return (
        <>
            <Form.Group className={styles.formGroup} controlId="formPostTitle">
                <Form.Label>
                    <strong>📝 Título del Post *</strong>
                </Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Tutorial de React, Noticia importante..."
                    autoComplete="off"
                    data-lpignore="true"
                    required
                />
            </Form.Group>

            <Form.Group className={styles.formGroup} controlId="formPostMessage">
                <Form.Label>
                    <strong>📄 Contenido del Post *</strong>
                </Form.Label>
                <Form.Control
                    as="textarea"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe el contenido de tu post aquí..."
                    required
                />
            </Form.Group>
        </>
    );
};

export default PostBasicFields;
