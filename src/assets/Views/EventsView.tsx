import EventService from "@/core/events/EventService";
import { IEvent } from "@/core/events/IEvent";
import React, { useEffect, useState } from "react";
import CardEvent from "../Components/Events/CardEvents";

const EventView: React.FC = () => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventService = new EventService();
                const fetchedEvents = await eventService.fetchEvents();
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleSelectEvent = (event: IEvent) => {
        console.log("Selected event:", event);
    };

    if (isLoading) {
        return <p>Loading events...</p>;
    }

    return (
        <div>
            <h1>Eventos Públicos</h1>
            <CardEvent events={events} onSelect={handleSelectEvent} />
        </div>
    );
};

export default EventView;