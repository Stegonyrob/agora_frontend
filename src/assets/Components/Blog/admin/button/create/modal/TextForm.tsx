import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import styles from './TextForm.module.scss';

interface TextFormProps {
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    show: boolean;
    userId: number;
}

const initialState = {
    category: '',
    title: '',
    description: '',
    image: '',
    name_image: '',
};

const CATEGORIES = [
    { value: '', label: 'Selecciona una categoría' },
    { value: 'nosotros', label: 'Nosotros' },
    { value: 'servicios', label: 'Servicios' },
    { value: 'neurodiversidad', label: 'Neurodiversidad' },
    { value: 'desarrollo', label: 'Desarrollo' },
    { value: 'comunicacion', label: 'Comunicación' },
];

const TextForm: React.FC<TextFormProps> = ({ onClose, onSubmit, show, userId }) => {
    const [form, setForm] = useState(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({ ...prev, image: reader.result as string, name_image: file.name }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setForm(prev => ({ ...prev, image: '', name_image: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit({ ...form, userId });
            setForm(initialState);
            onClose();
        } catch (err: any) {
            setError('No se pudo crear el texto.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            size="lg"
            centered
            show={show}
            onHide={onClose}
            className={styles.textForm}
            style={{ zIndex: 10000 }}
            backdropClassName="custom-backdrop"
        >
            <Modal.Header className={styles.modalHeader} closeButton>
                <Modal.Title className={styles.modalTitle}>
                    Crear Nuevo Texto
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="category">
                            <span role="img" aria-label="category">📂</span> Categoría *
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        >
                            {CATEGORIES.map(opt => (
                                <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="title">
                            <span role="img" aria-label="title">📝</span> Título *
                        </label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            placeholder="Ej: Importancia de los trastornos de la comunicación..."
                            autoComplete="off"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="description">
                            <span role="img" aria-label="description">📄</span> Texto *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            rows={7}
                            placeholder="Escribe el contenido aquí..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="image">
                            <span role="img" aria-label="image">🖼️</span> Imagen
                        </label>
                        <div className={styles.imageUploadArea}>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={styles.input}
                            />
                            {form.image && (
                                <div className={styles.imagePreviewContainer}>
                                    <img
                                        src={form.image}
                                        alt="preview"
                                        className={styles.imagePreview}
                                    />
                                    <span className={styles.imageName}>{form.name_image}</span>
                                    <button
                                        type="button"
                                        className={styles.removeImageButton}
                                        onClick={handleRemoveImage}
                                        title="Eliminar imagen"
                                    >
                                        <i className="bi bi-x-octagon"></i> Quitar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.actions}>
                        <button type="submit" className={styles.buttonCreate} disabled={isSubmitting}>
                            {isSubmitting ? 'Creando...' : 'Crear Texto'}
                        </button>
                        <button type="button" className={styles.buttonCancel} onClick={onClose} disabled={isSubmitting}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default TextForm;
