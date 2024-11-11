// ButtonUnarchive.tsx
import React, { useState } from "react";
import { IPost } from "../../../../../../core/posts/IPost";
import styles from "../ButtonIcons.module.scss";

import PostService from "../../../../../../core/posts/PostService";
interface ButtonUnArchiveProps {
    post: IPost;
    postId: number;
    userId: number;
    onUnArchive: (postId: number) => Promise<boolean>;
    onSubmit: (post: IPost) => void;
    label: string;
}

const ButtonUnArchive: React.FC<ButtonUnArchiveProps> = ({
    userId,
    post,
    onSubmit,
    onUnArchive,
}) => {
    const apiPost = new PostService();
    console.log("ButtonUnArchive: post", post);

    const [unArchived, setUnArchived] = useState(false);
    const handleUnArchive = async () => {
        if (post === null || post === undefined) return;
        const postId = post.id;
        try {
            await apiPost.unArchivePost(postId, false);
            setUnArchived(true);
        } catch (error) {
            console.error("Error unarchiving post: ", error);
        }
    };

    return (
        <div className={styles.socialIcons}>
            <span className={styles.socialIcons}>
                {unArchived ? (
                    <i
                        className="bi bi-file-earmark-check"
                        style={{ cursor: "pointer", color: "green" }}
                    />
                ) : (
                    <i
                        className="bi bi-file-earmark-arrow-down"
                        onClick={handleUnArchive}
                        style={{ cursor: "pointer" }}
                    />
                )}
            </span>
        </div>
    );
};

export default ButtonUnArchive;
