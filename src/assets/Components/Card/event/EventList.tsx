import React, { useState } from "react";
import { IEvent } from "../../../../core/events/IEvent";
import { useEvents } from "../../../../hooks/useEvents";
import Pagination from "../../Pagination";
import CardItem from "../card/CardItem";
import styles from "../card/CardItem.module.scss";
import CardItemSkeleton from "../card/CardItemSkeleton"; // Importa el esqueleto

interface EventListProps {
    userId: number | null; // Esta prop no se usa en el componente actual
    events: IEvent[]; // Esta prop no se usa en el componente actual, los eventos se cargan internamente
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
