import React from 'react';
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
            <div className={styles.editFormGroup}>
                <label htmlFor="eventTitle" className={styles.editFormLabel}>
                    <strong>📝 Título del Evento *</strong>
                </label>
                <input
                    type="text"
                    id="eventTitle"
                    className={`${styles.editFormInput} ${formErrors.title ? styles.editFormInputInvalid : ""}`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Taller de Robótica, Conferencia de IA..."
                    required
                />
                {formErrors.title && (
                    <div className={styles.editFormErrorText}>{formErrors.title}</div>
                )}
            </div>

            <div className={styles.editFormGroup}>
                <label htmlFor="eventMessage" className={styles.editFormLabel}>
                    📄 Descripción del Evento:
                </label>
                <textarea
                    id="eventMessage"
                    className={styles.editFormTextarea}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe el evento, lo que los asistentes aprenderán..."
                    rows={4}
                />
            </div>

            <div className={styles.editFormGroup}>
                <label htmlFor="eventPlace" className={styles.editFormLabel}>
                    📍 Ubicación:
                </label>
                <input
                    type="text"
                    id="eventPlace"
                    className={styles.editFormInput}
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="Ej: Sala de Conferencias A, Online..."
                />
            </div>

            <div className={styles.editFormGroup}>
                <label htmlFor="eventLink" className={styles.editFormLabel}>
                    🔗 Enlace adicional:
                </label>
                <input
                    type="url"
                    id="eventLink"
                    className={styles.editFormInput}
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com/mas-info"
                />
            </div>
        </>
    );
};

export default EditEventBasicFields;
