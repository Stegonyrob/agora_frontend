import DOMPurify from 'dompurify';
import React, { useState } from "react";

import { IPost } from "../../../../../../core/posts/IPost";
import { IPostDTO } from "../../../../../../core/posts/IPostDTO";
import styles from '../ButtonIcons.module.scss';
import EditEventForm from '../edit/EditEventForm'; // Adjust the path as needed

interface User {
    userId: number;
    username: string;
    role: string;
    counter: number;
    creatorId: number;
    creatorName: string;

}



interface ButtonEditProps {
    postId: number;
    userId: number;
    userName: string;
    post?: IPost;
    onSubmit: (post: IPostDTO) => void;
    label: string;
    eventId: number;
}

const ButtonEdit: React.FC<ButtonEditProps> = ({ postId, post, onSubmit }) => {
    const [show, setShow] = useState(false);
    const userRole = sessionStorage.getItem("role");
    const userName = sessionStorage.getItem("userName");
    const userId = sessionStorage.getItem("userId");
    console.log("userName:", userName);
    console.log("userId:", userId);
    console.log("userRole:", userRole);
    console.log("ButtonArchive: userId", userId);
    const handleShow = () => {
        console.log("Showing Edit Post modal");
        setShow(true);
    };


    const handleClose = () => {
        console.log("Showing Edit Post modal");
        setShow(false);
    };

    const handleUpdate = async (updatedPost: IPostDTO) => {
        // Sanitize inputs
        updatedPost.title = DOMPurify.sanitize(updatedPost.title);
        updatedPost.message = DOMPurify.sanitize(updatedPost.message);

        onSubmit(updatedPost);
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
                <EditEventForm
                    event={post}
                    eventId={eventId}
                    onSubmit={handleUpdate}
                    onClose={handleClose}
                    show={show}
                />
            )}
        </div>
    );
};
export default ButtonEdit;