import type { IEvent } from '@/core/events/IEvent';
import type { IPost } from '@/core/posts/IPost';
import ButtonCreateGeneric from '../../button/create/ButtonCreateGeneric';
import ItemEvent from '../event/ItemEvent';
import ItemPost from '../post/ItemPost';
import styles from './ListAdmin.module.scss';

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

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <ButtonCreateGeneric type={type} onSubmit={onCreate} userId={userId} />
                {type === 'post'
                    ? (items as IPost[]).map(item => (
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
                            title={item.title}
                        />
                    ))
                    : (items as IEvent[]).map(item => (
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
                    ))
                }
            </div>
        </div>
    );
};

export default ListAdmin;