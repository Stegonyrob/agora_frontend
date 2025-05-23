import { IEventDTO } from "@/core/events/IEventDTO";
import DOMPurify from "dompurify";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import styles from "./EditModalForm.module.scss";

interface EditEventFormProps {
    event?: IEventDTO;
    onSubmit: (event: IEventDTO) => void;
    onClose: () => void;
    show: boolean;
}

const EditEventForm = ({ event, onSubmit, onClose, show }: EditEventFormProps) => {
    const [title, setTitle] = useState(event?.title || "");
    const [message, setMessage] = useState(event?.message || "");
    const [place, setPlace] = useState(event?.place || "");
    const [date, setDate] = useState(event?.date || "");
    const [link, setLink] = useState(event?.link || "");
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Sanitize inputs
        const sanitizedTitle = DOMPurify.sanitize(title);
        const sanitizedMessage = DOMPurify.sanitize(message);

        const newEvent: IEventDTO = {
            id: event?.id || 0,
            title: sanitizedTitle,
            message: sanitizedMessage,
            userId: event?.userId || 0,
            loves: 0,
            isArchived: false,
            tags: [],
            alt_image: "",
            source_image: "",
            alt_avatar: "",
            source_avatar: "",


            url_avatar: "",
            images: [],
            isPublished: false,
            location: "",

            description: "",
            createdAt: "",
            updatedAt: "",
            date: "",
            link: ""
        };
        onSubmit(newEvent);
    };

    return (
        <div className={styles.Container}>
            <Modal size="lg" centered show={show} onHide={onClose} className={styles.modalCard}>
                <Modal.Header className={styles.modalHeader} closeButton>
                    <Modal.Title>Formulario de Edición de los Eventos</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Título:
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Mensaje:
                            <textarea
                                value={message.toString()}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Lugar:
                            <input
                                type="text"
                                value={place}
                                onChange={(e) => setPlace(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Fecha:
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Enlace:
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </label>
                        <br />
                        <Button type="submit" variant="primary">
                            {event ? "Actualizar Evento" : "Crear Evento"}
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EditEventForm;
