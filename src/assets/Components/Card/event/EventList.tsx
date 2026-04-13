import React, { useState } from "react";
import { IEvent } from "../../../../core/events/IEvent";
import { useEvents } from "../../../../hooks/useEvents";
import Pagination from "../../Pagination";
import CardItem from "../card/CardItem";
import styles from "../card/CardItem.module.scss";
import CardItemSkeleton from "../card/CardItemSkeleton"; // Importa el esqueleto

const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

interface EventListProps {
    onSelect: (event: IEvent) => void;
}

const EventList: React.FC<EventListProps> = ({ onSelect }) => {
    const [page, setPage] = useState(0);
    const EVENTS_PER_PAGE = 6; // Define cuántos esqueletos mostrar

    // Usar el nuevo hook useEvents que maneja automáticamente público vs privado
    const { events, isLoading, error, totalPages, refetch } = useEvents({
        page,
        size: EVENTS_PER_PAGE,
        autoFetch: true,
    });

    const handleSelect = (item: any) => {
        console.log("Selected event:", item);
        onSelect(item); // Llama a la prop onSelect
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    // Mostrar error si existe
    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p>Error cargando eventos: {error}</p>
                <button onClick={refetch} className={styles.retryButton}>
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.cardContainer}>
                {isLoading ? (
                    // Muestra 6 esqueletos de tipo 'event' mientras carga
                    Array.from({ length: EVENTS_PER_PAGE }).map(() => (
                        <CardItemSkeleton key={`skeleton-${generateUniqueId()}`} type="event" />
                    ))
                ) : (
                    // Muestra solo los eventos no archivados
                    events
                        .filter(event => !event.archived && !event.isArchived)
                        .map((event) => {
                            let maxCapacity: number | undefined;
                            
                            if (typeof event.capacity === "number") {
                                maxCapacity = event.capacity;
                            } else if (typeof event.capacity === "string") {
                                maxCapacity = Number(event.capacity) || undefined;
                            } else {
                                maxCapacity = undefined;
                            }

                            return (
                                <CardItem
                                    key={event.id}
                                    type="event"
                                    id={event.id}
                                    title={event.title}
                                    description={event.message}
                                    creationDate={event.creationDate}
                                    eventDate={event.eventDate}
                                    lovesCount={event.favoritesCount}
                                    images={event.images}
                                    tags={Array.isArray(event.tags) ? event.tags.map((tag, idx) => typeof tag === "string" ? { id: idx, name: tag } : tag) : []}
                                    user={event.user}
                                    onSelect={handleSelect}
                                    location={event.location}
                                    maxCapacity={maxCapacity}
                                    attendeesCount={typeof event.attendeesCount === "number" ? event.attendeesCount : 0}
                                    eventTime={event.eventTime} // Asegúrate de pasar eventTime aquí
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
