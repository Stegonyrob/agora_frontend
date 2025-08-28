
import { CommentDTO } from "@/core/comments/CommentDTO";
import { useComments, useCreateComment } from "@/core/comments/useCommentsQuery";
import React, { useState } from "react";
import { FaRegCommentDots } from "react-icons/fa6";
import { useSelector } from "react-redux";
import styles from "./AccordionComments.module.scss";
import CommentsList from "./CommentsList";
import CommentsSkeleton from "./CommentsSkeleton";

// --- Interfaces y tipos ---
interface AccordionCommentsProps {
  postId: number;
}




// --- Componente principal ---

const AccordionComments: React.FC<AccordionCommentsProps> = ({ postId }) => {
  // Solo estados locales mínimos
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);

  // React Query hooks
  const { data: comments = [], isLoading } = useComments(postId);
  const createCommentMutation = useCreateComment(postId);

  // Obtener el usuario actual de la sesión desde Redux
  const currentUserId = useSelector((state: any) => state.session?.userId || 1);
  // Obtener avatares reales desde Redux
  const avatars = useSelector((state: any) => Array.isArray(state.avatars?.avatars) ? state.avatars.avatars : []);

  // Handler para crear comentario
  const handleAddComment = async () => {
    if (!newComment.trim() || sending) return;
    setSending(true);
    const dto: CommentDTO = { postId, message: newComment };
    try {
      await createCommentMutation.mutateAsync(dto);
      setNewComment("");
    } catch (e) {
      alert("Error al crear el comentario. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  // --- Render principal ---
  if (open && isLoading) {
    return <CommentsSkeleton count={Math.max(2, comments.length || 2)} />;
  }

  return (
    <div className={styles.commentsContainer}>
      <button
        className={styles.commentBtn}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Cerrar comentarios" : "Abrir comentarios"}
      >
        <span className={styles.commentIcon}><FaRegCommentDots size={20} /></span>
        <span className={styles.commentCount}>{comments.length}</span>
        <span className={styles.commentLabel}>comentarios</span>
      </button>
      {open && (
        <div className={styles.accordion}>
          <div className={styles.addCommentRow}>
            <img
              src={avatars[0]?.imagePath || "/images/avatarGeneric.png"}
              alt="avatar"
              className={styles.avatarSmall}
            />
            <input
              type="text"
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className={styles.input}
              onKeyDown={e => {
                if (e.key === "Enter") handleAddComment();
              }}
            />
            <button
              className={styles.sendBtn}
              onClick={handleAddComment}
              disabled={sending}
              aria-busy={sending}
            >
              {sending ? (
                <span className={styles.spinner} aria-label="Enviando..." />
              ) : (
                <i className="bi bi-send"></i>
              )}
            </button>
          </div>
          <CommentsList
            postId={postId}
            comments={comments}
          />
        </div>
      )}
    </div>
  );
};

export default AccordionComments;