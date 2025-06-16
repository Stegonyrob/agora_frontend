import React, { useEffect, useState } from "react";
import EventService from "../../../../core/events/EventService";
import { IEvent } from "../../../../core/events/IEvent";
import CardItem from "../card/CardItem";
import styles from "../card/CardItem.module.scss";

interface EventListProps {
    userId: number | null;
    events: IEvent[];
    onSelect: (event: IEvent) => void;


}

const EventList: React.FC<EventListProps> = ({ onSelect }) => {
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

    if (isLoading) {
        return <p>Loading events...</p>;
    }
    const handleSelect = (item: any) => {
        console.log("Selected event:", item);
    };

    return (
        <div className={styles.cardContainer}>
            {events.map((event) => (
                <div key={event.id}>
                    <CardItem
                        key={event.id}
                        type="event"
                        id={event.id}
                        title={event.title}
                        description={event.message}
                        creationDate={event.creationDate}
                        favoritesCount={event.favoritesCount}
                        images={event.images}

                        user={event.user}
                        onSelect={handleSelect}
                        location={event.location}
                        maxCapacity={typeof event.capacity === "number" ? event.capacity : (typeof event.capacity === "string" ? Number(event.capacity) || undefined : undefined)}
                        attendeesCount={typeof event.attendeesCount === "number" ? event.attendeesCount : 0}
                    />
                </div>
            ))}
        </div>

    );
};

export default EventList;
