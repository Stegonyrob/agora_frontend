import React, { useState } from 'react';
import { IPost } from '../../../../../core/posts/IPost';
import ButtonArchive from '../button/archive/ButtonArchivePost';
import ButtonUnArchive from '../button/archive/ButtonUnArchive';
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
    onCreate: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete, onArchive, onUnArchive, onSelect, onSubmit, userId, postId, onCreate }) => {
    const [showFullText, setShowFullText] = useState(false);
    const messagePreview = post?.message?.slice(0, 200) ?? '';
    const isArchived = post?.isArchived ?? false;

    const toggleText = () => {
        setShowFullText(prev => !prev);
    };

    return (
        <div className={styles.card}>
            <h5>Post ID: {post?.id ?? 'No hay ID'}</h5>
            <p>{post?.creation_date?.toLocaleString() ?? '--/--/--'}</p>
            <ImagePost post={post} source={''} alt={''} />
            <h6>{post?.title ?? 'No hay título'}</h6>
            <p className={styles.message}>
                {showFullText ? post?.message : messagePreview}
                {post?.message.length > 200 && !showFullText && '...'}<button onClick={toggleText} className={styles.toggleButton}>
                    <i className={`bi ${showFullText ? 'bi-dash' : 'bi-plus'}`}></i>
                </button>

            </p>

            <div className={styles.actionList}>


                <ButtonEditPost post={post} onSubmit={onEdit} userId={post?.userId ?? 0} label="Edit" postId={post?.id ?? 0} />

                <ButtonArchive
                    post={post}
                    onArchive={(postId: number) => (isArchived ? onUnArchive : onArchive)?.(post?.id ?? 0)}
                    userId={post?.userId ?? 0}
                    postId={post?.id ?? 0}
                    onSubmit={(post: IPost) => console.log(post)}
                    label={isArchived ? 'Unarchive' : 'Archive'}
                />
                <ButtonUnArchive
                    postId={post?.id ?? 0}
                    onSubmit={(post: IPost) => console.log(post)}
                    label="Unarchive"
                    userId={post?.userId ?? 0}
                    post={post}
                    onUnArchive={onUnArchive}
                />


            </div>
        </div>
    );
};

export default PostCard;