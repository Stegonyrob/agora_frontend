import EventImageService from "@/core/events/EventImageService";
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
        handleRemoveImage,
        formErrors,
        handleNewImagesSelected,
        imagePreviews,
        submitForm,
        globalError
    } = useEditEventForm({ event, show, onClose });

    const apiEventImage = new EventImageService();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitForm(onSubmit, submitError || null);
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
                <Modal.Title className={styles.modalTitle}>Editar Evento</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.eventForm}>
                <form onSubmit={handleSubmit}>
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
                        formErrors={formErrors} time={""} setTime={function (value: string): void {
                            throw new Error("Function not implemented.");
                        }} />
                    <div className={styles.imageSection}>
                        <h3 className={styles.imageSectionTitle}>Gestión de Imágenes</h3>

                        <div className={styles.newImagesUploadSection}>
                            <h4 className={styles.subsectionTitle}>Seleccionar imágenes:</h4>

                            <ImageUploadButton
                                onImagesSelected={handleNewImagesSelected}
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
                    <EditEventTagsField
                        tags={tags}
                        setTags={setTags}
                    />
                    <EditEventFormActions
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

export default React.memo(EditEventForm)