import { CommentDTO } from "@/core/comments/CommentDTO";
import { createComment, deleteComment, fetchComments, updateComment } from "@/core/comments/commetStore";
import { IComment } from "@/core/comments/IComment";
import { createReply } from "@/core/replies/replyStore";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AccordionComments.module.scss";

interface AccordionCommentsProps {
  postId: number;
  currentUserId: number;
  isAdmin: boolean;
  commentsCount: number;
}

const avatarList = [
  "https://randomuser.me/api/portraits/lego/1.jpg",
  "https://randomuser.me/api/portraits/lego/2.jpg",
  "https://randomuser.me/api/portraits/lego/3.jpg",
  "https://randomuser.me/api/portraits/lego/4.jpg",
  "https://randomuser.me/api/portraits/lego/5.jpg",
  "https://randomuser.me/api/portraits/lego/6.jpg",
];

const AccordionComments: React.FC<AccordionCommentsProps> = ({ postId, currentUserId, isAdmin, commentsCount }) => {
  const dispatch = useDispatch<any>();

  // Selecciona los comentarios solo de este postId (ajusta tu store si es necesario)
  const comments = useSelector((state: RootState) =>
    Array.isArray(state.comments.commentsByPostId?.[postId])
      ? state.comments.commentsByPostId[postId]
      : []
  );

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
      reply_message: replyText
    })).then(() => dispatch(fetchComments(postId)));
    setReplyTo(null);
    setReplyText("");
  };

  // Renderiza replies reales del backend (asegúrate que replies es un array)
  const renderReplies = (replies?: any[]) =>
    (Array.isArray(replies) ? replies : []).map(reply => (
      <div key={reply.replyId} className={styles.reply}>
        <img
          src={avatarList[reply.userId % avatarList.length]}
          alt={reply.userId?.toString() ?? ""}
          className={styles.avatarSmall}
        />
        <div>
          <span className={styles.user}>{reply.userId}</span>
          <span className={styles.date}>{reply.creation_date ? reply.creation_date.toString().slice(0, 10) : ""}</span>
          <p className={styles.text}>{reply.reply_message}</p>
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
            <img src={avatarList[currentUserId % avatarList.length]} alt="avatar" className={styles.avatarSmall} />
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
                  src={avatarList[c.userId % avatarList.length]}
                  alt={c.userId?.toString() ?? ""}
                  className={styles.avatarSmall}
                />
                <div className={styles.commentBody}>
                  <div className={styles.commentHeader}>
                    <span className={styles.user}>{c.userId}</span>
                    <span className={styles.date}>{c.creationDate ? c.creationDate.toString().slice(0, 10) : ""}</span>
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