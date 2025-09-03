import type { ITextItem } from '@/core/texts/ITextItem';
import React from 'react';
import ItemGeneric from '../generic/ItemGeneric';

interface ItemTextProps {
    text: ITextItem;
    onEdit: (text: ITextItem) => void;
    onDelete: (textId: number) => Promise<void>;
    onSelect: (text: ITextItem) => void;
    onSubmit: (text: ITextItem) => void;
    userId: number;
    onCreate: (newText: Partial<ITextItem>) => Promise<void>;
}

const ItemText: React.FC<ItemTextProps> = ({
    text, onEdit, onDelete, onSelect, onSubmit, userId, onCreate
}) => {
    if (!text) return null;

    // Unificar imágenes: puede venir como image o images
    let textImages: string[] = [];
    if (Array.isArray((text as any).image)) {
        textImages = (text as any).image;
    } else if (typeof (text as any).image === 'string' && (text as any).image) {
        textImages = [(text as any).image];
    }

    return (
        <div>
            <ItemGeneric
                item={text}
                id={text.id}
                title={text.title}
                message={text.description}
                creationDate={text.createdAt}
                type="text"
                images={textImages}
                category={text.category}
                onSelect={onSelect}
                onSubmit={onSubmit}
                userId={userId}
                onCreate={onCreate}
            />
        </div>
    );
};

export default ItemText;
