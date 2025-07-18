import React from "react";
import styles from "./Replies.module.scss";

interface RepliesProps {
    replies?: any[];
    commentId: number;
    currentUserId: number;
    isAdmin: boolean;
    profiles: any[];
    avatars: any[];
    editReplyId: number | null;
    editReplyText: string;
    setEditReplyId: (id: number | null) => void;
    setEditReplyText: (text: string) => void;
    handleUpdateReply: (reply: any, commentId: number) => void;
    handleDeleteReply: (replyId: number) => void;
    handleEditReply: (reply: any) => void;
    getAvatarUrlByUserId: (userId: number, profiles: any[], avatars: any[]) => string;
}

const Replies: React.FC<RepliesProps> = ({
    replies = [],
    commentId,
    currentUserId,
    isAdmin,
    profiles,
    avatars,
    editReplyId,
    editReplyText,
    setEditReplyId,
    setEditReplyText,
    handleUpdateReply,
    handleDeleteReply,
    handleEditReply,
    getAvatarUrlByUserId
}) => (
    <>
        {(Array.isArray(replies) ? replies : []).map((reply, idx) => (
            <div key={reply.id ?? `reply-${idx}`} className={styles.reply}>
                <img
                    src={getAvatarUrlByUserId(reply.userId, profiles, avatars)}
                    alt={reply.userId?.toString() ?? ""}
                    className={styles.avatarSmall}
                />
                <div className={styles.replyBody}>
                    <span className={styles.user}>{reply.userName}</span>
                    <span className={styles.date}>{reply.creationDate ? new Date(reply.creationDate).toLocaleString('es-ES') : ""}</span>
                    {editReplyId === reply.id ? (
                        <div className={styles.replyInputRow}>
                            <input
                                type="text"
                                placeholder="Editar respuesta..."
                                value={editReplyText}
                                onChange={e => setEditReplyText(e.target.value)}
                                className={styles.inputReply}
                                onKeyDown={e => {
                                    if (e.key === "Enter") handleUpdateReply(reply, commentId);
                                }}
                            />
                            <button className={`${styles.actionIcon} ${styles.checkIcon}`} title="Guardar" onClick={() => handleUpdateReply(reply, commentId)}>
                                <i className="bi bi-check-lg"></i>
                            </button>
                            <button className={`${styles.actionIcon} ${styles.cancelIcon}`} title="Cancelar" onClick={() => setEditReplyId(null)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    ) : (
                        <p className={styles.text}>{reply.message}</p>
                    )}
                    {(reply.userId === currentUserId || isAdmin) && (
                        <div className={styles.actionsRow}>
                            <button className={`${styles.actionIcon} ${styles.edit}`} onClick={() => handleEditReply(reply)}>
                                <i className="bi bi-pencil"></i>
                            </button>
                            <button className={`${styles.actionIcon} ${styles.delete}`} onClick={() => handleDeleteReply(reply.id)}>
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        ))}
    </>
);

export default Replies;
