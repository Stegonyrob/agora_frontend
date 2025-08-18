// src/components/Admin/ListAdmin/ListAdmin.tsx
import type { IEvent } from '@/core/events/IEvent';
import type { IPost } from '@/core/posts/IPost';
import { useEffect, useState } from "react";

import { normalizeItem } from '@/core/normalization/normalizeApiResponse';
import ButtonCreateGeneric from '../../button/create/ButtonCreateGeneric';
import ItemEvent from '../event/ItemEvent';
import ItemPost from '../post/ItemPost';
import styles from './ListAdmin.module.scss';
import ListAdminSkeleton from './ListAdminSkeleton'; // Importa el esqueleto

interface ListAdminPropsPost {
    items: IPost[];
    type: 'post';
    onSelect: (item: IPost) => void;
    onDelete: (id: number) => Promise<void>;
    onEdit: (item: IPost) => void;
    onArchive: (id: number) => Promise<boolean>;
    onUnArchive: (id: number) => Promise<boolean>;
    onSubmit: (item: IPost) => void;
    onCreate: (newItem: any) => Promise<void>;
    userId: number;
}

interface ListAdminPropsEvent {
    items: IEvent[];
    type: 'event';
    onSelect: (item: IEvent) => void;
    onDelete: (id: number) => Promise<void>;
    onEdit: (item: IEvent) => void;
    onArchive: (id: number) => Promise<boolean>;
    onUnArchive: (id: number) => Promise<boolean>;
    onSubmit: (item: IEvent) => void;
    onCreate: (newItem: any) => Promise<void>;
    userId: number;
}

type ListAdminProps = ListAdminPropsPost | ListAdminPropsEvent;

const ListAdmin = (props: ListAdminProps) => {
    const {
        items,
        type,
        onSelect,
        onDelete,
        onEdit,
        onArchive,
        onUnArchive,
        onSubmit,
        onCreate,
        userId,
    } = props;

    // Estado local para manejar la carga. Asume que está cargando si no hay items.
    // En una aplicación real, probablemente pasarías un prop 'isLoading' desde el padre.
    const [localIsLoading, setLocalIsLoading] = useState(true);

    useEffect(() => {
        // Establece isLoading a false una vez que los ítems se cargan.
        // Se puede añadir un retraso mínimo si se quiere que el skeleton sea visible por un tiempo.
        if (items && items.length > 0) {
            setLocalIsLoading(false);
        } else {
            // Si no hay items, espera un momento para mostrar el skeleton antes de mostrar "no hay datos"
            const timer = setTimeout(() => {
                setLocalIsLoading(false);
            }, 500); // Muestra el skeleton por al menos 500ms
            return () => clearTimeout(timer);
        }
    }, [items]); // Dependencia de items para reaccionar cuando cambien

    const normalizedItems = items.map(item => normalizeItem(item));

    // Si está cargando, renderiza el esqueleto
    if (localIsLoading) {
        // Puedes pasar un itemCount basado en la paginación o un número fijo
        const skeletonItemCount = type === 'post' ? 5 : 3; // Ejemplo: 5 posts, 3 eventos
        return <ListAdminSkeleton type={type} itemCount={skeletonItemCount} />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <ButtonCreateGeneric type={type} onSubmit={onCreate} userId={userId} />

                {normalizedItems && normalizedItems.length === 0 && (
                    <div className={styles.noItemsMessage}> {/* Asegúrate de que .noItemsMessage existe en ListAdmin.module.scss */}
                        <p>No hay {type === 'post' ? 'posts' : 'eventos'} para mostrar.</p>
                        <p>Usa el botón de arriba para crear el primero.</p>
                    </div>
                )}

                {type === 'post'
                    ? (normalizedItems as IPost[]).map(item => (
                        <ItemPost
                            key={item.id}
                            post={item}
                            onArchive={onArchive}
                            onUnArchive={onUnArchive}
                            onSelect={onSelect}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onSubmit={onSubmit}
                            userId={userId}
                            onCreate={onCreate}
                            postId={item.id}
                            id={item.id}
                            title={item.title} // Asegúrate de pasar las props correctas a ItemPost
                        />
                    ))
                    : (normalizedItems as IEvent[]).map(item => (
                        <ItemEvent
                            key={item.id}
                            event={item}
                            onArchive={onArchive}
                            onUnArchive={onUnArchive}
                            onSelect={onSelect}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onSubmit={onSubmit}
                            userId={userId}
                            onCreate={onCreate}
                            id={item.id}
                            title={item.title} // Asegúrate de pasar las props correctas a ItemEvent
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default ListAdmin;
