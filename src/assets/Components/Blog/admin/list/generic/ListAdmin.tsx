import ItemEvent from '../event/ItemEvent';
import ItemPost from '../post/ItemPost';
import styles from './ListAdmin.module.scss';
interface ListAdminProps<T> {
    items: T[];
    type: 'post' | 'event';
    onSelect: (item: T) => void;
    onDelete: (id: number) => Promise<void>;
    onEdit: (item: T) => void;
    onArchive: (id: number) => Promise<boolean>;
    onUnArchive: (id: number) => Promise<boolean>;
    onSubmit: (item: T) => void;
    onCreate: (newItem: any) => Promise<void>;
    userId: number;
}

const ListAdmin = <T extends { id: number }>(props: ListAdminProps<T>) => {
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

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                {items.map(item =>
                    type === 'post' ? (
                        <ItemPost
                            key={item.id}
                            post={item as any}
                            onSelect={onSelect as (post: any) => void}
                            onDelete={onDelete}
                            onEdit={onEdit as (post: any) => void}
                            onArchive={onArchive}
                            onUnArchive={onUnArchive}
                            onSubmit={onSubmit as (post: any) => void}
                            userId={userId}
                            onCreate={onCreate} id={0} title={''} postId={0} />
                    ) : (
                        <ItemEvent
                            key={item.id}
                            event={item as any}
                            onSelect={onSelect as (event: any) => void}
                            onDelete={onDelete}
                            onEdit={onEdit as (event: any) => void}
                            onArchive={onArchive}
                            onUnArchive={onUnArchive}
                            onSubmit={onSubmit as (event: any) => void}
                            userId={userId}
                            onCreate={onCreate}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default ListAdmin;