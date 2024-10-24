import React, { useState } from "react";

import { IPost } from "../../../../../core/posts/IPost";
import { IPostDTO } from "../../../../../core/posts/IPostDTO";
import styles from '../footer/FooterCardPost.module.scss';
import EditPostForm from "./EditPostForm";

interface User {
    userId: number;
    username: string;
    role: string;
    counter: number;
}



interface ButtonEditProps {
    postId: number;
    userId: number;
    post?: IPost;
    onSubmit: (post: IPost) => void;
    label: string;
}

const ButtonEdit: React.FC<ButtonEditProps> = ({ postId, userId, post, onSubmit }) => {
    const [show, setShow] = useState(false);

    const handleShow = () => {
        console.log("Showing Edit Post modal");
        setShow(true);
    };


    const handleClose = () => {
        console.log("Showing Edit Post modal");
        setShow(true);
    };

    const handleUpdate = async (updatedPost: IPostDTO) => {
        await onSubmit(updatedPost);
    };
    return (
        <div className={styles.socialIcons}>
            <span className={styles.socialIcons} onClick={handleShow}>
                <i
                    className="bi bi-pencil-square"
                    onClick={handleShow}
                />
            </span>
            {post && (
                <EditPostForm
                    post={post}
                    onSubmit={handleUpdate}
                    onClose={handleClose}
                    show={show}
                />
            )}
        </div>
    );
};
export default ButtonEdit;