import React, { useState } from 'react';
import { IPost } from '../../../../../core/posts/IPost';
import { IPostDTO } from '../../../../../core/posts/IPostDTO';
import ButtonArchive from '../button/archive/ButtonArchivePost';

import ButtonEditPost from '../button/edit/ButtonEditPost';
import ImagePost from './ImagePost';
import styles from './PostItem.module.scss';

interface PostCardProps {
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

const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete, onArchive, onUnArchive, onSelect, onSubmit, userId, postId, onCreate }) => {
    const [showFullText, setShowFullText] = useState(false);
    const messagePreview = post?.message?.slice(0, 200) ?? '';
    const isArchived = post?.isArchived ?? false;

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
            <h5>Post ID: {post?.id ?? 'No hay ID'}</h5>
            <p>{post?.creationDate?.toLocaleString() ?? '--/--/--'}</p>
            <ImagePost post={post} source={''} alt={''} />
            <h6>{post?.title ?? 'No hay título'}</h6>
            <p className={styles.message}>
                {showFullText ? post?.message : messagePreview}
                {post?.message.length > 200 && !showFullText && '...'}<button onClick={toggleText} className={styles.toggleButton}>
                    <i className={`bi ${showFullText ? 'bi-dash' : 'bi-plus'}`}></i>
                </button>
            </p>

            <ButtonEditPost post={post} onSubmit={onEdit} userId={post?.userId ?? 0} label="Edit" postId={post?.id ?? 0} />
            <ButtonArchive
                post={post}
                onArchive={async (postId: number) => {
                    const result = await onArchive(postId);
                    if (result) {
                        post.isArchived = true; // Actualiza el estado local
                    }
                    return result; // Return the boolean result
                }}
                userId={post?.userId ?? 0}
                postId={post?.id ?? 0}
                onSubmit={(post: IPost) => console.log(post)}
                label={isArchived ? 'Unarchive' : 'Archive'}
            />

        </div>

    );
};

export default PostCard;
