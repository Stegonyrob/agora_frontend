import React, { useEffect, useState } from "react";
import EventsService from "../../../../core/events/EventService"; // Servicio para obtener eventos
import { IEvent } from "../../../../core/events/IEvent"; // Asumiendo que tienes una interfaz para eventos
import CardItem from "../card/CardItem";

interface EventListProps {
    userId: number | null;
    events: IEvent[];

}

const EventList: React.FC<EventListProps> = ({ events }) => {
    const [fetchedEvents, setFetchedEvents] = useState<IEvent[]>([]);

    const apiEvent = new EventsService();

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

    const handleSelect = (item: any) => {
        console.log("Selected event:", item);
    };

    return (
        <div>
            {fetchedEvents.map((event) => (
                <CardItem
                    key={event.id}
                    type="event"
                    id={event.id}
                    title={event.title}
                    description={event.message}
                    creationDate={event.creationDate}
                    favoritesCount={event.favoritesCount}
                    images={event.images}
                    attendentsCount={event.attendentsCount}
                    user={event.user}
                    onSelect={handleSelect}
                    location={event.location}
                />
            ))}
        </div>
    );
};

export default EventList;
