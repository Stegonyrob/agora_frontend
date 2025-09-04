import React from "react";
import { Modal } from "react-bootstrap";
import { IEvent } from "../../../../../../../core/events/IEvent";
import { useEventForm } from "../../../../../../../hooks/useEventForm";
import EventBasicFields from "./components/EventBasicFields";
import EventDateCapacityFields from "./components/EventDateCapacityFields";
import EventFormActions from "./components/EventFormActions";
import EventImageManager from "./components/EventImageManager";
import EventTagsField from "./components/EventTagsField";
import styles from "./ModalForm.module.scss";

interface EventFormProps {
    event?: IEvent;
    onClose: () => void;
    onSubmit: (event: IEvent) => Promise<void>;
    show: boolean;
    userId?: number;
}

const EventForm: React.FC<EventFormProps> = React.memo(({
    event,
    onClose,
    onSubmit,
    show,
    userId
}) => {
    const {
        title, setTitle,
        message, setMessage,
        location, setLocation,
        capacity, setCapacity,
        eventDate, setEventDate,
        link, setLink,
        tags, setTags,
        eventTime, setEventTime, // Updated to match the hook
        imagePreviews,
        isSubmitting,
        globalError,
        handleImagesSelected,
        handleRemoveImage,
        submitForm
    } = useEventForm({ event, show, userId });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await submitForm(onSubmit, onClose);
    };

    return (
        <Modal size="lg" show={show} onHide={onClose} className={styles.modalForm} centered style={{ zIndex: 1055 }}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {event ? "✏️ Editar Evento" : "🎉 Crear Nuevo Evento"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    {globalError && <div className={styles.globalError}>{globalError}</div>}

                    <EventBasicFields
                        title={title}
                        setTitle={setTitle}
                        message={message}
                        setMessage={setMessage}
                        location={location}
                        setLocation={setLocation}
                        link={link}
                        setLink={setLink}
                    />

                    <EventDateCapacityFields
                        eventDate={eventDate}
                        setEventDate={setEventDate}
                        capacity={capacity}
                        setCapacity={setCapacity}
                        time={eventTime} // Updated to use eventTime
                        setTime={setEventTime} // Updated to use setEventTime
                    />

                    <EventImageManager
                        imagePreviews={imagePreviews}
                        onImagesSelected={handleImagesSelected}
                        onRemoveImage={handleRemoveImage}
                    />

                    <EventTagsField
                        tags={tags}
                        setTags={setTags}
                    />

                    <EventFormActions
                        isSubmitting={isSubmitting}
                        event={event}
                        onClose={onClose}
                    />
                </form>
            </Modal.Body>
        </Modal>
    );
});

export default EventForm;