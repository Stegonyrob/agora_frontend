import TextImageService from "@/core/texts/images/TextImageService";
import { ITextItemDTO } from "@/core/texts/ITextItemDTO";
import { useEditTextForm } from "@/hooks/useEditTextForm";
import React from "react";
import { Modal } from "react-bootstrap";
import ImagePreviewGrid from "../../images/ImagePreviewGrid";
import ImageUploadButton from "../../images/ImageUploadButton";
import EditTextBasicFields from "./components/EditTextBasicFields";
import EditTextFormActions from "./components/EditTextFormActions";
import styles from "./EditModalForm.module.scss";

interface EditTextFormProps {
    text?: ITextItemDTO;
    onSubmit: (text: ITextItemDTO) => void;
    onClose: () => void;
    show: boolean;
}

const EditTextForm: React.FC<EditTextFormProps> = ({ text, onSubmit, onClose, show }) => {
    const {
        title,
        setTitle,
        description,
        setDescription,
        imagePreviews,
        handleImagesSelected,
        handleRemoveImage,
        submitForm,
        isSubmitting,
        globalError
    } = useEditTextForm({ show });

    const textImageService = new TextImageService();

    // Adapter to convert TextPayload to ITextItemDTO before calling onSubmit
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const handleSubmit = (textPayload: any) => {
            // You should replace this with the actual conversion logic
            // For now, we assume text has all required fields
            onSubmit({ ...text, ...textPayload });
        };
        await submitForm(handleSubmit, onClose);
    };

    return (
        <Modal
            size="lg"
            centered
            show={show}
            onHide={onClose}
            className={styles.eventForm}
            style={{ zIndex: 10000 }}
            backdropClassName="custom-backdrop"
        >
            <Modal.Header className={styles.eventForm} closeButton>
                <Modal.Title className={styles.modalTitle}>Editar Texto</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.eventForm}>
                <form onSubmit={handleFormSubmit}>
                    <EditTextBasicFields
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                    />

                    <div className={styles.imageSection}>
                        <h3 className={styles.imageSectionTitle}>Gestión de Imágenes</h3>
                        <div className={styles.newImagesUploadSection}>
                            <h4 className={styles.subsectionTitle}>Seleccionar imágenes:</h4>

                            <ImageUploadButton
                                onImagesSelected={handleImagesSelected}
                            // Aquí solo pasamos onImagesSelected.
                            // La subida real se hará cuando el usuario presione el botón de Guardar/Actualizar.
                            />
                            <small className={styles.helpText}>
                                Las imágenes existentes se muestran con el badge "Existente". Puedes eliminar cualquier imagen antes de guardar.
                            </small>
                        </div>
                        <ImagePreviewGrid
                            imagePreviews={imagePreviews}
                            onRemoveImage={handleRemoveImage}

                        />
                    </div>
                    <EditTextFormActions
                        onSubmit={() => { }}
                        onCancel={onClose}
                        isSubmitting={isSubmitting}
                        globalError={globalError}
                    />
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default EditTextForm;