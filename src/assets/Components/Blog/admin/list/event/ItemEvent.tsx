import React from 'react';
import { IEvent } from '../../../../../../core/events/IEvent';
import ItemGeneric from '../generic/ItemGeneric';

interface ItemEventProps {
    event: IEvent;
    onEdit: (event: IEvent) => void;
    onDelete: (eventId: number) => Promise<void>;
    onArchive: (eventId: number) => Promise<boolean>;
    onUnArchive: (eventId: number) => Promise<boolean>;
    onSelect: (event: IEvent) => void;
    onSubmit: (event: IEvent) => void;
    userId: number;
    onCreate: (newEvent: IEvent) => Promise<void>;
}

const ItemEvent: React.FC<ItemEventProps> = (props) => {
    const { event, ...rest } = props;
    return (
        <ItemGeneric
            item={event}
            id={event.id}
            title={event.title}
            message={event.message}
            creationDate={event.creationDate}
            isArchived={event.isArchived}
            images={event.images}
            type="event"
            {...rest}
        />
    );
};

export default ItemEvent;