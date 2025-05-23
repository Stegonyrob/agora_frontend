import React, { useState } from "react";
import EventService from "../../../../../../core/events/EventService";
import { IEvent } from "../../../../../../core/events/IEvent";
import { IPost } from "../../../../../../core/posts/IPost";
import PostService from "../../../../../../core/posts/PostService";
import styles from '../ButtonIcons.module.scss';

type ArchiveType = "post" | "event";
type ArchiveItem = IPost | IEvent;

interface ButtonArchiveGenericProps {
    type: ArchiveType;
    item: ArchiveItem;
    onArchive: (id: number) => Promise<boolean>;
    label?: string;
}

const ButtonArchiveGeneric: React.FC<ButtonArchiveGenericProps> = ({ type, item, onArchive, label }) => {
    const [archived, setArchived] = useState(item?.isArchived ?? false);
    const [color, setColor] = useState(archived ? "red" : "green");
    const [iconDirection, setIconDirection] = useState(archived ? "up" : "down");
    const [statusLabel, setStatusLabel] = useState(label || (archived ? "Archivado" : "Publicado"));

    // Instancia el servicio adecuado
    const api = type === "post" ? new PostService() : new EventService();

    const handleArchive = async () => {
        if (!item) return;
        const id = item.id;
        try {
            let result = false;
            if (type === "post") {
                const api = new PostService();
                result = await api.archivePost(id, !archived);
            } else (type === "event"); {
                const api = new EventService();
                result = await api.archiveEvent(id, !archived);
            }
            if (result) {
                setArchived(!archived);
                setColor(!archived ? "red" : "green");
                setIconDirection(!archived ? "up" : "down");
                setStatusLabel(!archived ? "Archivado" : "Publicado");
                if (onArchive) await onArchive(id);
            }
        } catch (error) {
            setColor(!archived ? "green" : "red");
            setIconDirection(!archived ? "down" : "up");
            setStatusLabel(!archived ? "Publicado" : "Archivado");
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
                <span style={{ marginLeft: "3rem" }}>{statusLabel}</span>
            </span>
        </div>
    );
};

export default ButtonArchiveGeneric;