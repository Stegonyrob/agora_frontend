import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import EventService from "../../../../../../../core/events/EventService";
import { IEvent } from "../../../../../../../core/events/IEvent";
import { IEventDTO } from "../../../../../../../core/events/IEventDTO";
import ButtonAddImage from "../../image/ButtonAddImage";
import styles from "./PostForm.module.scss";

interface EventFormProps {
    event?: IEvent;
    onClose: () => void;
    onSubmit: (event: IEvent) => Promise<void>;
    show: boolean;
    userId: number;
    userName: string;
}
const EventForm: React.FC<EventFormProps> = ({ event, onClose, onSubmit, show }) => {
    const [title, setTitle] = useState(event?.title || "");
    const [description, setDescription] = useState(event?.description || "");
    const [images, setImages] = useState<string[]>(event?.images || []);

    // Recupera los datos del usuario desde sessionStorage
    const userRole = sessionStorage.getItem("role");
    const userId = Number(sessionStorage.getItem("userId")) || 0;
    const userName = sessionStorage.getItem("userName") || "";

    const apiEvent = new EventService();

    // Maneja la selección de imágenes desde ButtonAddImage
    const handleImageSelected = (imageSrc: string, imageTitle: string) => {
        setImages((prev) => [...prev, imageSrc]);
    };

    // Elimina una imagen del array
    const handleRemoveImage = (idx: number) => {
        setImages(images.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (eventForm: React.FormEvent<HTMLFormElement>) => {
        eventForm.preventDefault();

        // Solo permite admins
        if (userRole !== "ROLE_ADMIN") {
            alert("Solo los administradores pueden crear eventos.");
            return;
        }

        if (!title || !description) {
            alert("Título y descripción son campos obligatorios.");
            return;
        }

        const newEvent: IEventDTO = {
            id: event?.id || 0,
            title,
            description: String(description),
            location: "",
            isArchived: false,
            tags: [],
            images,
            message: "",
            loves: 0,
            isPublished: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            alt_image: "",
            source_image: "",
            alt_avatar: "",
            source_avatar: "",
            url_avatar: "",
            date: "",
            link: "",
            userId: userId,
        };

        try {
            await apiEvent.createEvent(newEvent);
            alert("Evento creado con éxito.");
            onClose();
            setTitle("");
            setDescription("");
            setImages([]);
        } catch (error) {
            console.error("Error al crear el evento:", error);
            alert(
                `No se pudo crear el evento: ${error instanceof Error ? error.message : "Error desconocido"
                }. Inténtelo de nuevo más tarde.`
            );
        }
    };

    return (
        <Modal size="lg" show={show} onHide={onClose} className={styles.eventForm}>
            <Modal.Header className={styles.eventForm} closeButton>
                <Modal.Title>{event ? "Editar Evento" : "Crear Evento"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.eventForm}>
                <form onSubmit={handleSubmit}>
                    <label>
                        Título:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                    <br />

                    <ButtonAddImage
                        onImageSelected={handleImageSelected}
                    />
                    <div className={styles.imagePreviewContainer}>
                        {images.map((img, idx) => (
                            <div key={idx} className={styles.imagePreview}>
                                <img src={img} alt={`preview-${idx}`} width={80} />
                                <button type="button" onClick={() => handleRemoveImage(idx)}>Eliminar</button>
                            </div>
                        ))}
                    </div>
                    <label>
                        Descripción:
                        <textarea
                            value={String(description || "")}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <Button type="submit" variant="primary">
                        {event ? "Actualizar Evento" : "Crear Evento"}
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default EventForm;