

import { useDeleteComment, useUpdateComment } from "@/core/comments/useCommentsQuery";
import React from "react";
import styles from "./CommentsList.module.scss";
import Replies from "./Replies";

import { IComment } from "@/core/comments/IComment";
interface CommentsListProps {
    postId: number;
    comments: IComment[];
}


// Helper para obtener el avatar (puedes adaptar a tu lógica real)
function getAvatarUrlByUserId(userId: number): string {
    return "/images/avatarGeneric.png";
}

const CommentsList: React.FC<CommentsListProps> = ({ postId, comments }) => {
    // Local state for edit
    const [editId, setEditId] = React.useState<number | null>(null);
    const [editText, setEditText] = React.useState("");

    // React Query mutations
    const updateCommentMutation = useUpdateComment(postId);
    const deleteCommentMutation = useDeleteComment(postId);

    // Handlers
    const handleEditComment = (comment: IComment) => {
        setEditId(comment.id);
        setEditText(comment.message);
    };
    const handleUpdateComment = async (comment: IComment) => {
        await updateCommentMutation.mutateAsync({ id: comment.id, dto: { postId: comment.postId, message: editText } });
        setEditId(null);
        setEditText("");
    };
    const handleDeleteComment = async (id: number) => {
        await deleteCommentMutation.mutateAsync(id);
    };

    return (
        <div className={styles.commentsList}>
            {comments.length === 0 && (
                <div className={styles.noComments}>Sin comentarios aún.</div>
            )}
            {comments.map((c: IComment) => (
                <div key={c.id} className={styles.comment}>
                    <div className={styles.commentBody}>
                        <div className={styles.commentHeader}>
                            <span className={styles.user}>{c.user?.username || c.user?.email || 'Usuario'}</span>
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
                        </div>
                        {/* Replies component puede ser refactorizado a React Query en el siguiente paso */}
                        <Replies replies={c.replies} commentId={c.id} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommentsList;
