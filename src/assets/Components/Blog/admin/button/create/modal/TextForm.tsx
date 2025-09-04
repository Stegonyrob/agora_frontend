import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import styles from './ModalForm.module.scss';
import TextBasicFields from './components/TextBasicFields';
import TextFormActions from './components/TextFormActions';
import TextImageManager from './components/TextImageManager';

interface TextFormProps {
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    show: boolean;
    userId: number;
}

const CATEGORIES = [
    { value: '', label: 'Selecciona una categoría' },
    { value: 'nosotros', label: 'Nosotros' },
    { value: 'servicios', label: 'Servicios' },
    { value: 'neurodiversidad', label: 'Neurodiversidad' },
    { value: 'desarrollo', label: 'Desarrollo' },
    { value: 'comunicacion', label: 'Comunicación' },
];

type TextFormState = {
    category: string;
    title: string;
    description: string;
    image: string | File;
};

const initialState: TextFormState = {
    category: '',
    title: '',
    description: '',
    image: '',
};

const TextForm: React.FC<TextFormProps> = ({ onClose, onSubmit, show, userId }) => {
    const [form, setForm] = useState<TextFormState>(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm(prev => ({ ...prev, image: file }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setGlobalError(null);
        try {
            await onSubmit({ ...form, userId });
            onClose();
        } catch (err: any) {
            setGlobalError(err?.message || 'Error al enviar el formulario');
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
            className={styles.modalForm} // Usar el mismo estilo que eventos
            style={{ zIndex: 10000 }}
            backdropClassName="custom-backdrop"
        >
            <Modal.Header className={styles.modalHeader} closeButton>
                <Modal.Title className={styles.modalTitle}>
                    {Text ? 'Editar Texto' : 'Crear Nuevo Texto'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                <form>
                    <TextBasicFields
                        title={form.title}
                        setTitle={(val: any) => setForm(prev => ({ ...prev, title: val }))}
                        description={form.description}
                        setDescription={(val: any) => setForm(prev => ({ ...prev, description: val }))}
                    />
                    <TextImageManager
                        imagePreviews={[]}
                        onImagesSelected={() => { }}
                        onRemoveImage={() => { }}
                    />
                    <TextFormActions
                        onSave={() => handleSubmit(new Event('submit') as any)}
                        onCancel={onClose}
                        isSubmitting={isSubmitting}
                        globalError={globalError}
                        isEditMode={false}
                    />
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default TextForm;