import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import EventService from "../../../core/events/EventService";
import { IEvent } from "../../../core/events/IEvent";
import { IEventDTO } from "../../../core/events/IEventDTO";
import ButtonCreateEvent from "../Blog/admin/button/create/ButtonCreateEvent";
import EventCard from "../Events/EventItem";
import styles from "./EventListAdmin.module.scss";

interface EventListProps {
    event: IEvent[];
    onSelect: (event: IEvent) => void;
    onDelete: (eventId: number) => Promise<void>;
    onClose: () => void;
    onEdit: (event: IEvent) => void;
    onCreate: (newEvent: IEventDTO) => Promise<void>;
    userId: number | null;
    eventId: number;
    onArchive: (eventId: number) => Promise<boolean>;
    onUnarchive: (eventId: number) => Promise<boolean>;
    onSubmit: (event: IEvent) => void;
    onHide: () => void;
    role: string | null;
    userName: string | null;
    userRole: string | null;
}

const EventListAdmin = ({ userId }: { userId: number }, { event }: EventListProps) => {
    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
    const [fetchedEvents, setFetchedEvents] = useState<IEvent[]>([]);
    const [showForm, setShowForm] = React.useState(false);

    // Obtener userId y userRole desde sessionStorage
    const userRole = sessionStorage.getItem("role");
    const userName = sessionStorage.getItem("userName");

    // Verificar si el usuario es admin
    if (userRole !== "ROLE_ADMIN") {
        console.error("Access denied: Only administrators can access this page.");
        alert("Acceso denegado: Solo los administradores pueden acceder a esta página.");
        return null; // Evitar renderizar el componente si no es admin
    }

    const handleCreateEvent = () => {
        setShowForm(true);
    };

    const apiEvent = new EventService();

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const fetchedEvents = await apiEvent.fetchEvents();
                if (fetchedEvents) {
                    setFetchedEvents(fetchedEvents);
                } else {
                    console.warn("Fetched events are null or undefined");
                }
            } catch (error) {
                console.error("Error loading events: ", error);
            }
        };
        loadEvents();
    }, []);

    const handleSelect = (event: IEvent) => {
        setSelectedEvent(event);
    };

    const handleClose = () => {
        setSelectedEvent(null);
    };

    const handleDelete = async (eventId: number) => {
        try {
            const eventToDelete = fetchedEvents.find((event: IEvent) => event.id === eventId);
            if (eventToDelete) {
                const eventDTO: IEventDTO = {
                    id: eventToDelete.id,
                    title: eventToDelete.title,
                    description: String(eventToDelete.description || ""),
                    message: eventToDelete.message,
                    userId: eventToDelete.userId,
                    location: eventToDelete.location,
                    loves: eventToDelete.loves,
                    isArchived: eventToDelete.isArchived,
                    tags: eventToDelete.tags,
                    images: eventToDelete.images,
                    isPublished: eventToDelete.isPublished,
                    alt_avatar: String(eventToDelete.alt_avatar || ""),
                    source_avatar: String(eventToDelete.source_avatar || ""),
                    url_avatar: eventToDelete.url_avatar,

                    alt_image: String(eventToDelete.alt_image || ""),
                    source_image: String(eventToDelete.source_image || ""),
                    userName: eventToDelete.userName || "",
                    createdAt: String(eventToDelete.createdAt || ""),
                    updatedAt: String(eventToDelete.updatedAt || ""),
                };
                await apiEvent.deleteEvent(eventId);
            } else {
                console.error(`Event with ID: ${eventId} not found.`);
            }
            setFetchedEvents(fetchedEvents.filter((event: IEvent) => event.id !== eventId));
        } catch (error) {
            console.error("Error deleting event: ", error);
        }
    };

    const handleUpdate = async (updatedEvent: IEvent) => {
        try {
            if (!updatedEvent) {
                throw new Error("Updated event is null or undefined");
            }

            // Sanitize inputs
            updatedEvent.title = DOMPurify.sanitize(updatedEvent.title);
            updatedEvent.description = DOMPurify.sanitize(updatedEvent.description);

            const updatedEventData: IEventDTO = { ...updatedEvent };
            const updatedEventResponse = await apiEvent.updateEvent(updatedEvent.id, updatedEventData);
            setFetchedEvents(
                fetchedEvents.map((event: IEvent) =>
                    event.id === updatedEvent.id ? updatedEventResponse : event
                )
            );
        } catch (error) {
            console.error("Error updating event: ", error);
        }
    };

    const handleArchive = async (eventId: number): Promise<boolean> => {
        try {
            const result = await apiEvent.archiveEvent(eventId, true);
            if (result) {
                setFetchedEvents(
                    fetchedEvents.map((event: IEvent) =>
                        event.id === eventId ? { ...event, isArchived: true } : event
                    )
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error archiving event: ", error);
            return false;
        }
    };

    const handleUnArchive = async (eventId: number): Promise<boolean> => {
        try {
            const result = await apiEvent.unarchiveEvent(eventId, false);
            if (result) {
                setFetchedEvents(
                    fetchedEvents.map((event: IEvent) =>
                        event.id === eventId ? { ...event, isArchived: false } : event
                    )
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error unarchiving event: ", error);
            return false;
        }
    };

    const handleCreate = async (newEvent: IEventDTO | null | undefined) => {
        if (!newEvent) {
            console.error("Error creating event: newEvent is null or undefined");
            return;
        }

        // Sanitize inputs
        newEvent.title = DOMPurify.sanitize(newEvent.title);
        newEvent.description = DOMPurify.sanitize(newEvent.description);

        try {
            const createdEvent = await apiEvent.createEvent(newEvent);
            setFetchedEvents([...fetchedEvents, createdEvent]);
            setShowForm(false);
        } catch (error) {
            console.error("Error creating event: ", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <h4 className={styles.title}>Lista de Eventos</h4>
                <ButtonCreateEvent onSubmit={handleCreate} userId={userId} userName={userName || ""} />
                <div className={styles.panelBody}>
                    {fetchedEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onSelect={handleSelect}
                            onDelete={handleDelete}
                            onEdit={handleUpdate}
                            onArchive={handleArchive}
                            onUnArchive={handleUnArchive}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventListAdmin;