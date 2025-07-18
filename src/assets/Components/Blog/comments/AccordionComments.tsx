
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
import CommentsList from "./CommentsList";
import CommentsSkeleton from "./CommentsSkeleton";

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
  if ((open && (showSkeleton || commentsLoading)) || !allProfilesReallyLoaded) {
    return <CommentsSkeleton count={Math.max(2, memoizedComments.length || 2)} />;
  }
  return (
    <div className={styles.commentsContainer}>
      <button
        className={styles.iconBtn}
        onClick={() => {
          if (open) setShowSkeleton(false);
          setOpen(!open);
        }}
      >
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
              onKeyDown={e => {
                if (e.key === "Enter") handleAddComment();
              }}
            />
            <button
              className={styles.sendBtn}
              onClick={handleAddComment}
            >
              <i className="bi bi-send"></i>
            </button>
          </div>
          <CommentsList
            comments={memoizedComments}
            profiles={profiles}
            avatars={avatars}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
            replyText={replyText}
            setReplyText={setReplyText}
            handleAddReply={handleAddReply}
            editId={editId}
            setEditId={setEditId}
            editText={editText}
            setEditText={setEditText}
            handleEditComment={handleEditComment}
            handleUpdateComment={handleUpdateComment}
            handleDeleteComment={handleDeleteComment}
            editReplyId={editReplyId}
            setEditReplyId={setEditReplyId}
            editReplyText={editReplyText}
            setEditReplyText={setEditReplyText}
            handleEditReply={handleEditReply}
            handleUpdateReply={handleUpdateReply}
            handleDeleteReply={handleDeleteReply}
            getAvatarUrlByUserId={getAvatarUrlByUserId}
          />
        </div>
      )}
    </div>
  );
};

export default AccordionComments;