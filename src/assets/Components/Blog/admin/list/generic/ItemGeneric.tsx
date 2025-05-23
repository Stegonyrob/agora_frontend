import DOMPurify from 'dompurify';
import { useState } from 'react';
import ButtonArchiveGeneric from '../../button/archive/ButtonArchiveGeneric';
import ButtonEditGeneric from '../../button/edit/ButtonEditGeneric';
import styles from './ItemGeneric.module.scss';

import type { IEvent } from '../../../../../../core/events/IEvent';
import type { IPost } from '../../../../../../core/posts/IPost';
interface ItemGenericProps<T> {
    item: T;
    id: number;
    title: string;
    message: string;
    creationDate?: any;
    isArchived?: boolean;

    onSelect: (item: T) => void;
    onSubmit: (item: T) => void;
    userId: number;
    onCreate: (newItem: any) => Promise<void>;
    type: 'post' | 'event';
    images?: any[];
}


const ItemGeneric = <T extends IPost | IEvent>({
    item,
    id,
    title,
    message,
    creationDate,
    isArchived,
    onSelect,
    onSubmit,
    userId,
    onCreate,
    type,
    images
}: ItemGenericProps<T>) => {
    const [showFullText, setShowFullText] = useState(false);
    const messagePreview = message?.slice(0, 200) ?? '';
    const archived = isArchived ?? false;

    const toggleText = () => setShowFullText(prev => !prev);
    // Generic update handler for both post and event
    const handleUpdate = async (updatedItem: any) => {
        // Sanitize inputs if they exist
        if (updatedItem.title) updatedItem.title = DOMPurify.sanitize(updatedItem.title);
        if (updatedItem.message) updatedItem.message = DOMPurify.sanitize(updatedItem.message);

        onSubmit(updatedItem);
    };


    return (
        <div className={styles.card}>
            <h5>{type === 'post' ? 'Post' : 'Event'} ID: {id ?? 'No hay ID'}</h5>
            <p>
                {creationDate && Array.isArray(creationDate)
                    ? new Date(
                        creationDate[0],
                        creationDate[1] - 1,
                        creationDate[2],
                        creationDate[3] || 0,
                        creationDate[4] || 0,
                        creationDate[5] || 0,
                        creationDate[6] || 0
                    ).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })
                    : '--/--/--'}
            </p>
            {/* Renderiza imágenes si existen */}
            {images && images.length > 0 && (
                <div>
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Imagen ${index + 1}`}
                            className={styles.image}
                        />
                    ))}
                </div>
            )}
            <h5>{title ?? 'No hay título'}</h5>
            <p className={styles.message}>
                {showFullText ? message : messagePreview}
                {message.length > 200 && !showFullText && '...'}
                <button onClick={toggleText} className={styles.toggleButton}>
                    <i className={`bi ${showFullText ? 'bi-dash' : 'bi-plus'}`}></i>
                </button>
            </p>
            <ButtonEditGeneric
                type={type}
                item={item}
                onSubmit={handleUpdate}
            />
            <ButtonArchiveGeneric
                type={type}
                item={item as any}
                onArchive={async (id: number) => {

                    return Promise.resolve(true);
                }}
            />

        </div>
    );
};

export default ItemGeneric;