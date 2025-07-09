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
    // 🗓️ Formatear fecha del evento para mostrar
    const formatEventDate = (eventDate: string) => {
        if (!eventDate) return null;

        try {
            const date = new Date(eventDate);
            if (isNaN(date.getTime())) {
                console.warn('📅 ItemEvent - Fecha inválida:', eventDate);
                return null;
            }

            // Convertir a array para ItemGeneric
            return [
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            ];
        } catch (error) {
            console.error('📅 ItemEvent - Error parseando fecha:', error);
            return null;
        }
    };

    const formattedEventDate = formatEventDate(event.eventDate);

    return (
        <ItemGeneric
            item={event}
            id={event.id}
            title={event.title}
            message={event.message}
            creationDate={formattedEventDate}
            isArchived={event.isArchived}
            type="event"
            images={event.images}
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