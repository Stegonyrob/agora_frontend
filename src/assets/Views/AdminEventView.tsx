import EventService from "@/core/events/EventService";
import { IEvent } from "@/core/events/IEvent";
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
        try {
            const eventService = new EventService();
            const eventDTO = {
                id: event.id ?? 0,
                userId: typeof event.userId === "number" ? event.userId : userId,
                alt_avatar: event.alt_avatar !== undefined && event.alt_avatar !== null ? String(event.alt_avatar) : "",
                source_avatar: event.source_avatar !== undefined && event.source_avatar !== null ? String(event.source_avatar) : "",
                alt_image: event.alt_image !== undefined && event.alt_image !== null ? String(event.alt_image) : "",
                source_image: event.source_image !== undefined && event.source_image !== null ? String(event.source_image) : "",
                url_avatar: event.url_avatar !== undefined && event.url_avatar !== null ? String(event.url_avatar) : "",
                images: event.images ?? [],
                description: event.description !== undefined && event.description !== null ? String(event.description) : "",
                title: event.title ?? "",
                date: event.date !== undefined && event.date !== null ? String(event.date) : "",
                location: event.location ?? "",
                isArchived: event.isArchived ?? false,
                message: event.message ?? "",
                loves: event.loves ?? 0,
                tags: event.tags ?? [],
                comments: event.comments ?? [],
                createdAt: event.createdAt !== undefined && event.createdAt !== null ? String(event.createdAt) : "",
                updatedAt: event.updatedAt !== undefined && event.updatedAt !== null ? String(event.updatedAt) : "",
                isPublished: event.isPublished ?? false,
                link: event.link !== undefined && event.link !== null ? String(event.link) : "",
            };
            await eventService.updateEvent(event.id, eventDTO);
            setFetchedEvents(prev => prev.map(e => (e.id === event.id ? { ...e, ...event } : e)));
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleCreate = async (newEvent: IEvent) => {
        try {
            const eventService = new EventService();
            const eventDTO = {
                id: newEvent.id ?? 0,
                userId: typeof newEvent.userId === "number" ? newEvent.userId : userId,
                alt_avatar: newEvent.alt_avatar !== undefined && newEvent.alt_avatar !== null ? String(newEvent.alt_avatar) : "",
                source_avatar: newEvent.source_avatar !== undefined && newEvent.source_avatar !== null ? String(newEvent.source_avatar) : "",
                alt_image: newEvent.alt_image !== undefined && newEvent.alt_image !== null ? String(newEvent.alt_image) : "",
                source_image: newEvent.source_image !== undefined && newEvent.source_image !== null ? String(newEvent.source_image) : "",
                url_avatar: newEvent.url_avatar !== undefined && newEvent.url_avatar !== null ? String(newEvent.url_avatar) : "",
                images: newEvent.images ?? [],
                description: newEvent.description !== undefined && newEvent.description !== null ? String(newEvent.description) : "",
                title: newEvent.title ?? "",
                date: newEvent.date !== undefined && newEvent.date !== null ? String(newEvent.date) : "",
                location: newEvent.location ?? "",
                isArchived: newEvent.isArchived ?? false,
                message: newEvent.message ?? "",
                loves: newEvent.loves ?? 0,
                tags: newEvent.tags ?? [],
                comments: newEvent.comments ?? [],
                createdAt: newEvent.createdAt !== undefined && newEvent.createdAt !== null ? String(newEvent.createdAt) : "",
                updatedAt: newEvent.updatedAt !== undefined && newEvent.updatedAt !== null ? String(newEvent.updatedAt) : "",
                isPublished: newEvent.isPublished ?? false,
                link: newEvent.link !== undefined && newEvent.link !== null ? String(newEvent.link) : "", // <-- Ensure link is always a string
            };
            await eventService.createEvent(eventDTO);
            const updatedEvents = await eventService.fetchEvents();
            setFetchedEvents(updatedEvents ?? []);
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    const handleArchive = async (eventId: number): Promise<boolean> => {
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
        try {
            const eventService = new EventService();
            await eventService.archiveEvent(eventId, false);
            setFetchedEvents(prev => prev.map(event => event.id === eventId ? { ...event, isArchived: false } : event));
            return true;
        } catch (error) {
            console.error("Error unarchiving event:", error);
            return false;
        }
    };

    const handleDelete = async (eventId: number): Promise<void> => {
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
            <h1 className={styles.centeredTitle}>Admin Event View</h1>
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