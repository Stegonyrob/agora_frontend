

import { useDeleteComment, useUpdateComment } from "@/core/comments/useCommentsQuery";
import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import styles from "./CommentsList.module.scss";
import Replies from "./Replies";

import { IComment } from "@/core/comments/IComment";
interface CommentsListProps {
    postId: number;
    comments: IComment[];
}


// Helper para obtener el avatar del usuario - MISMA LÓGICA QUE NAVBAR
function getAvatarUrlByUserId(userId: number, userProfiles: any[], avatarsList: any[]): string {
    // Buscar el perfil del usuario
    const userProfile = userProfiles.find((p: any) => p.id === userId);

    let avatarUrl = "/images/avatarGeneric.png";
    if (userProfile) {
        if (userProfile.avatar && userProfile.avatar !== "") {
            avatarUrl = userProfile.avatar;
        } else if (userProfile.avatar_id && avatarsList && avatarsList.length > 0) {
            const foundAvatar = avatarsList.find((a: any) => a.id === userProfile.avatar_id);
            if (foundAvatar && foundAvatar.imagePath) {
                avatarUrl = foundAvatar.imagePath;
            }
        }
    }
    return avatarUrl;
}

const CommentsList: React.FC<CommentsListProps> = ({ postId, comments }) => {
    // Local state for edit
    const [editId, setEditId] = React.useState<number | null>(null);
    const [editText, setEditText] = React.useState("");

    // Redux selectors - MISMA LÓGICA QUE NAVBAR CON TIPADO CORRECTO
    const userProfiles = useSelector((state: RootState) => state.profile.profiles || []);
    const avatarsList = useSelector((state: RootState) => state.avatars.avatars || []);

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
                    {(() => {
                        const avatarUrl = getAvatarUrlByUserId(
                            c.userId || 0,
                            userProfiles,
                            avatarsList
                        );
                        return (
                            <img
                                src={avatarUrl}
                                alt="avatar"
                                className={styles.avatarSmall}
                            />
                        );
                    })()}
                    <div className={styles.commentBody}>
                        <div className={styles.commentHeader}>
                            <span className={styles.user}>Usuario</span>
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
