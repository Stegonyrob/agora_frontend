import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap"; // Importa Form de react-bootstrap
import EventService from "../../../../../../../core/events/EventService";
import { IEvent } from "../../../../../../../core/events/IEvent";
import { IEventDTO } from "../../../../../../../core/events/IEventDTO";
import ImageUploadButton from "../../../images/ImageUploadButton";
import TagSelector from "../../../tags/TagSelector";
import styles from "./EventForm.module.scss"; // Asegúrate de que esta ruta sea correcta

interface EventFormProps {
    event?: IEvent;
    onClose: () => void;
    onSubmit: (event: IEvent) => Promise<void>;
    show: boolean;
    userId: number;
    userName: string;
}

interface ImagePreview {
    url: string;
    isLoading: boolean;
    file?: File;
    isExisting?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
    event,
    onClose,
    onSubmit,
    show,
    userId,
    userName
}) => {
    const [title, setTitle] = useState(event?.title || "");
    const [description, setDescription] = useState(event?.description || "");
    const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
    const [tags, setTags] = useState<string[]>(event?.tags || []);
    const [location, setLocation] = useState(event?.location || "");
    const [capacity, setCapacity] = useState(event?.capacity || 0);
    const [eventDate, setEventDate] = useState(() => {
        if (event?.eventDate) {
            return new Date(event.eventDate).toISOString().split('T')[0];
        }
        return "";
    });
    const [link, setLink] = useState(event?.link || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null); // Nuevo estado para errores globales

    const userRole = sessionStorage.getItem("role");
    const apiEvent = new EventService();

    // Inicializar imágenes existentes al cargar el evento
    useEffect(() => {
        if (event?.images && event.images.length > 0) {
            const existingImages: ImagePreview[] = event.images.map(imageUrl => ({
                url: imageUrl,
                isLoading: false,
                isExisting: true
            }));
            setImagePreviews(existingImages);
        } else {
            setImagePreviews([]);
        }
        setGlobalError(null); // Limpiar errores al abrir el modal
    }, [event, show]); // Dependencia 'show' para reiniciar cuando el modal se abre

    // Limpiar URLs de objetos cuando el componente se desmonte o el modal se cierre
    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => {
                // Solo revocar URL si fue creada localmente y no es una imagen existente del servidor
                if (preview.url && !preview.isExisting && preview.file) {
                    URL.revokeObjectURL(preview.url);
                }
            });
        };
    }, [imagePreviews]);


    // Maneja la selección de imágenes desde ImageUploadButton
    const handleImagesSelected = useCallback((files: File[]) => {
        const newPreviews: ImagePreview[] = files.map(file => ({
            url: URL.createObjectURL(file),
            isLoading: false,
            file: file,
            isExisting: false
        }));

        setImagePreviews(prev => [...prev, ...newPreviews]);
    }, []);

    // Elimina una imagen del array
    const handleRemoveImage = useCallback((idx: number) => {
        setImagePreviews(prev => {
            const imageToRemove = prev[idx];
            if (imageToRemove?.url && !imageToRemove.isExisting && imageToRemove.file) {
                URL.revokeObjectURL(imageToRemove.url);
            }
            return prev.filter((_, i) => i !== idx);
        });
    }, []);

    const handleSubmit = async (eventForm: React.FormEvent<HTMLFormElement>) => {
        eventForm.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);
        setGlobalError(null); // Limpiar errores previos

        try {
            // Validación de permisos
            if (userRole !== "ROLE_ADMIN") {
                throw new Error("Solo los administradores pueden crear/editar eventos.");
            }

            // Validación de campos requeridos
            if (!title.trim() || !description.trim() || !eventDate || !location.trim()) {
                throw new Error("Título, descripción, fecha y ubicación son campos obligatorios.");
            }

            const eventData: IEventDTO = {
                id: event?.id || 0,
                title: title.trim(),
                description: description.trim(),
                location: location.trim(),
                capacity: Number(capacity) || 0,
                eventDate: new Date(eventDate).toISOString(),
                link: link.trim(),
                isArchived: false,
                tags: tags,
                // Solo envía las URLs de las imágenes, el backend debe manejar la subida
                images: imagePreviews.map(preview => preview.url),
                message: description.trim(), // Asumo que `message` es lo mismo que `description`
                loves: event?.loves || 0,
                isPublished: event?.isPublished || false,
                createdAt: event?.createdAt ? String(event.createdAt) : new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                alt_image: "", // Placeholder
                source_image: "", // Placeholder
                alt_avatar: "", // Placeholder
                source_avatar: "", // Placeholder
                url_avatar: "", // Placeholder
                userId: userId,
            };

            if (event?.id) {
                // Actualizar evento existente
                await apiEvent.updateEvent(event.id, eventData);
                const updatedEvent: IEvent = {
                    ...eventData,
                    creationDate: eventData.createdAt,
                    favoritesCount: 0, // Estos campos no están en IEventDTO pero sí en IEvent
                    attendentsCount: 0
                };
                if (onSubmit) {
                    await onSubmit(updatedEvent);
                }
            } else {
                // Crear nuevo evento
                await apiEvent.createEvent(eventData);
            }

            // Limpiar formulario solo si es creación
            if (!event?.id) {
                resetForm();
            }

            onClose(); // Cerrar modal después de éxito
        } catch (error) {
            console.error("Error al procesar el evento:", error);
            const errorMessage = error instanceof Error ? error.message : "Error desconocido al guardar el evento.";
            setGlobalError(errorMessage); // Mostrar el error globalmente en el modal
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setImagePreviews([]);
        setTags([]);
        setLocation("");
        setCapacity(0);
        setEventDate("");
        setLink("");
    };

    return (
        <Modal size="lg" show={show} onHide={onClose} className={styles.eventForm} centered>
            {/* Aplica styles.eventForm para el fondo y texto base */}
            <Modal.Header closeButton>
                {/* Modal.Header ya tiene estilos globales, no necesita styles.eventForm */}
                <Modal.Title>
                    {event ? "✏️ Editar Evento" : "🎉 Crear Nuevo Evento"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Modal.Body ya tiene estilos globales */}
                <form onSubmit={handleSubmit}>
                    {globalError && <div className={styles.globalError}>{globalError}</div>}

                    <Form.Group className={styles.formGroup} controlId="formEventTitle">
                        <Form.Label>
                            <strong>📝 Título del Evento *</strong>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej: Taller de Robótica, Conferencia de IA..."
                            required
                        />
                    </Form.Group>

                    <Form.Group className={styles.formGroup} controlId="formEventDescription">
                        <Form.Label>
                            <strong>📄 Descripción del Evento *</strong>
                        </Form.Label>
                        <Form.Control
                            as="textarea" // Usa 'as="textarea"' para un textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe el evento, qué actividades se realizarán, a quién está dirigido..."
                            required
                        />
                    </Form.Group>

                    <div className={`${styles.formGroup} row`}> {/* Combina formGroup con la clase row de Bootstrap */}
                        <Form.Group className="col-md-6" controlId="formEventDate">
                            <Form.Label>
                                <strong>📅 Fecha del Evento *</strong>
                            </Form.Label>
                            <Form.Control
                                type="date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="col-md-6" controlId="formEventCapacity">
                            <Form.Label>
                                <strong>Aforo máximo 👥</strong>
                            </Form.Label>
                            <Form.Control
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(Number(e.target.value))}
                                min="0"
                                placeholder="Ej: 25, 50, 100..."
                            />
                            <Form.Text className="text-muted">
                                💡 Dejar en 0 = sin límite de aforo
                            </Form.Text>
                        </Form.Group>
                    </div>

                    <Form.Group className={styles.formGroup} controlId="formEventLocation">
                        <Form.Label>
                            <strong>📍 Ubicación *</strong>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Ej: Aula 1, Centro Cívico, Salón de Actos..."
                            required
                        />
                    </Form.Group>

                    <Form.Group className={styles.formGroup} controlId="formEventLink">
                        <Form.Label>
                            <strong>🔗 Enlace adicional (opcional)</strong>
                        </Form.Label>
                        <Form.Control
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="https://ejemplo.com/mas-informacion"
                        />
                        <Form.Text className="text-muted">
                            💡 Link para más información, inscripciones, etc.
                        </Form.Text>
                    </Form.Group>

                    <div className={styles.imageSection}>
                        <Form.Label className={styles.imageSectionTitle}>
                            <strong>🖼️ Imágenes del Evento</strong>
                        </Form.Label>
                        <div className={styles.newImagesUploadSection}>
                            <ImageUploadButton
                                onImagesSelected={handleImagesSelected}
                                multiple={true}
                            />
                            <Form.Text className={styles.helpText}>
                                💡 Puedes subir múltiples imágenes. Se mostrarán miniaturas de 80x80px
                            </Form.Text>
                        </div>
                        {imagePreviews.length > 0 && (
                            <div className={styles.imagePreviewContainer}> {/* Usa la nueva clase aquí */}
                                {imagePreviews.map((preview, idx) => (
                                    <div key={idx} className={styles.imagePreview}>
                                        {preview.isLoading ? (
                                            <div className={styles.imagePlaceholder}>
                                                <div className={styles.loadingSpinner}></div>
                                                <span className={styles.loadingText}>Cargando...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <img
                                                    src={preview.url}
                                                    alt={`preview-${idx}`}
                                                    className={styles.previewImage}
                                                    onError={(e) => {
                                                        console.error('Error al cargar imagen:', preview.url);
                                                        e.currentTarget.src = '/images/avatarGeneric.png'; // Fallback
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="danger" // Usa variant de Bootstrap, el estilo se anulará por :global()
                                                    className={styles.removeButton} // Aplica tu clase CSS Module
                                                    onClick={() => handleRemoveImage(idx)}
                                                    title="Eliminar imagen"
                                                >
                                                    ❌
                                                </Button>
                                                {preview.isExisting && (
                                                    <span className={styles.existingBadge}>Existente</span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Form.Group className={styles.formGroup} controlId="formEventTags">
                        <TagSelector
                            selectedTags={tags}
                            onTagsChange={setTags}
                            placeholder="🏷️ Agregar etiquetas para el evento..."
                        />
                        <Form.Text className="text-muted">
                            💡 Las etiquetas ayudan a categorizar y encontrar tu evento más fácilmente
                        </Form.Text>
                    </Form.Group>

                    <div className={styles.submitButtonContainer}>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            ❌ Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    {event ? "Actualizando..." : "Creando..."}
                                </>
                            ) : (
                                event ? "💾 Actualizar Evento" : "🎉 Crear Evento"
                            )}
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default EventForm;