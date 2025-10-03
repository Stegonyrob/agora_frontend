// src/components/Admin/ListAdmin/ListAdmin.tsx
import type { IEvent } from '@/core/events/IEvent';
import type { IPost } from '@/core/posts/IPost';
import type { IText } from '@/core/texts/IText';
import { useCallback, useEffect, useState } from "react";

import { normalizeItem } from '@/core/normalization/normalizeApiResponse';
import PostService from '@/core/posts/PostService';
import ButtonCreateGeneric from '../../button/create/ButtonCreateGeneric';
import ItemEvent from '../event/ItemEvent';
import ItemPost from '../post/ItemPost';
import ItemText from '../text/ItemText';
import styles from './ListAdmin.module.scss';
import ListAdminSkeleton from './ListAdminSkeleton'; // Importa el esqueleto

interface ListAdminPropsPost {
    items: IPost[];
    type: 'post';
    onSelect: (item: IPost) => void;
    onDelete: (id: number) => Promise<void>;
    onEdit: (item: IPost) => void;
    onArchive?: (id: number) => Promise<boolean>;
    onUnArchive?: (id: number) => Promise<boolean>;
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
    onArchive?: (id: number) => Promise<boolean>;
    onUnArchive?: (id: number) => Promise<boolean>;
    onSubmit: (item: IEvent) => void;
    onCreate: (newItem: any) => Promise<void>;
    userId: number;
}

interface ListAdminPropsText {
    items: IText[];
    type: 'text';
    onSelect: (item: IText) => void;
    onDelete: (id: number) => Promise<void>;
    onEdit: (item: IText) => void;
    onArchive?: (id: number) => Promise<boolean>;
    onUnArchive?: (id: number) => Promise<boolean>;
    onSubmit: (item: IText) => void;
    onCreate: (newItem: Partial<IText>) => Promise<void>;
    userId: number;
    filterCategory?: string;
}

type ListAdminProps = ListAdminPropsPost | ListAdminPropsEvent | ListAdminPropsText;

const ListAdmin = (props: ListAdminProps) => {
    const {
        type,
        onSelect,
        onDelete,
        onEdit,
        onSubmit,
        onCreate,
        userId,
        // Optional props for post and event
        onArchive,
        onUnArchive,
    } = props as ListAdminPropsPost & ListAdminPropsEvent & ListAdminPropsText;


    // Estado para los items (solo para post, para refrescar tras archivar)
    const [postItems, setPostItems] = useState<IPost[]>(type === 'post' ? (props.items as IPost[]) : []);
    const items: IPost[] | IEvent[] | IText[] =
        type === 'post'
            ? postItems
            : type === 'event'
                ? (props.items as IEvent[])
                : (props.items as IText[]);

    // Estado local para manejar la carga. Asume que está cargando si no hay items.
    // En una aplicación real, probablemente pasarías un prop 'isLoading' desde el padre.
    const [localIsLoading, setLocalIsLoading] = useState(true);


    // Sincroniza postItems con props.items cuando cambian desde el padre
    useEffect(() => {
        if (type === 'post') {
            setPostItems(props.items as IPost[]);
        }
    }, [type, props.items]);

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
    }, [items]);
    // Handlers de archivado/desarchivado para post (igual que event)
    const postService = type === 'post' ? new PostService() : null;

    const handleArchivePost = useCallback(async (id: number) => {
        if (!postService) return false;
        try {
            await postService.archivePost(id, true);
            // Refresca la lista localmente (opcional: podrías recargar desde backend)
            setPostItems(prev => prev.map(p => p.id === id ? { ...p, isArchived: true } : p));
            return true;
        } catch (e) {
            return false;
        }
    }, [postService]);

    const handleUnArchivePost = useCallback(async (id: number) => {
        if (!postService) return false;
        try {
            await postService.archivePost(id, false);
            setPostItems(prev => prev.map(p => p.id === id ? { ...p, isArchived: false } : p));
            return true;
        } catch (e) {
            return false;
        }
    }, [postService]);

    const normalizedItems = items.map(item => normalizeItem(item));
    // Filtrado por categoría para textos
    const filteredItems = (type === 'text' && 'filterCategory' in props && props.filterCategory)
        ? normalizedItems.filter(item => (item as IText).category === props.filterCategory)
        : normalizedItems;

    // Si está cargando, renderiza el esqueleto
    if (localIsLoading) {
        // Puedes pasar un itemCount basado en la paginación o un número fijo
        const skeletonItemCount = type === 'post' ? 5 : type === 'event' ? 3 : 5;
        return <ListAdminSkeleton type={type === 'text' ? 'post' : type} itemCount={skeletonItemCount} />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <ButtonCreateGeneric type={type} onSubmit={onCreate} userId={userId} />

                {filteredItems && filteredItems.length === 0 && (
                    <div className={styles.noItemsMessage}>
                        <p>No hay {type === 'post' ? 'posts' : type === 'event' ? 'eventos' : 'textos'} para mostrar.</p>
                        <p>Usa el botón de arriba para crear el primero.</p>
                    </div>
                )}

                {type === 'post' && (filteredItems as IPost[]).map(item => (
                    <ItemPost
                        key={item.id}
                        post={item}
                        onArchive={handleArchivePost}
                        onUnArchive={handleUnArchivePost}
                        onSelect={onSelect}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onSubmit={onSubmit}
                        userId={userId}
                        onCreate={onCreate}
                        postId={item.id}
                        id={item.id}
                        title={item.title}
                    />
                ))}
                {type === 'event' && (filteredItems as IEvent[]).map(item => (
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
                        title={item.title}
                    />
                ))}
                {type === 'text' && (filteredItems as IText[]).map(text => (
                    <ItemText
                        key={text.id}
                        text={text}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onSelect={onSelect}
                        onSubmit={onSubmit}
                        userId={userId}
                        onCreate={onCreate} id={0} title={''}
                        onArchive={onArchive} onUnArchive={onUnArchive} />
                ))}
            </div>
        </div>
    );
};

export default ListAdmin;
