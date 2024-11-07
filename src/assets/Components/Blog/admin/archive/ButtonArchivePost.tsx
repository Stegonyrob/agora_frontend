import React, { useState } from "react";
import { IPost } from "../../../../../core/posts/IPost";
import styles from "../footer/FooterCardPost.module.scss";

interface ButtonArchiveProps {
    postId: number;
    userId: number;
    post?: IPost;
    onArchive: (postId: number) => Promise<boolean>;
    onSubmit: (post: IPost) => void;
    label: string;
}

const ButtonArchive: React.FC<ButtonArchiveProps> = ({ userId, post, onSubmit, onArchive, label }) => {
    const [archived, setArchived] = useState(false);

    const handleArchive = async () => {
        console.log("ButtonArchive: handleArchive called");
        if (post === null || post === undefined) {
            console.error("ButtonArchive: post is null or undefined");
            return;
        }

        try {
            const postId = post.id;
            const result = await onArchive(postId);
            if (result) {
                console.log(`Post con ID ${postId} archivado correctamente`);
                setArchived(true);
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
                {archived ? (
                    <i
                        className="bi bi-file-earmark-check"
                        style={{ cursor: "pointer", color: "green" }}
                    />
                ) : (
                    <i
                        className="bi bi-file-earmark-arrow-up"
                        onClick={handleArchive}
                        style={{ cursor: "pointer" }}
                    />
                )}
            </span>
        </div>
    );
};

export default ButtonArchive;