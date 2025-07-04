import React from 'react';
import { Form } from 'react-bootstrap';
import styles from '../EditModalForm.module.scss';

interface EditPostBasicFieldsProps {
    title: string;
    setTitle: (title: string) => void;
    message: string;
    setMessage: (message: string) => void;
}

const EditPostBasicFields: React.FC<EditPostBasicFieldsProps> = ({
    title,
    setTitle,
    message,
    setMessage
}) => {
    return (
        <>
            <div className={styles.formGroup}>
                <label className={styles.titleLabel}>
                    📝 Título del Post:
                </label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Escribe un título atractivo para tu post..."
                    required
                    className={styles.titleInput}
                />
                <Form.Text className="text-muted">
                    💡 Un buen título ayuda a captar la atención de los lectores
                </Form.Text>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.titleLabel}>
                    💬 Contenido del Post:
                </label>
                <Form.Control
                    as="textarea"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe el contenido de tu post aquí..."
                    required
                    className={styles.messageTextarea}
                />
                <Form.Text className="text-muted">
                    ✍️ Comparte tus ideas, experiencias o conocimientos con la comunidad
                </Form.Text>
            </div>
        </>
    );
};

export default EditPostBasicFields;
