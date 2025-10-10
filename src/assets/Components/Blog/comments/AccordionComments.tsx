import { CommentDTO } from "@/core/comments/CommentDTO";
import { useComments, useCreateComment } from "@/core/comments/useCommentsQuery";
import { RootState } from "@/redux/store";
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // React Query hooks
  const { data: comments = [], isLoading } = useComments(postId);
  const createCommentMutation = useCreateComment(postId);

  // *** USAR LA MISMA LÓGICA QUE NAVBAR ***
  const userId = useSelector((state: RootState) => state.session.userId) || Number(sessionStorage.getItem("userId")) || 0;
  // Get the user's profile from the profiles slice
  const userProfile = useSelector((state: RootState) =>
    state.profile.profiles.find((p) => p.id === userId)
  );
  const avatarsList = useSelector((state: RootState) => state.avatars.avatars);

  // *** LÓGICA INLINE COMO EN NAVBAR ***
  let avatarUrl = "/images/avatarGeneric.png";
  if (userProfile) {
    if (userProfile.avatar && userProfile.avatar !== "") {
      avatarUrl = userProfile.avatar;
    } else if (userProfile.avatar_id && avatarsList && avatarsList.length > 0) {
      const foundAvatar = avatarsList.find(a => a.id === userProfile.avatar_id);
      if (foundAvatar && foundAvatar.imagePath) {
        avatarUrl = foundAvatar.imagePath;
      }
    }
  }

  // Handler para crear comentario
  const handleAddComment = async () => {
    if (!newComment.trim() || sending) return;
    setErrorMsg(null);
    setSending(true);
    const dto: CommentDTO = { postId, message: newComment };
    try {
      await createCommentMutation.mutateAsync(dto);
      setNewComment("");
    } catch (e: any) {
      // Intenta extraer mensaje del backend y el código de error
      let msg = "No se pudo crear el comentario. Intenta de nuevo.";
      const status = e?.response?.status;
      if (status === 423) {
        msg = "No puedes crear comentarios porque tu usuario ha sido temporalmente bloqueado por comportamiento inapropiado. Si crees que es un error, contacta con el administrador.";
      } else if (e?.response?.data?.message) {
        msg = e.response.data.message;
        // Si el backend rechaza por contenido inapropiado, personaliza el mensaje
        if (msg.toLowerCase().includes("inapropiado") || msg.toLowerCase().includes("rechazado")) {
          msg = "Tu comentario fue rechazado por contener palabras o expresiones inapropiadas según el análisis automático. Por favor, revisa el contenido y vuelve a intentarlo.";
        }
      }
      setErrorMsg(msg);
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
          {errorMsg && (
            <div className={styles.errorMsg} role="alert">
              <i className="bi bi-exclamation-triangle-fill" style={{ color: '#ffc107', marginRight: 8 }}></i>
              {errorMsg}
            </div>
          )}
          <div className={styles.addCommentRow}>
            <img
              src={avatarUrl}
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