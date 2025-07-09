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
    const comments = post?.comments || [];

    if (!post) return null;

    // 🗓️ Formatear fecha de creación del post para mostrar
    const formatPostDate = (creationDate: string) => {
        if (!creationDate) return null;

        try {
            const date = new Date(creationDate);
            if (isNaN(date.getTime())) {
                console.warn('📅 ItemPost - Fecha inválida:', creationDate);
                return null;
            }

            // Convertir a array para ItemGeneric
            return [
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            ];
        } catch (error) {
            console.error('📅 ItemPost - Error parseando fecha:', error);
            return null;
        }
    };

    const formattedCreationDate = formatPostDate(post.creationDate);

    return (
        <div className={styles.card}>
            <ItemGeneric
                item={post}
                id={post.id}
                title={post.title}
                message={post.message} // Pasar el mensaje completo, no recortado
                creationDate={formattedCreationDate}
                isArchived={post.isArchived}
                type="post"
                onArchive={onArchive}
                onUnArchive={onUnArchive}
                onSelect={onSelect}
                onSubmit={onSubmit}
                userId={userId}
                onCreate={onCreate}
                images={post.image}
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