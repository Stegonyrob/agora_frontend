import React, { useState } from "react";
import { IPost } from "../../../../../core/posts/IPost";
import { IPostDTO } from "../../../../../core/posts/IPostDTO";
import PostForm from "../../admin/PostForm";
import styles from './ButtonCreatePost.module.scss';

interface ButtonCreatePostProps {
    onSubmit: (post: IPost) => Promise<void>;
}

const ButtonCreatePost: React.FC<ButtonCreatePostProps> = ({ onSubmit }) => {
    const [show, setShow] = useState(false);

    const handleShow = () => {
        console.log("Showing Create Post modal");
        setShow(true);
    };

    const handleClose = () => {
        if (show === null) {
            console.error("show is null, cannot close modal");
            return;
        }
        console.log("Closing Create Post modal");
        setShow(false);
    };

    const handleCreate = async (newPost: IPostDTO) => {
        await onSubmit(newPost);
        handleClose();
    };

    return (
        <div className={styles.container} >
            <button className={styles.buttonCreate} onClick={handleShow}>Crear Nuevo Post</button>
            <PostForm
                onSubmit={handleCreate}
                onClose={handleClose}
                show={show}
            />

        </div>
    );
};

export default ButtonCreatePost;
