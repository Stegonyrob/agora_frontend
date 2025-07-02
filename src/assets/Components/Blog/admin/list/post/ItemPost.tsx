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

const ItemPost: React.FC<ItemPostProps> = ({
    post, onEdit, onDelete, onArchive, onUnArchive, onSelect, onSubmit, userId, onCreate
}) => {
    const [showFullText, setShowFullText] = useState(false);
    const messagePreview = post?.message?.slice(0, 200) ?? '';
    const comments = post?.comments || [];

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
            <AccordionComments
                postId={post.id}
                currentUserId={userId}
                isAdmin={true}
                commentsCount={comments.length}
                tags={post.tags || []}
            />
        </div>
    );
};

export default ItemPost;