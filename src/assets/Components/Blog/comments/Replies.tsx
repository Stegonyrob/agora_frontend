
import { IReply } from "@/core/replies/IReply";
import { useDeleteReply, useReplies, useUpdateReply } from "@/core/replies/useRepliesQuery";
import React from "react";
import { useSelector } from "react-redux";
import styles from "./Replies.module.scss";

interface RepliesProps {
    replies?: IReply[]; // Not used, now fetched by React Query
    commentId: number;
}


// Helper para obtener el avatar (puedes adaptar a tu lógica real)
function getAvatarUrl(reply: IReply, avatars: any[]): string {
    // Si el backend provee avatar en reply.user.avatarUrl, úsalo
    if (reply.user && reply.user.avatarUrl) return reply.user.avatarUrl;
    // Si tienes lógica de avatars globales, puedes buscar por avatarId
    if (reply.user && reply.user.avatarId) {
        const avatar = avatars.find((a) => String(a.id) === String(reply.user!.avatarId));
        if (avatar) return avatar.imagePath;
    }
    return "/images/avatarGeneric.png";
}


const Replies: React.FC<RepliesProps> = ({ commentId }) => {
    // Local state for editing replies
    const [editReplyId, setEditReplyId] = React.useState<number | null>(null);
    const [editReplyText, setEditReplyText] = React.useState("");

    // Redux selectors
    const avatars = useSelector((state: any) => Array.isArray(state.avatars?.avatars) ? state.avatars.avatars : []);
    const { userId: currentUserId, role } = useSelector((state: any) => state.session);
    const isAdmin = role === 'ROLE_ADMIN';

    // React Query hooks
    const { data: replies = [], isLoading } = useReplies(commentId);
    const updateReplyMutation = useUpdateReply(commentId);
    const deleteReplyMutation = useDeleteReply(commentId);

    // Handlers
    const handleEditReply = (reply: IReply) => {
        setEditReplyId(reply.id);
        setEditReplyText(reply.message);
    };
    const handleUpdateReply = async (reply: IReply) => {
        await updateReplyMutation.mutateAsync({ id: reply.id, dto: { commentId, userId: reply.userId, message: editReplyText, tags: Array.isArray((reply as any).tags) ? (reply as any).tags : [] } });
        setEditReplyId(null);
        setEditReplyText("");
    };
    const handleDeleteReply = async (replyId: number) => {
        await deleteReplyMutation.mutateAsync(replyId);
    };

    if (isLoading) return <div className={styles.loading}>Cargando respuestas...</div>;

    return (
        <>
            {replies.map((reply, idx) => (
                <div key={reply.id ?? `reply-${idx}`} className={styles.reply}>
                    <img
                        src={getAvatarUrl(reply, avatars)}
                        alt={reply.user?.username || reply.userId?.toString() || ""}
                        className={styles.avatarSmall}
                    />
                    <div className={styles.replyBody}>
                        <span className={styles.user}>{reply.user?.username || reply.user?.email || 'Usuario'}</span>
                        <span className={styles.date}>{reply.creation_date ? new Date(reply.creation_date).toLocaleString('es-ES') : ""}</span>
                        {editReplyId === reply.id ? (
                            <div className={styles.replyInputRow}>
                                <input
                                    type="text"
                                    placeholder="Editar respuesta..."
                                    value={editReplyText}
                                    onChange={e => setEditReplyText(e.target.value)}
                                    className={styles.inputReply}
                                    onKeyDown={e => {
                                        if (e.key === "Enter") handleUpdateReply(reply);
                                    }}
                                />
                                <button className={`${styles.actionIcon} ${styles.checkIcon}`} title="Guardar" onClick={() => handleUpdateReply(reply)}>
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
};

export default Replies;
