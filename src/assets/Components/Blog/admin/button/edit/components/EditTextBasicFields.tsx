import React from 'react';
import { Form } from 'react-bootstrap';
import styles from '../EditModalForm.module.scss';

interface EditTextBasicFieldsProps {
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
}

const EditTextBasicFields: React.FC<EditTextBasicFieldsProps> = ({
    title,
    setTitle,
    description,
    setDescription
}) => {
    return (
        <>
            <div className={styles.formGroup}>
                <label className={styles.titleLabel}>
                    📝 Título del Texto:
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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

export default EditTextBasicFields;
