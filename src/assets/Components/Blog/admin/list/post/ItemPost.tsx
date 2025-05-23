import React, { useState } from 'react';
import { IPost } from '../../../../../../core/posts/IPost';
import { IPostDTO } from '../../../../../../core/posts/IPostDTO';
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


const ItemPost: React.FC<ItemPostProps> = ({ post, onEdit, onDelete, onArchive, onUnArchive, onSelect, onSubmit, userId, postId, onCreate }) => {
    const [showFullText, setShowFullText] = useState(false);
    const messagePreview = post?.message?.slice(0, 200) ?? '';
    const isArchived = post?.isArchived ?? false;
    console.log('PostCard:', post);
    const toggleText = () => {
        if (post) {
            setShowFullText(prev => !prev);
        }
    };

    if (!post) {
        return null;
    }
    const handleChange = () => {
        console.log('SVG clicked!');
    };

    return (
        <div className={styles.card}>

            <ItemGeneric
                item={post}
                id={post.id}
                title={post.title}
                message={post.message}
                creationDate={post.creationDate}
                isArchived={post.isArchived}
                type="post"

                onSelect={onSelect}
                onSubmit={onSubmit}
                userId={post.userId}
                onCreate={onCreate} />

        </div>
    );
}

export default ItemPost;