import React from 'react';
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
    // Debug: mostrar el objeto post recibido desde backend
    try {
        console.log('[ItemPost] Full post object:', JSON.stringify(post, null, 2));
    } catch (e) {
        console.log('[ItemPost] Full post object (raw):', post);
    }
    const comments = post?.comments || [];

    if (!post) return null;

    // Si el objeto viene anidado bajo 'item', usar ese objeto
    const data = (post && (post as any).item) ? (post as any).item : post;
    // Unificar imágenes: puede venir como data.image, data.images, o images prop
    let postImages = [];
    if (Array.isArray(data.images)) {
        postImages = data.images;
    } else if (Array.isArray(data.image)) {
        postImages = data.image;
    } else if (typeof data.image === 'string' && data.image) {
        postImages = [data.image];
    }
    return (
        <div className={styles.card}>
            <ItemGeneric
                item={data}
                id={data.id}
                title={data.title}
                message={data.message}
                creationDate={data.creationDate}
                isArchived={data.isArchived ?? data.archived}
                type="post"
                onArchive={onArchive}
                onUnArchive={onUnArchive}
                onSelect={onSelect}
                onSubmit={onSubmit}
                userId={userId}
                onCreate={onCreate}
                images={postImages}
            />
            <AccordionComments
                postId={data.id}
            />
        </div>
    );
};

export default ItemPost;