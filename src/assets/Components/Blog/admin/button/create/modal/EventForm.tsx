import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import EventService from "../../../../../../../core/events/EventService";
import { IEvent } from "../../../../../../../core/events/IEvent";
import { IEventDTO } from "../../../../../../../core/events/IEventDTO";
import { RootState } from "../../../../../../../redux/store";
import ButtonAddImage from "../../image/ButtonAddImage";
import styles from "./EventForm.module.scss";

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
    const role = useSelector((state: RootState) => state.login.loggedUserRole);
    const isAuthenticated = useSelector((state: RootState) => state.login.isLoggedIn);
    const apiEvent = new EventService();

    const handleSubmit = async (eventForm: React.FormEvent<HTMLFormElement>) => {
        eventForm.preventDefault();
        if (!title || !description) {
            alert("Título y descripción son campos obligatorios.");
            return;
        }

        const newEvent: IEventDTO = {
            id: event?.id || 0,
            userName: event?.userName || "",
            title,
            description: String(description),
            location: "",
            isArchived: false,
            tags: [],
            images: [],
            userId: event?.userId || 0,
            message: "",
            loves: 0,
            comments: [],
            isPublished: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            alt_image: "",
            source_image: "",
            alt_avatar: "",
            source_avatar: "",
            url_avatar: "",
            role: role || "",

        };

        if (isAuthenticated) {
            newEvent.userId = role === "admin" ? 0 : 1;
            newEvent.userName = role === "admin" ? "admin" : "user";
        }

        try {
            await apiEvent.createEvent(newEvent);
            alert("Evento creado con éxito.");
            onClose();
            setTitle("");
            setDescription("");
        } catch (error) {
            console.error("Error al crear el evento:", error);
            alert(
                `No se pudo crear el evento: ${error instanceof Error ? error.message : "Error desconocido"
                }. Inténtelo de nuevo más tarde.`
            );
        }
    };

    return (
        <Modal dark size="lg" show={show} onHide={onClose} className={styles.eventForm}>
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
                        onImageSelected={(imageSrc, imageTitle) => {
                            // Aquí se tiene que agregar la lógica para manejar la imagen seleccionada
                            console.log(imageSrc, imageTitle);
                        }}
                    />
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