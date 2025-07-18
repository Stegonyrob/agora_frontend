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
                            <div className={`${styles.user} ${styles.skeleton}`} style={{ width: '80px', height: '16px' }}></div>
                            <div className={`${styles.date} ${styles.skeleton}`} style={{ width: '100px', height: '12px' }}></div>
                        </div>
                        <div className={`${styles.commentText} ${styles.skeleton}`} style={{ height: '18px', width: '90%' }}></div>
                        <div className={styles.actionsRow}>
                            <div className={`${styles.replyBtn} ${styles.skeleton}`} style={{ width: '32px', height: '32px' }}></div>
                            <div className={`${styles.replyBtn} ${styles.skeleton}`} style={{ width: '32px', height: '32px' }}></div>
                        </div>
                        <div className={styles.replyInputRow}>
                            <div className={`${styles.input} ${styles.skeleton}`} style={{ width: '50%' }}></div>
                            <div className={`${styles.sendBtn} ${styles.skeleton}`}></div>
                        </div>
                        <div className={styles.reply}>
                            <div className={`${styles.avatarSmall} ${styles.skeleton}`}></div>
                            <div>
                                <div className={`${styles.user} ${styles.skeleton}`} style={{ width: '60px', height: '14px' }}></div>
                                <div className={`${styles.date} ${styles.skeleton}`} style={{ width: '80px', height: '10px' }}></div>
                                <div className={`${styles.text} ${styles.skeleton}`} style={{ width: '90px', height: '12px' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default CommentsSkeleton;
