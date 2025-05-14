import { IPostDTO } from "@/core/posts/IPostDTO";
import React, { useState } from "react";
import { IEvent } from "../../../core/events/IEvent";
import { IEventDTO } from "../../../core/events/IEventDTO";
import ButtonArchiveEvent from "../Blog/admin/button/archive/ButtonArchiveEvent";
import ButtonEditEvent from "../Blog/admin/button/edit/ButtonEditEvent";
import styles from "./EventItem.module.scss";
import ImageEvent from "./ImageEvent";

interface EventCardProps {
    event: IEvent;
    onEdit: (event: IEvent) => void;
    onDelete: (eventId: number) => Promise<void>;
    onArchive: (eventId: number) => Promise<boolean>;
    onUnArchive: (eventId: number) => Promise<boolean>;
    onSelect: (event: IEvent) => void;
    userId: number;
}

const EventCard: React.FC<EventCardProps> = ({
    event,
    onEdit,
    onDelete,
    onArchive,
    onUnArchive,
    onSelect,
    userId,
}) => {
    const [showFullText, setShowFullText] = useState(false);
    const descriptionPreview = typeof event?.description === "string" ? event.description.slice(0, 200) : "";
    const isArchived = event?.isArchived ?? false;

    const toggleText = () => {
        if (event) {
            setShowFullText((prev) => !prev);
        }
    };

    if (!event) {
        return null;
    }

    return (
        <div className={styles.card}>
            <h5>Event ID: {event?.id ?? "No hay ID"}</h5>
            <p>
                {event?.creationDate && Array.isArray(event.creationDate)
                    ? new Date(
                        event.creationDate[0], // Año
                        event.creationDate[1] - 1, // Mes (0-indexado en JavaScript)
                        event.creationDate[2], // Día
                        event.creationDate[3] || 0, // Hora
                        event.creationDate[4] || 0, // Minuto
                        event.creationDate[5] || 0, // Segundo
                        event.creationDate[6] || 0 // Milisegundo
                    ).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })
                    : "--/--/--"}
            </p>
            <ImageEvent event={event} source={String(event.image || "")} alt={String(event.title || "")} />
            <h5>{event?.title ?? "No hay título"}</h5>
            <p className={styles.description}>
                {showFullText ? event?.description : descriptionPreview}
                {typeof event?.description === "string" && event.description.length > 200 && !showFullText && "..."}
                <button onClick={toggleText} className={styles.toggleButton}>
                    <i className={`bi ${showFullText ? "bi-dash" : "bi-plus"}`}></i>
                </button>
            </p>

            <ButtonEditEvent
                eventId={event?.id ?? 0}
                onSubmit={(postDTO: IPostDTO) => {
                    const eventDTO: IEventDTO = {
                        ...postDTO,
                        description: postDTO.description || "",
                        createdAt: postDTO.createdAt || new Date().toISOString(),
                        updatedAt: postDTO.updatedAt || new Date().toISOString(),
                    };
                    onEdit(eventDTO as unknown as IEvent);
                }}
                userId={event?.userId ?? 0}
                label="Edit"

            />
            <ButtonArchiveEvent
                event={event}
                onArchive={async (eventId: number) => {
                    const result = await onArchive(eventId);
                    if (result) {
                        event.isArchived = true; // Actualiza el estado local
                    }
                    return result; // Devuelve el resultado booleano
                }}
                userId={event?.userId ?? 0}
                eventId={event?.id ?? 0}
                label={isArchived ? "Unarchive" : "Archive"}
            />
        </div>
    );
};

export default EventCard;