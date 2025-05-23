import EventService from "@/core/events/EventService";
import { IEvent } from "@/core/events/IEvent";
import { IEventDTO } from "@/core/events/IEventDTO";
import { useEffect, useState } from "react";
import ListAdmin from "../Components/Blog/admin/list/generic/ListAdmin";


const AdminEventView = ({ userId }: { userId: number }) => {
    const [fetchedEvents, setFetchedEvents] = useState<IEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventService = new EventService();
                const events = await eventService.fetchEvents();
                if (events) {
                    setFetchedEvents(events);
                } else {
                    console.warn("Fetched events are null or undefined");
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, []);

    const handleSelectEvent = (item: IEvent) => {
        setSelectedEvent(item);
    };

    const handleDeleteEvent = async (eventId: number) => {
        try {
            const eventToDelete = fetchedEvents.find((event: IEvent) => event.id === eventId);
            if (eventToDelete) {
                const eventService = new EventService();
                await eventService.deleteEvent(eventToDelete.id);
                const filteredEvents = fetchedEvents.filter((event) => event.id !== eventId);
                setFetchedEvents(filteredEvents);
            } else {
                console.warn(`Event with id ${eventId} not found`);
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handleUpdateEvent = async (event: IEvent) => {
        try {
            const eventService = new EventService();
            // Map IEvent to IEventDTO explicitly
            const eventDTO: IEventDTO = {
                title: event.title,
                location: event.location,
                alt_avatar: typeof event.alt_avatar === "string" ? event.alt_avatar : "",
                source_avatar: typeof event.source_avatar === "string" ? event.source_avatar : "",
                description: typeof event.description === "string" ? event.description : (event.description ? String(event.description) : ""),
                id: 0,
                message: "",
                userId: 0,
                loves: 0,
                isArchived: false,
                tags: [],
                images: [],
                isPublished: false,
                alt_image: "",
                source_image: "",
                url_avatar: "",
                createdAt: "",
                updatedAt: "",
                date: "",
                link: ""
            };
            const updatedEvent = await eventService.updateEvent(event.id, eventDTO);
            const updatedEvents = fetchedEvents.map((e) => (e.id === updatedEvent.id ? updatedEvent : e));
            setFetchedEvents(updatedEvents);
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleArchiveEvent = async (eventId: number): Promise<boolean> => {
        try {
            const eventService = new EventService();
            const eventToArchive = fetchedEvents.find((event) => event.id === eventId);
            if (eventToArchive) {
                await eventService.archiveEvent(eventToArchive.id, true);
                const filteredEvents = fetchedEvents.filter((event) => event.id !== eventId);
                setFetchedEvents(filteredEvents);
                return true;
            } else {
                console.warn(`Event with id ${eventId} not found`);
                return false;
            }
        } catch (error) {
            console.error("Error archiving event:", error);
            return false;
        }
    };

    const handleUnArchiveEvent = async (eventId: number): Promise<boolean> => {
        try {
            const eventService = new EventService();
            const eventToUnArchive = fetchedEvents.find((event) => event.id === eventId);
            if (eventToUnArchive) {
                await eventService.unarchiveEvent(eventToUnArchive.id, false);
                const updatedEvents = fetchedEvents.map((e) => (e.id === eventToUnArchive.id ? { ...e, archived: false } : e));
                setFetchedEvents(updatedEvents);
                return true;
            } else {
                console.warn(`Event with id ${eventId} not found`);
                return false;
            }
        } catch (error) {
            console.error("Error unarchiving event:", error);
            return false;
        }
    };

    const handleCreateEvent = async (newEvent: IEventDTO) => {
        try {
            const eventService = new EventService();
            await eventService.createEvent(newEvent);
            // Vuelve a cargar la lista completa
            const updatedEvents = await eventService.fetchEvents();
            setFetchedEvents(updatedEvents);
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };




    return (
        <div>
            <ListAdmin
                items={fetchedEvents}
                type="event"
                onSelect={handleSelectEvent}
                onDelete={handleDeleteEvent}
                onEdit={handleUpdateEvent}
                onArchive={handleArchiveEvent}
                onUnArchive={handleUnArchiveEvent}
                onSubmit={handleUpdateEvent}
                onCreate={handleCreateEvent}
                userId={userId}
            />
        </div>
    );
};
export default AdminEventView;