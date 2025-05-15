import { useState } from 'react';
import styles from './ItemGeneric.module.scss';

interface ItemGenericProps<T> {
    item: T;
    id: number;
    title: string;
    message: string;
    creationDate?: any;
    isArchived?: boolean;
    onEdit: (item: T) => void;
    onDelete: (id: number) => Promise<void>;
    onArchive: (id: number) => Promise<boolean>;
    onUnArchive: (id: number) => Promise<boolean>;
    onSelect: (item: T) => void;
    onSubmit: (item: T) => void;
    userId: number;
    onCreate: (newItem: any) => Promise<void>;
    type: 'post' | 'event';
    images?: any[];
}

const ItemGeneric = <T extends { id: number; message: string; title: string; isArchived?: boolean; creationDate?: any }>({
    item,
    id,
    title,
    message,
    creationDate,
    isArchived,
    onEdit,
    onDelete,
    onArchive,
    onUnArchive,
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
                    {/* Aquí puedes mapear y mostrar las imágenes */}
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
            {/* Aquí puedes renderizar los botones de acción que necesites */}
            {/* Ejemplo: */}
            <button onClick={() => onEdit(item)}>Editar</button>
            <button onClick={() => onDelete(id)}>Eliminar</button>
            <button onClick={() => archived ? onUnArchive(id) : onArchive(id)}>
                {archived ? 'Desarchivar' : 'Archivar'}
            </button>
        </div>
    );
};

export default ItemGeneric;