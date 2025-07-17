import { CommentDTO } from "@/core/comments/CommentDTO";
import { createComment, deleteComment, fetchComments, updateComment } from "@/core/comments/commetStore";
import { IComment } from "@/core/comments/IComment";
import { createReply } from "@/core/replies/replyStore";
import { RootState } from "@/redux/store";
import { getAvatarUrlByUserId } from "@/utils/avatarUtils";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AccordionComments.module.scss";

// Utilidad para obtener la URL del avatar por userId
function getAvatarUrl(userId: number, users: any[], avatars: any[]): string {
  const user = users.find((u) => u.id === userId);
  const avatar = avatars.find((a) => a.id === user?.avatar_id);
  return avatar?.imagePath || "/images/avatarGeneric.png";
}
interface AccordionCommentsProps {
  postId: number;
  currentUserId: number;
  isAdmin: boolean;
  commentsCount: number;

}




const AccordionComments: React.FC<AccordionCommentsProps> = ({ postId, currentUserId, isAdmin, commentsCount }) => {
  const dispatch = useDispatch<any>();
  // Selecciona los comentarios solo de este postId
  const comments = useSelector((state: RootState) =>
    Array.isArray(state.comments.commentsByPostId?.[postId])
      ? state.comments.commentsByPostId[postId]
      : []
  );
  // Selecciona usuarios y avatares del store
  const users = useSelector((state: RootState) => state.profile.profiles);
  const avatars = useSelector((state: RootState) => state.avatars.avatars);
  const profiles = useSelector((state: RootState) => state.profile.profiles);

  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (open) dispatch(fetchComments(postId));
    // eslint-disable-next-line
  }, [dispatch, postId, open]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const dto: CommentDTO = { postId, message: newComment };
    dispatch(createComment(dto)).then(() => dispatch(fetchComments(postId)));
    setNewComment("");
  };

  const handleEditComment = (comment: IComment) => {
    setEditId(comment.id);
    setEditText(comment.message);
  };

  const handleUpdateComment = (comment: IComment) => {
    dispatch(updateComment({ id: comment.id, dto: { postId: comment.postId, message: editText } }))
      .then(() => dispatch(fetchComments(postId)));
    setEditId(null);
    setEditText("");
  };

  const handleDeleteComment = (id: number) => {
    dispatch(deleteComment(id)).then(() => dispatch(fetchComments(postId)));
  };

  // CRUD real para replies
  const handleAddReply = (commentId: number) => {
    if (!replyText.trim()) return;
    dispatch(createReply({
      commentId,
      userId: currentUserId,
      message: replyText,
      tags: []
    })).then(() => dispatch(fetchComments(postId)));
    setReplyTo(null);
    setReplyText("");
  };

  // Renderiza replies reales del backend usando avatar real
  const renderReplies = (replies?: any[]) =>
    (Array.isArray(replies) ? replies : []).map((reply, idx) => (
      <div key={reply.id ?? `reply-${idx}`} className={styles.reply}>
        <img
          src={getAvatarUrl(reply.userId, users, avatars)}
          alt={reply.userId?.toString() ?? ""}
          className={styles.avatarSmall}
        />
        <div>
          <span className={styles.user}>{reply.userId}</span>
          <span className={styles.date}>{reply.creationDate ? new Date(reply.creationDate).toLocaleString('es-ES') : ""}</span>
          <p className={styles.text}>{reply.message}</p>
        </div>
      </div>
    ));

  return (
    <div className={styles.commentsContainer}>
      <button className={styles.iconBtn} onClick={() => setOpen(!open)}>
        <i className="bi bi-chat-dots"></i>
        <span className={styles.counter}>{commentsCount}</span>
      </button>
      {open && (
        <div className={styles.accordion}>
          <div className={styles.addCommentRow}>
            <img src={getAvatarUrlByUserId(currentUserId, profiles, avatars)} alt="avatar" className={styles.avatarSmall} />
            <input
              type="text"
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className={styles.input}
              onKeyDown={e => e.key === "Enter" && handleAddComment()}
            />
            <button className={styles.sendBtn} onClick={handleAddComment}>
              <i className="bi bi-send"></i>
            </button>
          </div>
          <div className={styles.commentsList}>
            {comments.length === 0 && (
              <div className={styles.noComments}>Sin comentarios aún.</div>
            )}
            {comments.map((c: IComment) => (
              <div key={c.id} className={styles.comment}>
                <img
                  src={getAvatarUrl(c.userId, users, avatars)}
                  alt={c.userId?.toString() ?? ""}
                  className={styles.avatarSmall}
                />
                <div className={styles.commentBody}>
                  <div className={styles.commentHeader}>
                    <span className={styles.user}>{c.userId}</span>
                    <span className={styles.date}>{c.creationDate ? new Date(c.creationDate).toLocaleString('es-ES') : ""}</span>
                  </div>
                  {editId === c.id ? (
                    <>
                      <input
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        className={styles.input}
                      />
                      <button className={styles.sendBtn} onClick={() => handleUpdateComment(c)}>Guardar</button>
                      <button className={styles.sendBtn} onClick={() => setEditId(null)}>Cancelar</button>
                    </>
                  ) : (
                    <div className={styles.commentText}>{c.message}</div>
                  )}
                  <div className={styles.actionsRow}>
                    <button
                      className={styles.replyBtn}
                      onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                    >
                      <i className="bi bi-reply"></i>
                    </button>
                    {(c.userId === currentUserId || isAdmin) && (
                      <>
                        <button className={styles.replyBtn} onClick={() => handleEditComment(c)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className={styles.replyBtn} onClick={() => handleDeleteComment(c.id)}>
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
                        onKeyDown={e => e.key === "Enter" && handleAddReply(c.id)}
                      />
                      <button className={styles.sendBtn} onClick={() => handleAddReply(c.id)}>
                        <i className="bi bi-send"></i>
                      </button>
                    </div>
                  )}
                  {renderReplies(c.replies)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccordionComments;