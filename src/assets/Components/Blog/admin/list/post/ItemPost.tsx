import React from 'react';
import { IPost } from '../../../../../../core/posts/IPost';
import { IPostDTO } from '../../../../../../core/posts/IPostDTO';
import ItemGeneric from '../generic/ItemGeneric';
interface ItemPostProps {
    post: IPost
    onEdit: (post: IPost) => void
    onArchive: (postId: number) => Promise<boolean>
    onUnArchive: (postId: number) => Promise<boolean>
    onSelect: (post: IPost) => void
    onSubmit: (post: IPost) => void
    userId: number
    onCreate: (newPost: IPostDTO) => Promise<void>
    onDelete: (postId: number) => Promise<void>
}

const ItemPost: React.FC<ItemPostProps> = (props) => {
    const { post, ...rest } = props;

    return (
        <ItemGeneric
            item={post}
            id={post.id}
            title={post.title}
            message={post.message}
            creationDate={post.creationDate}
            isArchived={post.isArchived}
            images={post.images}
            type="post"
            onEdit={props.onEdit}
            onArchive={props.onArchive}
            onUnArchive={props.onUnArchive}
            onSelect={props.onSelect}
            onSubmit={props.onSubmit}
            userId={props.userId}
            onCreate={props.onCreate} onDelete={function (id: number): Promise<void> {
                return Promise.resolve();
            }} />
    );
}

export default ItemPost;