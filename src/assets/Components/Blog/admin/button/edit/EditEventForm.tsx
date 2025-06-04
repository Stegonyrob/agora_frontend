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
    const [images, setImages] = useState<string[]>(event?.images || []);

    // Manejar selección de imágenes
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const readers = filesArray.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });
            Promise.all(readers).then(imgs => setImages([...images, ...imgs]));
        }
    };

    // Eliminar imagen
    const handleRemoveImage = (idx: number) => {
        setImages(images.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Sanitize inputs
        const sanitizedTitle = DOMPurify.sanitize(title);
        const sanitizedMessage = DOMPurify.sanitize(message);

        if (!event || typeof event.id !== "number") {
            throw new Error("El evento original debe tener un id válido.");
        }
        const newEvent: IEventDTO = {
            ...event,
            id: event.id, // Ensure id is always present and a number
            title: sanitizedTitle,
            message: sanitizedMessage,
            place,
            date,
            link,
            images,
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
                                value={message}
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
                        <label>
                            Imágenes:
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                            />
                        </label>
                        <div className={styles.imagePreviewContainer}>
                            {images.map((img, idx) => (
                                <div key={idx} className={styles.imagePreview}>
                                    <img src={img} alt={`preview-${idx}`} width={80} />
                                    <button type="button" onClick={() => handleRemoveImage(idx)}>Eliminar</button>
                                </div>
                            ))}
                        </div>
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