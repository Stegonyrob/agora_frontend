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
                <div>
                    <span className={styles.user}>{reply.userId}</span>
                    <span className={styles.date}>{reply.creationDate ? new Date(reply.creationDate).toLocaleString('es-ES') : ""}</span>
                    {editReplyId === reply.id ? (
                        <div className={styles.replyInputRow} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
                            <input
                                type="text"
                                placeholder="Editar respuesta..."
                                value={editReplyText}
                                onChange={e => setEditReplyText(e.target.value)}
                                className={styles.input}
                                style={{ flex: 1 }}
                                onKeyDown={e => {
                                    if (e.key === "Enter") handleUpdateReply(reply, commentId);
                                }}
                            />
                            <button className={styles.sendBtn} title="Guardar" onClick={() => handleUpdateReply(reply, commentId)}>
                                <i className="bi bi-check-lg" style={{ color: '#4caf50', fontSize: '1.2rem' }}></i>
                            </button>
                            <button className={styles.sendBtn} title="Cancelar" onClick={() => setEditReplyId(null)}>
                                <i className="bi bi-x-lg" style={{ color: '#f44336', fontSize: '1.2rem' }}></i>
                            </button>
                        </div>
                    ) : (
                        <p className={styles.text}>{reply.message}</p>
                    )}
                    {(reply.userId === currentUserId || isAdmin) && (
                        <div className={styles.actionsRow}>
                            <button className={styles.replyBtn} onClick={() => handleEditReply(reply)}>
                                <i className="bi bi-pencil"></i>
                            </button>
                            <button className={styles.replyBtn} onClick={() => handleDeleteReply(reply.id)}>
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
