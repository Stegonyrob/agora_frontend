import React, { useEffect, useState } from "react";
import EventService from "../../../../core/events/EventService";
import { IEvent } from "../../../../core/events/IEvent"; // Asumiendo que tienes una interfaz para eventos
import CardItem from "../card/CardItem";
import styles from "../card/CardItem.module.scss"; // Asegúrate de tener el archivo de estilos correcto

interface EventListProps {
    userId: number | null;
    events: IEvent[];
    onSelect: (event: IEvent) => void;


}

const EventList: React.FC<EventListProps> = ({ onSelect }) => {
    const [events, setEvents] = useState<IEvent[]>([]); // Estado para almacenar los eventos
    const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventService = new EventService();
                const fetchedEvents = await eventService.fetchEvents(); // Llama al servicio para obtener los eventos
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
        return <p>Loading events...</p>; // Muestra un mensaje de carga mientras se obtienen los eventos
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
                        attendentsCount={event.attendentsCount}
                        user={event.user}
                        onSelect={handleSelect}
                        location={event.location}
                    />
                </div>
            ))}
        </div>

    );
};

export default EventList;
