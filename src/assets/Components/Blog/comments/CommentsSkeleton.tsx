import React from "react";
import styles from "./CommentsSkeleton.module.scss";

const CommentsSkeleton: React.FC<{ count?: number }> = ({ count = 2 }) => (
    <div className={styles.commentsContainer}>
        <div className={styles.addCommentRow}>
            <div className={`${styles.avatarSmall} ${styles.skeleton}`}></div>
            <div className={`${styles.input} ${styles.skeleton}`} style={{ width: '60%' }}></div>
            <div className={`${styles.sendBtn} ${styles.skeleton}`}></div>
        </div>
        <div className={styles.commentsList}>
            {[...Array(count)].map((_, idx) => (
                <div key={idx} className={styles.comment}>
                    <div className={`${styles.avatarSmall} ${styles.skeleton}`}></div>
                    <div className={styles.commentBody}>
                        <div className={styles.commentHeader}>
                            <div className={`${styles.user} ${styles.skeleton} ${styles.userSkeleton}`}></div>
                            <div className={`${styles.date} ${styles.skeleton} ${styles.dateSkeleton}`}></div>
                        </div>
                        <div className={`${styles.commentText} ${styles.skeleton} ${styles.commentTextSkeleton}`}></div>
                        <div className={styles.actionsRow}>
                            <div className={`${styles.replyBtn} ${styles.skeleton} ${styles.replyBtnSkeleton}`}></div>
                            <div className={`${styles.replyBtn} ${styles.skeleton} ${styles.replyBtnSkeleton}`}></div>
                        </div>
                        <div className={styles.replyInputRow}>
                            <div className={`${styles.input} ${styles.skeleton} ${styles.inputSkeleton}`}></div>
                            <div className={`${styles.sendBtn} ${styles.skeleton}`}></div>
                        </div>
                        <div className={styles.reply}>
                            <div className={`${styles.avatarSmall} ${styles.skeleton}`}></div>
                            <div>
                                <div className={`${styles.user} ${styles.skeleton} ${styles.userReplySkeleton}`}></div>
                                <div className={`${styles.date} ${styles.skeleton} ${styles.dateReplySkeleton}`}></div>
                                <div className={`${styles.text} ${styles.skeleton} ${styles.textReplySkeleton}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default CommentsSkeleton;
