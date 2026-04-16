// src/components/Admin/ListAdmin/ListAdmin.tsx
import type { IEvent } from '@/core/events/IEvent';
import type { IPost } from '@/core/posts/IPost';
import type { IText } from '@/core/texts/IText';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";

import { normalizeItem } from '@/core/normalization/normalizeApiResponse';
import PostService from '@/core/posts/PostService';
import styles from './ListAdmin.module.scss';
import ListAdminSkeleton from './ListAdminSkeleton'; // Importa el esqueleto

const ButtonCreateGeneric = lazy(() => import('../../button/create/ButtonCreateGeneric'));
const ItemEvent = lazy(() => import('../event/ItemEvent'));
const ItemPost = lazy(() => import('../post/ItemPost'));
const ItemText = lazy(() => import('../text/ItemText'));

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

const getSkeletonType = (type: ListAdminProps['type']): 'post' | 'event' => {
    if (type === 'text') return 'post';
    return type;
};

const getSkeletonItemCount = (type: ListAdminProps['type']): number => {
    if (type === 'event') return 3;
    return 5;
};

const getEmptyTypeLabel = (type: ListAdminProps['type']): string => {
    if (type === 'post') return 'posts';
    if (type === 'event') return 'eventos';
    return 'textos';
};

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

    const isPost = type === 'post';
    const isEvent = type === 'event';
    const isText = type === 'text';
    const skeletonType = getSkeletonType(type);


    // Estado para los items (solo para post, para refrescar tras archivar)
    const [postItems, setPostItems] = useState<IPost[]>(() => {
        if (isPost) return props.items as IPost[];
        return [];
    });
    const items: IPost[] | IEvent[] | IText[] = useMemo(() => {
        if (isPost) return postItems;
        if (isEvent) return props.items as IEvent[];
        return props.items as IText[];
    }, [isPost, isEvent, postItems, props.items]);

    // Estado local para manejar la carga. Asume que está cargando si no hay items.
    // En una aplicación real, probablemente pasarías un prop 'isLoading' desde el padre.
    const [localIsLoading, setLocalIsLoading] = useState(true);


    // Sincroniza postItems con props.items cuando cambian desde el padre
    useEffect(() => {
        if (isPost) {
            setPostItems(props.items as IPost[]);
        }
    }, [isPost, props.items]);

    useEffect(() => {
        // Establece isLoading a false una vez que los ítems se cargan.
        // Se puede añadir un retraso mínimo si se quiere que el skeleton sea visible por un tiempo.
        if (items.length > 0) {
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
    const postService = useMemo(() => (isPost ? new PostService() : null), [isPost]);

    const handleArchiveToggle = useCallback(async (id: number, archived: boolean) => {
        if (!postService) return false;
        try {
            await postService.archivePost(id, archived);
            setPostItems(prev => prev.map(p => p.id === id ? { ...p, isArchived: archived } : p));
            return true;
        } catch (e: unknown) {
            console.warn('Error cambiando estado de archivado del post:', e);
            return false;
        }
    }, [postService]);

    const handleArchivePost = useCallback(async (id: number) => {
        return handleArchiveToggle(id, true);
    }, [handleArchiveToggle]);

    const handleUnArchivePost = useCallback(async (id: number) => {
        return handleArchiveToggle(id, false);
    }, [handleArchiveToggle]);

    const normalizedItems = items.map(item => normalizeItem(item));
    // Filtrado por categoría para textos
    let filteredItems = normalizedItems;
    if (isText && 'filterCategory' in props && props.filterCategory) {
        filteredItems = normalizedItems.filter(item => (item as IText).category === props.filterCategory);
    }

    const emptyTypeLabel = getEmptyTypeLabel(type);
    const skeletonItemCount = getSkeletonItemCount(type);

    const renderPostItems = () => (filteredItems as IPost[]).map(item => (
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
    ));

    const renderEventItems = () => (filteredItems as IEvent[]).map(item => (
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
    ));

    const renderTextItems = () => (filteredItems as IText[]).map(text => (
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
    ));

    const renderItemsByType = () => {
        if (isPost) return renderPostItems();
        if (isEvent) return renderEventItems();
        return renderTextItems();
    };

    // Si está cargando, renderiza el esqueleto
    if (localIsLoading) {
        // Puedes pasar un itemCount basado en la paginación o un número fijo
        return <ListAdminSkeleton type={skeletonType} itemCount={skeletonItemCount} />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <Suspense fallback={<ListAdminSkeleton type={skeletonType} itemCount={1} />}>
                    <ButtonCreateGeneric type={type} onSubmit={onCreate} userId={userId} />
                </Suspense>

                {filteredItems?.length === 0 && (
                    <div className={styles.noItemsMessage}>
                        <p>No hay {emptyTypeLabel} para mostrar.</p>
                        <p>Usa el botón de arriba para crear el primero.</p>
                    </div>
                )}

                <Suspense fallback={<ListAdminSkeleton type={skeletonType} itemCount={3} />}>
                    {renderItemsByType()}
                </Suspense>
            </div>
        </div>
    );
};

export default ListAdmin;
