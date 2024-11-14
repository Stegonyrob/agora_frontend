import React, { useState } from "react";
import { IPost } from "../../../../../../core/posts/IPost";
import PostService from "../../../../../../core/posts/PostService";
import styles from '../ButtonIcons.module.scss';



interface ButtonArchiveProps {
    postId: number;
    userId: number;
    post?: IPost;
    onArchive: (postId: number) => Promise<boolean>;
    onSubmit: (post: IPost) => void;
    label: string;
}

const ButtonArchive: React.FC<ButtonArchiveProps> = ({ userId, post, onSubmit, onArchive }) => {
    const apiPost = new PostService();
    console.log("ButtonArchive: userId", userId);


    const [archived, setArchived] = useState(post?.isArchived ?? false);
    const [color, setColor] = useState(archived ? "red" : "green");
    const [iconDirection, setIconDirection] = useState(archived ? "up" : "down");
    const [label, setLabel] = useState(archived ? "Archivado" : "Publicado");

    const handleArchive = async () => {
        console.log("ButtonArchive: handleArchive called");
        if (post === null || post === undefined) {
            console.error("ButtonArchive: post is null or undefined");
            return;
        }

        try {
            const postId = post.id;
            const result = await apiPost.archivePost(postId, !archived);
            if (result) {
                console.log(`Post con ID ${postId} ${archived ? "desarchivado" : "archivado"} correctamente`);
                setArchived(!archived);
                setColor(!archived ? "red" : "green");
                setIconDirection(!archived ? "up" : "down");
                setLabel(!archived ? "Archivado" : "Publicado");
            } else {
                console.error(`Error ${archived ? "desarchivando" : "archivando"} post con ID ${postId}`);
                setColor(!archived ? "green" : "red");
                setIconDirection(!archived ? "down" : "up");
                setLabel(!archived ? "Publicado" : "Archivado");
            }
        } catch (error) {
            console.error(`Error ${archived ? "desarchivando" : "archivando"} post: ${error}`);
            setColor(!archived ? "green" : "red");
            setIconDirection(!archived ? "down" : "up");
            setLabel(!archived ? "Publicado" : "Archivado");
        }
    };

    return (
        <div className={styles.socialIcons}>
            <span className={styles.socialIcons}>
                <i
                    className={`bi bi-file-earmark-arrow-${iconDirection}`}
                    onClick={handleArchive}
                    style={{ cursor: "pointer", color }}
                />
                <span style={{ marginLeft: "3rem" }}>{label}</span>
            </span>
        </div>
    );
};


export default ButtonArchive;