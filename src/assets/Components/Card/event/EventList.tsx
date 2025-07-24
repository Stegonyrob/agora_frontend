import React, { useEffect, useState } from "react";
import EventService from "../../../../core/events/EventService";
import { IEvent } from "../../../../core/events/IEvent";
import Pagination from "../../Pagination";
import CardItem from "../card/CardItem";
import styles from "../card/CardItem.module.scss";
import CardItemSkeleton from "../card/CardItemSkeleton"; // Importa el esqueleto

interface EventListProps {
    userId: number | null; // Esta prop no se usa en el componente actual
    events: IEvent[]; // Esta prop no se usa en el componente actual, los eventos se cargan internamente
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
    const EVENTS_PER_PAGE = 6; // Define cuántos esqueletos mostrar

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                const pageData: Page<IEvent> = await eventService.fetchEventsPaginated(page, EVENTS_PER_PAGE);
                console.log('[EventList] Eventos recibidos:', pageData.content);
                setEvents(pageData.content);
                setTotalPages(pageData.totalPages);
            } catch (error) {
                console.error("Error fetching events:", error);
                // Opcional: Manejar el estado de error para mostrar un mensaje al usuario
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [page]);

    const handleSelect = (item: any) => {
        console.log("Selected event:", item);
        onSelect(item); // Llama a la prop onSelect
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div>
            <div className={styles.cardContainer}>
                {isLoading ? (
                    // Muestra 6 esqueletos de tipo 'event' mientras carga
                    Array.from({ length: EVENTS_PER_PAGE }).map((_, index) => (
                        <CardItemSkeleton key={index} type="event" />
                    ))
                ) : (
                    // Muestra los eventos reales cuando cargan
                    events.map((event) => {
                        console.log('[EventList] Renderizando CardItem con event.images:', event.images);
                        return (
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
                                tags={Array.isArray(event.tags) ? event.tags.map((tag, idx) => typeof tag === "string" ? { id: idx, name: tag } : tag) : []}
                                user={event.user}
                                onSelect={handleSelect}
                                location={event.location}
                                maxCapacity={typeof event.capacity === "number" ? event.capacity : (typeof event.capacity === "string" ? Number(event.capacity) || undefined : undefined)}
                                attendeesCount={typeof event.attendeesCount === "number" ? event.attendeesCount : 0}
                            />
                        );
                    })
                )}
            </div>

            {/* La paginación solo se muestra si no está cargando y hay contenido */}
            {!isLoading && totalPages > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default EventList;
