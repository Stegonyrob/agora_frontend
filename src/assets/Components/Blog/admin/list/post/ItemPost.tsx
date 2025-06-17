import React, { useState } from 'react';
import { IPost } from '../../../../../../core/posts/IPost';
import { IPostDTO } from '../../../../../../core/posts/IPostDTO';
import AccordionComments from '../../../comments/AccordionComments';
import ItemGeneric from '../generic/ItemGeneric';
import styles from './ItemPost.module.scss';

interface ItemPostProps {
    id: number;
    title: string;
    post: IPost;
    onEdit: (post: IPost) => void;
    onDelete: (postId: number) => Promise<void>;
    onArchive: (postId: number) => Promise<boolean>;
    onUnArchive: (postId: number) => Promise<boolean>;
    onSelect: (post: IPost) => void;
    onSubmit: (post: IPost) => void;
    userId: number;
    postId: number;
    onCreate: (newPost: IPostDTO) => Promise<void>;
}
const fakeComments = [
    {
        id: 1,
        user: 'Juan Pérez',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        text: '¡Gran post! Me encantó el contenido.',
        date: 'Hace 2h'
    },
    {
        id: 2,
        user: 'Ana Gómez',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        text: 'Muy interesante, gracias por compartir.',
        date: 'Hace 1h'
    }
];
const ItemPost: React.FC<ItemPostProps> = ({
    post, onEdit, onDelete, onArchive, onUnArchive, onSelect, onSubmit, userId, postId, onCreate
}) => {
    const [showFullText, setShowFullText] = useState(false);
    const messagePreview = post?.message?.slice(0, 200) ?? '';

    if (!post) return null;

    return (
        <div className={styles.card}>
            <ItemGeneric
                item={post}
                id={post.id}
                title={post.title}
                message={showFullText ? post.message : messagePreview}
                creationDate={post.creationDate}
                isArchived={post.isArchived}
                type="post"
                onArchive={onArchive}
                onUnArchive={onUnArchive}
                onSelect={onSelect}
                onSubmit={onSubmit}
                userId={userId}
                onCreate={onCreate}
                images={post.images}
            />
            <AccordionComments comments={fakeComments} />
        </div>
    );
};

export default ItemPost;