// ButtonUnarchive.tsx
import React, { useState } from "react";
import { IPost } from "../../../../../core/posts/IPost";
import styles from '../footer/FooterCardPost.module.scss';

interface ButtonUnarchiveProps {
    post: IPost;
    onUnarchive: (postId: number) => Promise<boolean>;
}

import { IPostDTO } from "../../../../../core/posts/IPostDTO";


interface ButtonArchiveProps {
    postId: number;
    userId: number;
    post?: IPost;
    onUnArchive: (postId: number) => Promise<boolean>;
    onSubmit: (post: IPost) => void;
    label: string;
}

const ButtonUnArchive: React.FC<ButtonArchiveProps> = ({ userId, post, onSubmit, onUnArchive }) => {

    console.log("ButtonArchive: userId", userId);
    console.log("ButtonArchive: post", post);


    const [unarchived, setUnArchived] = useState(false);
    const handleUnArchive = async (archivePost: IPostDTO) => {
        console.log("ButtonUnArchive: handleUnArchive called");
        if (post === null || post === undefined) {
            console.error("ButtonUnArchive: post is null or undefined");
            return;
        }

        try {
            const postId = post.id;
            const result = await onUnArchive(postId);
            if (result) {
                console.log(`Post con ID ${postId} archivado correctamente`);
                setUnArchived(true);
            } else {
                console.error(`Error archivando post con ID ${postId}`);
            }
        } catch (error) {
            console.error(`Error archivando post: ${error}`);
        }
    };

    return (
        <div className={styles.socialIcons}>
            <span className={styles.socialIcons}>
                {unarchived ? (
                    <i
                        className="bi bi-file-earmark-check"
                        style={{ cursor: "pointer", color: "green" }}
                    />
                ) : (
                    <i
                        className="bi bi-file-earmark-arrow-up"
                        onClick={() => handleUnArchive(post as IPostDTO)}
                        style={{ cursor: "pointer" }}
                    />
                )}
            </span>
        </div>
    );
};


export default ButtonUnArchive;
