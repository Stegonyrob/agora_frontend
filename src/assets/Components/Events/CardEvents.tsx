import EventService from "@/core/events/EventService"; // Importa el servicio para eventos
import { IEvent } from "@/core/events/IEvent"; // Importa la interfaz de eventos
import React, { useEffect, useState } from "react";
import CardPosts from "../Blog/admin/CardPosts"; // Importa el componente reutilizable

// Define las propiedades para CardEvent
interface CardEventProps {
  onSelect: (event: IEvent) => void; // Función para manejar la selección de un evento
}

// Componente CardEvent que utiliza CardPosts configurado para eventos
const CardEvent: React.FC<CardEventProps> = ({ onSelect }) => {
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

  return (
    <CardPosts
      posts={events.map(event => ({
        ...event,
        comments: [], // Add default or mapped values for missing properties
        alt_avatar: "", // Add default or mapped values for missing properties
        source_avatar: "" // Add default or mapped values for missing properties
      }))} // Pasamos los eventos como posts
      onSelect={onSelect} // Pasamos la función de selección
      id={0} // ID inicial (puedes ajustarlo según sea necesario)
      isEvent={true} // Indicamos que es para eventos
      userId={0} // Usuario genérico (puedes ajustarlo según sea necesario)
      session={[]} // Sesión vacía (puedes ajustarlo según sea necesario)
    />
  );
};

export default CardEvent;