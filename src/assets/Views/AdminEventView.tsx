import EventService from "@/core/events/EventService";
import { IEvent } from "@/core/events/IEvent";
import { IEventUpdateDTO } from "@/core/events/IEventBackendDTO";
import { ITag } from "@/core/tags/ITag";
import { fetchTagsByEvent, updateEventTags } from "@/core/tags/tagStore";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ListAdmin from "../Components/Blog/admin/list/generic/ListAdmin";
import styles from "../Views/scss/Views.module.scss";

const AdminEventView = ({ userId }: { userId: number }) => {
    const [fetchedEvents, setFetchedEvents] = useState<IEvent[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventService = new EventService();
                const events = await eventService.fetchEvents();
                setFetchedEvents(events ?? []);
                for (const event of events ?? []) {
                    if (event.id) {
                        dispatch(fetchTagsByEvent(event.id) as any);
                    }
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, [dispatch]);

    const handleSelect = (_item: IEvent) => { };

    const handleUpdate = async (event: IEvent) => {
        if (!event) {
            console.error("Event is null or undefined");
            return;
        }
        try {
            const eventService = new EventService();

            // 1. Actualizar los datos básicos del evento (sin tags)
            const eventDTO: IEventUpdateDTO = {
                title: event.title,
                message: event.message,
                location: (event as any).location || undefined,
                link: (event as any).link || undefined,
                capacity: event.capacity,
                eventDate: (event as any).eventDate || undefined,
                eventTime: (event as any).eventTime || undefined,
                archived: event.isArchived,
            };
            await eventService.updateEvent(event.id, eventDTO);

            // 2. Actualizar tags por separado si las hay
            if (event.tags && Array.isArray(event.tags) && event.tags.length > 0) {

                // Convertir tags a formato ITag si son strings
                const tagsAsITag: ITag[] = event.tags.map((tag: any) => {
                    if (typeof tag === 'string') {
                        // Si es string, necesitamos obtener/crear la tag
                        return { id: 0, name: tag, archived: false };
                    } else if (tag && typeof tag === 'object' && tag.name) {
                        // Si es objeto con name
                        return {
                            id: tag.id || 0,
                            name: tag.name,
                            archived: tag.archived || false
                        };
                    }
                    return { id: 0, name: String(tag), archived: false };
                });

                // Usar Redux action para actualizar tags
                await (dispatch as any)(updateEventTags({
                    eventId: event.id,
                    tags: tagsAsITag
                }));

            } else {
                // Si no hay tags, limpiar las existentes
                await (dispatch as any)(updateEventTags({
                    eventId: event.id,
                    tags: []
                }));
            }

            // 3. Actualizar estado local
            setFetchedEvents(prev => prev.map(e => (e.id === event.id ? { ...e, ...event } : e)));

        } catch (error) {
            console.error("❌ Error updating event:", error);
            throw error; // Re-lanzar el error para que se maneje en la UI
        }
    };

    const handleCreate = async (newEvent: IEvent) => {
        if (!newEvent) {
            console.error("New event is null or undefined");
            return;
        }
        try {
            // Normalizar eventDate y tags si es necesario
            let normalizedEvent = { ...newEvent };
            // Normalizar eventDate a string ISO si es Date
            if (normalizedEvent.eventDate && typeof normalizedEvent.eventDate !== 'string') {
                try {
                    normalizedEvent.eventDate = new Date(normalizedEvent.eventDate).toISOString();
                } catch { }
            }
            // Normalizar tags a array de strings
            if (Array.isArray(normalizedEvent.tags)) {
                normalizedEvent.tags = normalizedEvent.tags.map((tag: any) =>
                    typeof tag === 'object' && tag !== null && tag.name ? tag.name : tag
                );
            }

            // El evento ya fue creado en EventForm, solo actualizar la lista
            const eventService = new EventService();
            const updatedEvents = await eventService.fetchEvents();
            // Si el backend sigue sin normalizar, forzar normalización en todos
            const normalizedEvents = (updatedEvents ?? []).map(ev => {
                let eventDate = ev.eventDate;
                if (eventDate && typeof eventDate !== 'string') {
                    try {
                        eventDate = new Date(eventDate).toISOString();
                    } catch { }
                }
                let tags = Array.isArray(ev.tags)
                    ? ev.tags.map((tag: any) => typeof tag === 'object' && tag !== null && tag.name ? tag.name : tag)
                    : [];
                return { ...ev, eventDate, tags };
            });
            setFetchedEvents(normalizedEvents);

            if (newEvent?.id) {
                dispatch(fetchTagsByEvent(newEvent.id) as any);
            }

        } catch (error) {
            console.error("Error updating events list:", error);
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