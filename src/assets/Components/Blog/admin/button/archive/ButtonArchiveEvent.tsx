import React, { useState } from "react";
import EventService from "../../../../../../core/events/EventService";
import { IEvent } from "../../../../../../core/events/IEvent";
import styles from "../ButtonIcons.module.scss";

interface ButtonArchiveEventProps {
    eventId: number;
    userId: number | null;
    event?: IEvent;
    onArchive: (eventId: number) => Promise<boolean>;
    label: string;
}

const ButtonArchiveEvent: React.FC<ButtonArchiveEventProps> = ({ event, onArchive }) => {
    const apiEvent = new EventService();
    const [archived, setArchived] = useState(event?.isArchived ?? false);
    const [color, setColor] = useState(archived ? "red" : "green");
    const [iconDirection, setIconDirection] = useState(archived ? "up" : "down");
    const [label, setLabel] = useState(archived ? "Archivado" : "Publicado");

    const handleArchive = async () => {
        console.log("ButtonArchiveEvent: handleArchive called");
        if (!event) {
            console.error("ButtonArchiveEvent: event is null or undefined");
            return;
        }

        try {
            const eventId = event.id;
            const result = await apiEvent.archiveEvent(eventId, !archived);
            if (result) {
                console.log(`Evento con ID ${eventId} ${archived ? "desarchivado" : "archivado"} correctamente`);
                setArchived(!archived);
                setColor(!archived ? "red" : "green");
                setIconDirection(!archived ? "up" : "down");
                setLabel(!archived ? "Archivado" : "Publicado");
            } else {
                console.error(`Error ${archived ? "desarchivando" : "archivando"} evento con ID ${eventId}`);
            }
        } catch (error) {
            console.error(`Error ${archived ? "desarchivando" : "archivando"} evento: ${error}`);
        }
    };

    return (
        <div className={styles.socialIcons}>
            <span className={styles.socialIcons}>
                <i
                    className={`bi bi-file-earmark-arrow-${iconDirection}`}
                    onClick={handleArchive}
                    style={{ cursor: "pointer", color }}
                />
                <span style={{ marginLeft: "3rem" }}>{label}</span>
            </span>
        </div>
    );
};

export default ButtonArchiveEvent;