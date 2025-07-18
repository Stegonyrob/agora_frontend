
import { CommentDTO } from "@/core/comments/CommentDTO";
import { createComment, deleteComment, fetchComments, updateComment } from "@/core/comments/commetStore";
import { IComment } from "@/core/comments/IComment";
import { fetchProfileById } from "@/core/profiles/profileStore";
import { createReply, deleteReply, updateReply } from "@/core/replies/replyStore";
import { RootState } from "@/redux/store";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from 'reselect';
import styles from "./AccordionComments.module.scss";
import CommentsSkeleton from "./CommentsSkeleton";
import Replies from "./Replies";

// --- Interfaces y tipos ---
interface AccordionCommentsProps {
  postId: number;
}

// --- Helpers ---
function getAvatarUrlByUserId(userId: number, profiles: any[], avatars: any[]): string {
  const profile = profiles.find((p) => p.id === userId);
  if (!profile) {
    console.log(`[getAvatarUrlByUserId] userId=${userId} -> profile NOT FOUND. profiles:`, profiles);
    return "/images/avatarGeneric.png";
  }
  const avatarId = profile.avatar_id ?? profile.avatarId;
  if (!avatarId) {
    console.log(`[getAvatarUrlByUserId] userId=${userId} -> avatar_id/avatarId NOT FOUND in profile:`, profile);
    return profile.avatar || "/images/avatarGeneric.png";
  }
  const avatar = avatars.find((a) => String(a.id) === String(avatarId));
  if (!avatar) {
    console.log(`[getAvatarUrlByUserId] userId=${userId} -> avatar_id=${avatarId} NOT FOUND. avatars:`, avatars);
    return profile.avatar || "/images/avatarGeneric.png";
  }
  console.log(`[getAvatarUrlByUserId] userId=${userId} -> avatar_id=${avatarId} -> imagePath=${avatar.imagePath}`);
  return avatar.imagePath || profile.avatar || "/images/avatarGeneric.png";
}


// --- Componente principal ---
const AccordionComments: React.FC<AccordionCommentsProps> = ({ postId }) => {
  const dispatch = useDispatch<any>();
  // Obtén el usuario logueado y rol directamente del store
  const { userId: currentUserId, role } = useSelector((state: RootState) => state.session);
  const isAdmin = role === 'ROLE_ADMIN';

  // Selectores y estado
  const makeSelectCommentsByPostId = () => createSelector(
    [
      (state: RootState) => state.comments.commentsByPostId,
      (_: RootState, postId: number) => postId
    ],
    (commentsByPostId, postId) =>
      Array.isArray(commentsByPostId?.[postId]) ? commentsByPostId[postId] : []
  );
  const selectProfiles = (state: RootState) =>
    Array.isArray(state.profile?.profiles) ? state.profile.profiles : [];
  const selectAvatars = (state: RootState) =>
    Array.isArray(state.avatars?.avatars) ? state.avatars.avatars : [];
  const selectComments = useMemo(makeSelectCommentsByPostId, []);
  const comments = useSelector((state: RootState) => selectComments(state, postId));
  const memoizedComments = useMemo(() => comments, [comments]);
  const commentsCount = memoizedComments.length;
  const profiles = useSelector(selectProfiles);
  const avatars = useSelector(selectAvatars);

  // Estado local
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editReplyId, setEditReplyId] = useState<number | null>(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // --- Helpers internos ---
  function getAllUserIds(comments: any[]): number[] {
    const ids = new Set<number>();
    comments.forEach((c) => {
      if (c.userId) ids.add(c.userId);
      if (Array.isArray(c.replies)) {
        c.replies.forEach((r: any) => {
          if (r.userId) ids.add(r.userId);
        });
      }
    });
    const arr = Array.from(ids);
    console.log('[AccordionComments] getAllUserIds:', arr, 'from comments:', comments);
    return arr;
  }
  function isProfileLoaded(userId: number, profiles: any[]): boolean {
    const loaded = profiles.some((p) => p.userId === userId);
    if (!loaded) {
      console.log(`[AccordionComments] isProfileLoaded: userId=${userId} NOT loaded. Current profiles:`, profiles);
    }
    return loaded;
  }

  // --- Efectos ---
  const allUserIds = useMemo(() => getAllUserIds(memoizedComments), [memoizedComments]);
  const allProfilesReallyLoaded = allUserIds.every((userId) => isProfileLoaded(userId, profiles));
  useEffect(() => {
    if (!open) {
      setShowSkeleton(false);
      return;
    }
    // Si no hay comentarios o perfiles cargando, muestra el skeleton
    if (!allProfilesReallyLoaded) {
      setShowSkeleton(true);
    } else {
      setShowSkeleton(false);
    }
  }, [allProfilesReallyLoaded, profiles, open]);
  // Cargar comentarios solo al abrir el accordion
  useEffect(() => {
    if (!open) return;
    setCommentsLoading(true);
    dispatch(fetchComments(postId)).then(() => {
      setCommentsLoading(false);
    });
    // eslint-disable-next-line
  }, [dispatch, postId, open]);

  // Cargar perfiles solo cuando llegan comentarios nuevos
  useEffect(() => {
    if (!open) return;
    const allUserIds = getAllUserIds(memoizedComments);
    allUserIds.forEach((userId) => {
      if (!isProfileLoaded(userId, profiles)) {
        dispatch(fetchProfileById(userId));
      }
    });
    // eslint-disable-next-line
  }, [open, memoizedComments, profiles, dispatch]);

  // --- Handlers ---
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const dto: CommentDTO = { postId, message: newComment };
    dispatch(createComment({ ...dto, userId: currentUserId } as any)).then(() => dispatch(fetchComments(postId)));
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
  const handleEditReply = (reply: any) => {
    setEditReplyId(reply.id);
    setEditReplyText(reply.message);
  };
  const handleUpdateReply = (reply: any, commentId: number) => {
    dispatch(updateReply({
      replyId: reply.id,
      reply: {
        commentId: commentId,
        userId: reply.userId,
        message: editReplyText,
        tags: Array.isArray(reply.tags) ? reply.tags : []
      }
    })).then(() => dispatch(fetchComments(postId)));
    setEditReplyId(null);
    setEditReplyText("");
  };
  const handleDeleteReply = (replyId: number) => {
    dispatch(deleteReply(replyId))
      .then(() => dispatch(fetchComments(postId)));
  };

  // --- Render helpers ---
  // Replies ahora es un componente separado
  // Loader ahora es un componente CommentsSkeleton

  // --- Render principal ---
  // Si está cargando comentarios o perfiles, muestra el loader
  if ((open && (showSkeleton || commentsLoading)) || !allProfilesReallyLoaded) {
    return <CommentsSkeleton count={Math.max(2, memoizedComments.length || 2)} />;
  }
  // Si no, muestra el accordion normal
  return (
    <div className={styles.commentsContainer}>
      <button
        className={styles.iconBtn}
        onClick={() => {
          if (open) {
            setShowSkeleton(false);
          }
          setOpen(!open);
        }}
      >
        <i className="bi bi-chat-dots"></i>
        <span className={styles.counter}>{commentsCount}</span>
      </button>
      {open && (
        <div className={styles.accordion}>
          <div className={styles.addCommentRow}>
            <img src={(() => {
              const url = getAvatarUrlByUserId(currentUserId, profiles, avatars);
              return url;
            })()} alt="avatar" className={styles.avatarSmall} />
            <input
              type="text"
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className={styles.input}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleAddComment();
                }
              }}
            />
            <button
              className={styles.sendBtn}
              onClick={handleAddComment}
            >
              <i className="bi bi-send"></i>
            </button>
          </div>
          <div className={styles.commentsList}>
            {comments.length === 0 && (
              <div className={styles.noComments}>Sin comentarios aún.</div>
            )}
            {memoizedComments.map((c: IComment) => (
              <div key={c.id} className={styles.comment}>
                <img
                  src={(() => {
                    const url = getAvatarUrlByUserId(c.userId, profiles, avatars);
                    return url;
                  })()}
                  alt={c.userId?.toString() ?? ""}
                  className={styles.avatarSmall}
                />
                <div className={styles.commentBody}>
                  <div className={styles.commentHeader}>
                    <span className={styles.user}>{c.userId}</span>
                    <span className={styles.date}>{c.creationDate ? new Date(c.creationDate).toLocaleString('es-ES') : ""}</span>
                  </div>
                  {editId === c.id ? (
                    <div className={styles.editRow} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        className={styles.input + ' ' + styles.replyInput}
                        style={{ flex: 1 }}
                      />
                      <button
                        className={styles.iconBtn}
                        title="Guardar"
                        onClick={() => handleUpdateComment(c)}
                      >
                        <i className="bi bi-check-lg" style={{ color: '#4caf50', fontSize: '1.2rem' }}></i>
                      </button>
                      <button
                        className={styles.iconBtn}
                        title="Cancelar"
                        onClick={() => setEditId(null)}
                      >
                        <i className="bi bi-x-lg" style={{ color: '#f44336', fontSize: '1.2rem' }}></i>
                      </button>
                    </div>
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
                        <button
                          className={styles.replyBtn}
                          onClick={() => handleEditComment(c)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className={styles.replyBtn}
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
                        className={styles.sendBtn}
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
        </div>
      )}
    </div>
  );
};

export default AccordionComments;