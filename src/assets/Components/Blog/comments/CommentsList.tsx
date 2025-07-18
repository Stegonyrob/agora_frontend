import React from "react";
import styles from "./CommentsList.module.scss";
import Replies from "./Replies";

interface CommentsListProps {
    comments: any[];
    profiles: any[];
    avatars: any[];
    currentUserId: number;
    isAdmin: boolean;
    replyTo: number | null;
    setReplyTo: (id: number | null) => void;
    replyText: string;
    setReplyText: (text: string) => void;
    handleAddReply: (commentId: number) => void;
    editId: number | null;
    setEditId: (id: number | null) => void;
    editText: string;
    setEditText: (text: string) => void;
    handleEditComment: (comment: any) => void;
    handleUpdateComment: (comment: any) => void;
    handleDeleteComment: (id: number) => void;
    editReplyId: number | null;
    setEditReplyId: (id: number | null) => void;
    editReplyText: string;
    setEditReplyText: (text: string) => void;
    handleEditReply: (reply: any) => void;
    handleUpdateReply: (reply: any, commentId: number) => void;
    handleDeleteReply: (replyId: number) => void;
    getAvatarUrlByUserId: (userId: number, profiles: any[], avatars: any[]) => string;
}

const CommentsList: React.FC<CommentsListProps> = ({
    comments,
    profiles,
    avatars,
    currentUserId,
    isAdmin,
    replyTo,
    setReplyTo,
    replyText,
    setReplyText,
    handleAddReply,
    editId,
    setEditId,
    editText,
    setEditText,
    handleEditComment,
    handleUpdateComment,
    handleDeleteComment,
    editReplyId,
    setEditReplyId,
    editReplyText,
    setEditReplyText,
    handleEditReply,
    handleUpdateReply,
    handleDeleteReply,
    getAvatarUrlByUserId
}) => (
    <div className={styles.commentsList}>
        {comments.length === 0 && (
            <div className={styles.noComments}>Sin comentarios aún.</div>
        )}
        {comments.map((c: any) => (
            <div key={c.id} className={styles.comment}>
                <img
                    src={getAvatarUrlByUserId(c.userId, profiles, avatars)}
                    alt={c.userId?.toString() ?? ""}
                    className={styles.avatarSmall}
                />
                <div className={styles.commentBody}>
                    <div className={styles.commentHeader}>
                        <span className={styles.user}>{c.userName}</span>
                        <span className={styles.date}>{c.creationDate ? new Date(c.creationDate).toLocaleString('es-ES') : ""}</span>
                    </div>
                    {editId === c.id ? (
                        <div className={styles.editRow}>
                            <input
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                className={styles.inputComment}
                                onKeyDown={e => {
                                    if (e.key === "Enter") handleUpdateComment(c);
                                }}
                            />
                            <button
                                className={`${styles.actionIcon} ${styles.accept}`}
                                title="Guardar"
                                onClick={() => handleUpdateComment(c)}
                            >
                                <i className="bi bi-check-lg"></i>
                            </button>
                            <button
                                className={`${styles.actionIcon} ${styles.cancel}`}
                                title="Cancelar"
                                onClick={() => setEditId(null)}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    ) : (
                        <div className={styles.commentText}>{c.message}</div>
                    )}
                    <div className={styles.actionsRow}>
                        <button
                            className={`${styles.actionIcon} ${styles.reply}`}
                            onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                        >
                            <i className="bi bi-reply"></i>
                        </button>
                        {(c.userId === currentUserId || isAdmin) && (
                            <>
                                <button
                                    className={`${styles.actionIcon} ${styles.edit}`}
                                    onClick={() => handleEditComment(c)}
                                >
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                    className={`${styles.actionIcon} ${styles.delete}`}
                                    onClick={() => handleDeleteComment(c.id)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </>
                        )}
                    </div>
                    {replyTo === c.id && (
                        <div className={styles.replyInputRow}>
                            <input
                                type="text"
                                placeholder="Responder..."
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                className={styles.input}
                                onKeyDown={e => {
                                    if (e.key === "Enter") {
                                        handleAddReply(c.id);
                                    }
                                }}
                            />
                            <button
                                className={`${styles.actionIcon} ${styles.reply}`}
                                onClick={() => handleAddReply(c.id)}
                            >
                                <i className="bi bi-send"></i>
                            </button>
                        </div>
                    )}
                    <Replies
                        replies={c.replies}
                        commentId={c.id}
                        currentUserId={currentUserId}
                        isAdmin={isAdmin}
                        profiles={profiles}
                        avatars={avatars}
                        editReplyId={editReplyId}
                        editReplyText={editReplyText}
                        setEditReplyId={setEditReplyId}
                        setEditReplyText={setEditReplyText}
                        handleUpdateReply={handleUpdateReply}
                        handleDeleteReply={handleDeleteReply}
                        handleEditReply={handleEditReply}
                        getAvatarUrlByUserId={getAvatarUrlByUserId}
                    />
                </div>
            </div>
        ))}
    </div>
);

export default CommentsList;
