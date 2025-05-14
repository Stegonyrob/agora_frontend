import { useEffect, useState } from "react";
import EventService from "../../../core/events/EventService";
import { IEvent } from "../../../core/events/IEvent";
import CardEvents from "./CardEvents";

interface EventListProps {
    onSelect: (event: IEvent) => void;
}

const EventList: React.FC<EventListProps> = ({ onSelect }) => {
    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
    const [fetchedEvents, setFetchedEvents] = useState<IEvent[]>([]);

    const apiEvent = new EventService();

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const fetchedEvents = await apiEvent.fetchEvents();
                setFetchedEvents(fetchedEvents);
            } catch (error) {
                console.error("Error loading events: ", error);
            }
        };
        loadEvents();
    }, []);

    const handleSelect = (event: IEvent) => {
        setSelectedEvent(event);
        onSelect(event); // Llama a la función pasada como prop
    };

    const handleClose = () => {
        setSelectedEvent(null);
    };

    return (
        <div>
            <div>
                <CardEvents
                    events={fetchedEvents}
                    onSelect={handleSelect}
                />
            </div>
        </div>
    );
};

export default EventList;