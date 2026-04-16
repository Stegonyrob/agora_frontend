import React, { useState } from "react";
import styles from '../ButtonIcons.module.scss';

type ArchiveType = "post" | "event" | "text";

interface ButtonArchiveGenericProps {
    type: ArchiveType;
    id: number;
    isArchived: boolean;
    onArchive: (id: number, type: ArchiveType, archive: boolean) => Promise<void>;
    label?: string;
}

const ButtonArchiveGeneric: React.FC<ButtonArchiveGenericProps> = ({ type, id, isArchived, onArchive, label }) => {
    const [archived, setArchived] = useState(isArchived);
    const [color, setColor] = useState(archived ? "red" : "green");
    const [iconDirection, setIconDirection] = useState(archived ? "up" : "down");
    const [statusLabel, setStatusLabel] = useState(label || (archived ? "Archivado" : "Publicado"));

    const handleArchive = async () => {
        try {
            await onArchive(id, type, !archived);
            setArchived(!archived);
            setColor(!archived ? "red" : "green");
            setIconDirection(!archived ? "up" : "down");
            setStatusLabel(!archived ? "Archivado" : "Publicado");
        } catch (error) {
            // Opcional: revertir cambios visuales si falla
        }
    };

    return (
        <div
            className={`${styles.buttonArchiveBlock} ${archived ? styles.archived : styles.published}`}
            onClick={handleArchive}
        >
            <i className={`bi bi-file-earmark-arrow-${iconDirection}`} />
            <span className={styles.label}>{statusLabel}</span>
        </div>
    );
};

export default ButtonArchiveGeneric;