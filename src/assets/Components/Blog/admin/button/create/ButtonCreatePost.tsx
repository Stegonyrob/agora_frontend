import DOMPurify from 'dompurify';
import React, { useState } from "react";
import { IPost } from "../../../../../../core/posts/IPost";
import { IPostDTO } from "../../../../../../core/posts/IPostDTO";
import styles from './ButtonCreatePost.module.scss';
import PostForm from "./modal/PostForm";

interface ButtonCreatePostProps {
    onSubmit: (post: IPost) => Promise<void>;
    userId: number;
    userName: string;
    userRole: string;
}

const ButtonCreatePost: React.FC<ButtonCreatePostProps> = ({ onSubmit, userId }) => {
    const [show, setShow] = useState(false);
    console.log("ButtonCreatePostProps:", { onSubmit, userId });
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

    const handleCreate = async (newPost: IPostDTO | null | undefined) => {
        if (newPost == null) {
            console.error("Error creating post: newPost is null or undefined");
            return;
        }

        // Sanitize inputs
        newPost.title = DOMPurify.sanitize(newPost.title) || '';
        newPost.message = DOMPurify.sanitize(newPost.message) || '';

        const userName = sessionStorage.getItem("userName");
        console.log("userName:", userName);
        const userRole = sessionStorage.getItem("userRole");
        if (userRole !== "admin") {
            console.error("Only administrators can create posts.");
            alert("Only administrators can create posts.");
            return;
        }

        const post: IPost = {
            ...newPost,
            userId,
            userName: userName || '',
        };

        try {
            await onSubmit(post);
            handleClose();
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error creating post: ", error);
                alert(`No se pudo crear el post: ${error.message}. Inténtelo de nuevo más tarde.`);
            } else {
                console.error("Error creating post: unknown error");
                alert("No se pudo crear el post, por favor intentenlo más tarde.");
            }
        }
    };

    return (
        <div className={styles.container} >
            <button className={styles.buttonCreate} onClick={handleShow}>Crear Nuevo Post</button>
            <PostForm
                onSubmit={handleCreate}
                onClose={handleClose}
                show={show} userId={userId} userName={''} />

        </div>
    );
};

export default ButtonCreatePost;
