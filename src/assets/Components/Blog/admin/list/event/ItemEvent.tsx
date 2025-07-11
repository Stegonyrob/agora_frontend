import { IEvent } from "@/core/events/IEvent";
import React from "react";
import ItemGeneric from "../generic/ItemGeneric";

interface ItemEventProps {
    id: number;
    title: string;
    event: IEvent;
    onEdit: (event: IEvent) => void;
    onDelete: (eventId: number) => Promise<void>;
    onArchive: (eventId: number) => Promise<boolean>;
    onUnArchive: (eventId: number) => Promise<boolean>;
    onSelect: (event: IEvent) => void;
    onSubmit: (event: IEvent) => void;
    userId: number;
    onCreate: (newEvent: any) => Promise<void>;
}

const ItemEvent: React.FC<ItemEventProps> = ({
    event,
    onEdit,
    onDelete,
    onArchive,
    onUnArchive,
    onSelect,
    onSubmit,
    userId,
    onCreate,
}) => {
    // Mostrar fecha como string ISO (ya no array)
    // Si el objeto viene anidado bajo 'item', usar ese objeto
    const data = (event && (event as any).item) ? (event as any).item : event;
    // Debug: mostrar valores reales de fechas
    console.log('[ItemEvent] id:', data.id, 'creationDate:', data.creationDate, 'eventDate:', data.eventDate);
    return (
        <ItemGeneric
            item={data}
            id={data.id}
            title={data.title}
            message={data.message}
            creationDate={data.creationDate || data.eventDate}
            isArchived={data.isArchived ?? data.archived}
            type="event"
            images={data.images}
            onArchive={onArchive}
            onUnArchive={onUnArchive}
            onSelect={onSelect}
            onSubmit={onSubmit}
            userId={userId}
            onCreate={onCreate}
        />
    );
};

export default ItemEvent;