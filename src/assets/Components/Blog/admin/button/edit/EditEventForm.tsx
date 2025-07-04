import { IEventDTO } from "@/core/events/IEventDTO";
import React from "react";
import { Modal } from "react-bootstrap";
import { useEditEventForm } from "../../../../../../hooks/useEditEventForm";
import ImagePreviewGrid from "../../images/ImagePreviewGrid";
import ImageUploadButton from "../../images/ImageUploadButton";
import EditEventBasicFields from "./components/EditEventBasicFields";
import EditEventDateCapacityFields from "./components/EditEventDateCapacityFields";
import EditEventFormActions from "./components/EditEventFormActions";
import EditEventTagsField from "./components/EditEventTagsField";
import styles from "./EditModalForm.module.scss";

interface EditEventFormProps {
    event?: IEventDTO;
    onSubmit: (event: IEventDTO) => void;
    onClose: () => void;
    show: boolean;
    isSubmitting?: boolean; // Prop para indicar si la solicitud de envío está en curso
    submitError?: string | null;
}
const EditEventForm = ({
    event,
    onSubmit,
    onClose,
    show,
    isSubmitting,
    submitError,
}: EditEventFormProps) => {
    const {
        title, setTitle,
        message, setMessage,
        place, setPlace,
        date, setDate,
        link, setLink,
        capacity, setCapacity,
        tags, setTags,
        imagePreviews,
        formErrors,
        handleNewImagesSelected,
        handleRemoveImage,
        submitForm
    } = useEditEventForm({ event, show });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitForm(onSubmit, submitError || null);
    };

    return (
        <Modal size="lg" show={show} onHide={onClose} className={styles.editModalForm}>
            <div className={styles.editModalContent}>
                <div className={styles.editModalHeader}>
                    <h2 className={styles.editModalTitle}>
                        ✏️ Editar Evento
                    </h2>
                </div>
                <div className={styles.editModalBody}>
                    <form className={styles.editForm} onSubmit={handleSubmit}>
                        <EditEventBasicFields
                            title={title}
                            setTitle={setTitle}
                            message={message}
                            setMessage={setMessage}
                            place={place}
                            setPlace={setPlace}
                            link={link}
                            setLink={setLink}
                            formErrors={formErrors}
                        />

                        <EditEventDateCapacityFields
                            date={date}
                            setDate={setDate}
                            capacity={capacity}
                            setCapacity={setCapacity}
                            formErrors={formErrors}
                        />

                        <EditEventTagsField
                            tags={tags}
                            setTags={setTags}
                        />

                        <div className={styles.editImageSection}>
                            <label className={styles.editImageSectionTitle}>🖼️ Gestión de Imágenes</label>

                            {/* Subir nuevas imágenes */}
                            <div className={styles.editImageUploadSection}>
                                <h4 className={styles.editImageSubsectionTitle}>➕ Seleccionar imágenes:</h4>
                                <ImageUploadButton onImagesSelected={handleNewImagesSelected} />
                                <small className={styles.editImageHelpText}>
                                    💡 Las imágenes existentes se muestran con el badge "Existente". Puedes eliminar cualquier imagen antes de guardar.
                                </small>
                            </div>

                            {/* Grid unificado de previews de imágenes */}
                            <ImagePreviewGrid
                                imagePreviews={imagePreviews}
                                onRemoveImage={handleRemoveImage}
                                showExistingBadge={true}
                            />
                        </div>

                        <EditEventFormActions
                            isSubmitting={isSubmitting}
                            submitError={submitError}
                        />
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default React.memo(EditEventForm)