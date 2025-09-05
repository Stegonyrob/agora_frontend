import type { ITextItem } from '@/core/texts/ITextItem';
import React from 'react';
import ItemGeneric from '../generic/ItemGeneric';

interface ItemTextProps {
    id: number;
    title: string;
    text: ITextItem;
    onEdit: (text: ITextItem) => void;
    onDelete: (textId: number) => Promise<void>;

    onSelect: (text: ITextItem) => void;
    onSubmit: (text: ITextItem) => void;
    userId: number;
    onCreate: (newText: ITextItem) => Promise<void>;
}

const ItemText: React.FC<ItemTextProps> = ({
    text,
    onEdit,
    onDelete,
    onCreate,
    onSelect,
    onSubmit,
    userId,

}) => {
    if (!text) return null;

    // Si el objeto viene anidado bajo 'item', usar ese objeto
    const data = (text && (text as any).item) ? (text as any).item : text;

    return (
        <ItemGeneric
            item={data}
            id={data.id}
            title={data.title}
            message={data.message}
            type="text"
            images={data.images}
            onSelect={onSelect}
            onSubmit={onSubmit}
            userId={userId}
            onCreate={onCreate}
        />
    );
};



export default ItemText;
