import EventService from "@/core/events/EventService";
import { IEvent } from "@/core/events/IEvent";
import { IEventDTO } from "@/core/events/IEventDTO";
import { useEffect, useState } from "react";
import ListAdmin from "../Components/Blog/admin/list/generic/ListAdmin";
import styles from "../Views/scss/Views.module.scss";

const AdminEventView = ({ userId }: { userId: number }) => {
    const [fetchedEvents, setFetchedEvents] = useState<IEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventService = new EventService();
                const events = await eventService.fetchEvents();
                setFetchedEvents(events ?? []);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, []);

    const handleSelect = (item: IEvent) => setSelectedEvent(item);

    const handleUpdate = async (event: IEvent) => {
        if (!event) {
            console.error("Event is null or undefined");
            return;
        }
        try {
            const eventService = new EventService();
            const eventDTO = event as unknown as IEventDTO;
            await eventService.updateEvent(event.id, eventDTO);
            setFetchedEvents(prev => prev.map(e => (e.id === event.id ? { ...e, ...event } : e)));
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleCreate = async (newEvent: IEvent) => {
        if (!newEvent) {
            console.error("New event is null or undefined");
            return;
        }
        try {
            const eventService = new EventService();
            const eventDTO = event as unknown as IEventDTO;
            await eventService.createEvent(eventDTO);
            const updatedEvents = await eventService.fetchEvents();
            setFetchedEvents(updatedEvents ?? []);
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    const handleArchive = async (eventId: number): Promise<boolean> => {
        if (eventId == null) {
            console.error("Event ID is null or undefined");
            return false;
        }
        try {
            const eventService = new EventService();
            await eventService.archiveEvent(eventId, true);
            setFetchedEvents(prev => prev.map(event => event.id === eventId ? { ...event, isArchived: true } : event));
            return true;
        } catch (error) {
            console.error("Error archiving event:", error);
            return false;
        }
    };

    const handleUnArchive = async (eventId: number): Promise<boolean> => {
        if (eventId == null) {
            console.error("Event ID is null or undefined");
            return false;
        }
        try {
            const eventService = new EventService();
            await eventService.unarchiveEvent(eventId, false);
            setFetchedEvents(prev => prev.map(event => event.id === eventId ? { ...event, isArchived: false } : event));
            return true;
        } catch (error) {
            console.error("Error unarchiving event:", error);
            return false;
        }
    };

    const handleDelete = async (eventId: number): Promise<void> => {
        if (eventId == null) {
            console.error("Event ID is null or undefined");
            return;
        }
        try {
            const eventService = new EventService();
            await eventService.deleteEvent(eventId);
            setFetchedEvents(prev => prev.filter(event => event.id !== eventId));
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    return (
        <div>
            <h1 className={styles.centeredTitle}>Listado de Eventod del Administrador</h1>
            <ListAdmin
                items={fetchedEvents}
                type="event"
                onSelect={handleSelect}
                onDelete={handleDelete}
                onEdit={handleUpdate}
                onArchive={handleArchive}
                onUnArchive={handleUnArchive}
                onSubmit={handleUpdate}
                onCreate={handleCreate}
                userId={userId}
            />
        </div>
    );
};

export default AdminEventView;