import React, { useEffect, useState } from "react";
import EventService from "../../../../core/events/EventService";
import { IEvent } from "../../../../core/events/IEvent";
import Pagination from "../../Pagination";
import CardItem from "../card/CardItem";
import styles from "../card/CardItem.module.scss";

interface EventListProps {
    userId: number | null;
    events: IEvent[];
    onSelect: (event: IEvent) => void;
}

interface Page<T> {
    content: T[];
    totalPages: number;
    number: number;
    size: number;
    totalElements: number;
}

const EventList: React.FC<EventListProps> = ({ onSelect }) => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const eventService = new EventService();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                const pageData: Page<IEvent> = await eventService.fetchEventsPaginated(page, 6); // 6 eventos por página
                setEvents(pageData.content);
                setTotalPages(pageData.totalPages);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [page]);

    if (isLoading) {
        return <p>Loading events...</p>;
    }

    const handleSelect = (item: any) => {
        console.log("Selected event:", item);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div>
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
                            eventDate={event.eventDate}
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

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default EventList;
