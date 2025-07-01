import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import EventService from "../../../../../../../core/events/EventService";
import { IEvent } from "../../../../../../../core/events/IEvent";
import { IEventDTO } from "../../../../../../../core/events/IEventDTO";
import TagSelector from "../../../components/TagSelector";
import ImageUploadButton from "../../../images/ImageUploadButton";
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
    const [images, setImages] = useState<string[]>(event?.images || []);
    const [tags, setTags] = useState<string[]>(event?.tags || []);
    const [location, setLocation] = useState(event?.location || "");
    const [capacity, setCapacity] = useState(event?.capacity || 0);
    const [eventDate, setEventDate] = useState(() => {
        if (event?.eventDate) {
            // Convertir de ISO a formato yyyy-MM-dd
            return new Date(event.eventDate).toISOString().split('T')[0];
        }
        return "";
    });
    const [link, setLink] = useState(event?.link || "");

    // Recupera los datos del usuario desde sessionStorage
    const userRole = sessionStorage.getItem("role");
    const userId = Number(sessionStorage.getItem("userId")) || 0;
    const userName = sessionStorage.getItem("userName") || "";

    const apiEvent = new EventService();

    // Maneja la selección de imágenes desde ImageUploadButton
    const handleImagesSelected = (files: File[]) => {
        // Aquí podrías subir las imágenes a tu servidor
        // Por ahora, creamos URLs temporales para preview
        files.forEach(file => {
            const imageUrl = URL.createObjectURL(file);
            setImages(prev => [...prev, imageUrl]);
        });
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

        if (!title || !description || !eventDate || !location) {
            alert("Título, descripción, fecha y ubicación son campos obligatorios.");
            return;
        }

        const newEvent: IEventDTO = {
            id: event?.id || 0,
            title,
            description: String(description),
            location,
            capacity: Number(capacity) || 0,
            eventDate: new Date(eventDate).toISOString(), // Convertir a ISO
            link,
            isArchived: false,
            tags: tags,
            images,
            message: String(description), // Usar description como message
            loves: 0,
            isPublished: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            alt_image: "",
            source_image: "",
            alt_avatar: "",
            source_avatar: "",
            url_avatar: "",
            userId: userId,
        };

        try {
            await apiEvent.createEvent(newEvent);
            alert("Evento creado con éxito.");
            onClose();
            setTitle("");
            setDescription("");
            setImages([]);
            setTags([]);
            setLocation("");
            setCapacity(0);
            setEventDate("");
            setLink("");
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
            <Modal.Header className={styles.modalHeader} closeButton>
                <Modal.Title>
                    {event ? "✏️ Editar Evento" : "🎉 Crear Nuevo Evento"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label">
                            <strong>📝 Título del Evento *</strong>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej: Taller de Robótica, Conferencia de IA..."
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">
                            <strong>📄 Descripción del Evento *</strong>
                        </label>
                        <textarea
                            className="form-control"
                            rows={4}
                            value={String(description || "")}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe el evento, qué actividades se realizarán, a quién está dirigido..."
                            required
                        />
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                <strong>📅 Fecha del Evento *</strong>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                <strong>Aforo máximo 👥</strong>
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                value={capacity}
                                onChange={(e) => setCapacity(Number(e.target.value))}
                                min="0"
                                placeholder="Ej: 25, 50, 100..."
                            />
                            <small className="text-muted">
                                💡 Dejar en 0 = sin límite de aforo
                            </small>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label">
                            <strong>📍 Ubicación *</strong>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Ej: Aula 1, Centro Cívico, Salón de Actos..."
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">
                            <strong>🔗 Enlace adicional (opcional)</strong>
                        </label>
                        <input
                            type="url"
                            className="form-control"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="https://ejemplo.com/mas-informacion"
                        />
                        <small className="text-muted">
                            💡 Link para más información, inscripciones, etc.
                        </small>
                    </div>

                    <div className="mb-4">
                        <label className="form-label">
                            <strong>🖼️ Imágenes del Evento</strong>
                        </label>
                        <ImageUploadButton
                            onImagesSelected={handleImagesSelected}
                            multiple={true}
                        />
                        <div className={styles.imagePreviewContainer}>
                            {images.map((img, idx) => (
                                <div key={idx} className={styles.imagePreview}>
                                    <img src={img} alt={`preview-${idx}`} width={80} />
                                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveImage(idx)}>
                                        ❌
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <TagSelector
                            selectedTags={tags}
                            onTagsChange={setTags}
                            placeholder="🏷️ Agregar etiquetas para el evento..."
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            ❌ Cancelar
                        </Button>
                        <Button type="submit" variant="primary">
                            {event ? "💾 Actualizar Evento" : "🎉 Crear Evento"}
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default EventForm;