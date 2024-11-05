import React from 'react';
import { IPost } from '../../../../../core/posts/IPost';
import ButtonEditPost from '../../admin/edit/ButtonEditPost';
import styles from './PostItem.module.scss';

interface PostCardProps {
    post: IPost;
    onEdit: (post: IPost) => void;
    onDelete: (postId: number) => Promise<void>;
    onArchive: (postId: number) => Promise<void>;
    onUnarchive: (postId: number) => Promise<void>;
    onSelect: (post: IPost) => void;
    onSubmit: (post: IPost) => void;
    userId: number;
    postId: number;
    onCreate: () => void;
}




const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete, onArchive, onUnarchive }) => {
    const messagePreview = post?.message?.slice(0, 200) ?? '';
    const isArchived = post?.isArchived ?? false;
    return (
        <div className={styles.card}>
            <h5>Post ID: {post?.id ?? 'No hay ID'}</h5>
            <p>{post?.creation_date?.toLocaleString() ?? 'No hay fecha'}</p>
            <h6>{post?.title ?? 'No hay título'}</h6>
            <p>{messagePreview}...</p>
            <div className={styles.actionList}>
                <ButtonEditPost post={post} onSubmit={onEdit} userId={post?.userId ?? 0} label="Edit" postId={post?.id ?? 0} />
                <button onClick={() => (isArchived ? onUnarchive : onArchive)?.(post?.id ?? 0)}>
                    {isArchived ? 'Unarchive' : 'Archive'}
                </button>
                <button onClick={() => onDelete?.(post?.id ?? 0)}><i className="bi bi-trash"></i></button>
            </div>
        </div>
    );
};

export default PostCard;
