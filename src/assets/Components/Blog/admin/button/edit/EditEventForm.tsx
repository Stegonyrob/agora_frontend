import { IEventDTO } from "@/core/events/IEventDTO";
import { RootState } from "@/redux/store";
import DOMPurify from "dompurify";
import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import ImageUploadButton from "../../images/ImageUploadButton";
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
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [place, setPlace] = useState("");
    const [date, setDate] = useState("");
    const [link, setLink] = useState("");
    const [capacity, setCapacity] = useState<number | string>(0); // Puede ser string para campos vacíos
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]); // Estado para archivos de nuevas imágenes
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const imagesState = useSelector((state: RootState) => state.images);

    // Cargar datos del evento cuando se abre el modal o cuando el evento cambia
    useEffect(() => {
        if (show && event) {
            setTitle(event.title || "");
            setMessage(event.message || "");
            setPlace(event.place || "");
            setCapacity(event.capacity || 0);
            setLink(event.link || "");

            if (event.eventDate) {
                const formattedDate = new Date(event.eventDate).toISOString().split('T')[0];
                setDate(formattedDate);
            } else {
                setDate("");
            }
            setExistingImages(event.images || []);
            setNewImageFiles([]); // Limpiar nuevas imágenes al cargar un nuevo evento
            setFormErrors({}); // Limpiar errores al cargar un nuevo evento
        } else if (!show) {
            // Reiniciar el formulario cuando el modal se cierra
            setTitle("");
            setMessage("");
            setPlace("");
            setDate("");
            setLink("");
            setCapacity(0);
            setExistingImages([]);
            setNewImageFiles([]);
            setFormErrors({});
        }
    }, [event, show]);

    // Validaciones del formulario
    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        if (!title.trim()) {
            errors.title = "El título del evento es obligatorio.";
        }
        if (typeof capacity === "string" || capacity < 0) {
            errors.capacity = "El aforo debe ser un número positivo.";
        }
        // Puedes añadir más validaciones aquí, por ejemplo para fecha o enlace

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // No envía si hay errores de validación
        }

        const sanitizedTitle = DOMPurify.sanitize(title);
        const sanitizedMessage = DOMPurify.sanitize(message);

        if (!event || typeof event.id !== "number") {
            // Este error debe ser manejado en un nivel superior o el componente no debería renderizarse sin un ID
            console.error("El evento original debe tener un id válido para la edición.");
            return;
        }

        // Combinar imágenes existentes y URLs de imágenes subidas a través del store de Redux
        // Se asume que imagesState.images ya contiene las URLs finales de las imágenes subidas por ImageUploadButton
        const allImages = [
            ...existingImages,
            ...imagesState.images
                .map((img: { url?: string }) => img.url)
                .filter((url): url is string => typeof url === "string" && url.length > 0),
        ];

        const updatedEvent: IEventDTO = {
            ...event, // Mantener cualquier otra propiedad del evento original
            id: event.id,
            title: sanitizedTitle,
            message: sanitizedMessage,
            place,
            eventDate: date,
            link,
            capacity: Number(capacity), // Asegurar que sea número
            images: allImages,
        };

        onSubmit(updatedEvent);
    };

    const handleNewImagesSelected = (files: File[] | null) => {
        if (!files) {
            console.error("handleNewImagesSelected: files es nulo");
            return;
        }

        setNewImageFiles(files);
        // Aquí podrías disparar una acción de Redux para subir estas imágenes
        // y que las URLs resultantes se almacenen en imagesState.images
        console.log("Nuevas imágenes seleccionadas:", files.length);
    };

    const handleRemoveExistingImage = (idx: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== idx));
    };

    // Previsualizaciones de las nuevas imágenes seleccionadas pero aún no subidas
    const newImagePreviews = useMemo(() => {
        return newImageFiles.map(file => URL.createObjectURL(file));
    }, [newImageFiles]);

    const handleRemoveNewImage = (idx: number) => {
        const updatedFiles = newImageFiles.filter((_, i) => i !== idx);
        setNewImageFiles(updatedFiles);
    };

    return (
        <Modal size="lg" show={show} onHide={onClose} className={styles.eventForm}>
            <Modal.Header className={styles.eventForm} closeButton>
                <Modal.Title>
                    {event ? "✏️ Editar Evento" : "🎉 Crear Nuevo Evento"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.eventForm}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="eventTitle" className="form-label">
                            <strong>📝 Título del Evento *</strong>
                        </label>
                        <input
                            type="text"
                            id="eventTitle"
                            className={`form-control ${formErrors.title ? styles.isInvalid : ""}`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej: Taller de Robótica, Conferencia de IA..."
                            required
                        />
                        {formErrors.title && (
                            <div className={styles.errorText}>{formErrors.title}</div>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="eventMessage" className={styles.titleLabel}>
                            Mensaje:
                        </label>
                        <textarea
                            id="eventMessage"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe el evento, lo que los asistentes aprenderán..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="eventPlace" className={styles.titleLabel}>
                            Lugar:
                        </label>
                        <input
                            type="text"
                            id="eventPlace"
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            placeholder="Ej: Sala de Conferencias A, Online..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="eventDate" className={styles.titleLabel}>
                            Fecha:
                        </label>
                        <input
                            type="date"
                            id="eventDate"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="eventCapacity" className={styles.titleLabel}>
                            Aforo:
                        </label>
                        <input
                            type="number"
                            id="eventCapacity"
                            className={`${formErrors.capacity ? styles.isInvalid : ""}`}
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            min="0"
                            placeholder="Capacidad máxima"
                        />
                        {formErrors.capacity && (
                            <div className={styles.errorText}>{formErrors.capacity}</div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="eventLink" className={styles.titleLabel}>
                            Enlace:
                        </label>
                        <input
                            type="url"
                            id="eventLink"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="https://example.com/mas-info"
                        />
                    </div>

                    <div className={styles.imageSection}>
                        <label className={styles.imageSectionTitle}>🖼️ Gestión de Imágenes</label>

                        {/* Imágenes existentes */}
                        {existingImages.length > 0 && (
                            <div className={styles.existingImagesContainer}>
                                <h4 className={styles.subsectionTitle}>📷 Imágenes actuales:</h4>
                                <div className={styles.imagePreviewGrid}>
                                    {existingImages.map((img, idx) => (
                                        <div key={`existing-${idx}`} className={styles.imagePreview}>
                                            <img src={img} alt={`Imagen ${idx + 1}`} />
                                            <button
                                                type="button"
                                                className={styles.removeImageBtn}
                                                onClick={() => handleRemoveExistingImage(idx)}
                                                title="Eliminar imagen existente"
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Previsualización de nuevas imágenes a subir */}
                        {newImageFiles.length > 0 && (
                            <div className={styles.newImagesPreviewContainer}>
                                <h4 className={styles.subsectionTitle}>✨ Nuevas imágenes a subir:</h4>
                                <div className={styles.imagePreviewGrid}>
                                    {newImagePreviews.map((src, idx) => (
                                        <div key={`new-${idx}`} className={styles.imagePreview}>
                                            <img src={src} alt={`Nueva imagen ${idx + 1}`} />
                                            <button
                                                type="button"
                                                className={styles.removeImageBtn}
                                                onClick={() => handleRemoveNewImage(idx)}
                                                title="Eliminar nueva imagen"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Botón para agregar nuevas imágenes */}
                        <div className={styles.newImagesUploadSection}>
                            <h4 className={styles.subsectionTitle}>➕ Seleccionar nuevas imágenes:</h4>
                            <ImageUploadButton onImagesSelected={handleNewImagesSelected} />
                            <small className={styles.helpText}>Puedes seleccionar varias imágenes. Se cargarán al guardar el evento.</small>
                        </div>
                    </div>

                    {submitError && (
                        <div className={styles.globalError}>{submitError}</div>
                    )}

                    <div className={styles.submitButtonContainer}>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : "Actualizar Evento"}
                        </button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default React.memo(EditEventForm)