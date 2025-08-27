
import { CommentDTO } from "@/core/comments/CommentDTO";
import { createComment, deleteComment, fetchComments, updateComment } from "@/core/comments/commetStore";
import { IComment } from "@/core/comments/IComment";
import { fetchProfileById } from "@/core/profiles/profileStore";
import { createReply, deleteReply, updateReply } from "@/core/replies/replyStore";
import { RootState } from "@/redux/store";
import React, { useEffect, useMemo, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
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
    // console.log(`[getAvatarUrlByUserId] userId=${userId} -> profile NOT FOUND. profiles:`, profiles);
    return "/images/avatarGeneric.png";
  }
  const avatarId = profile.avatar_id ?? profile.avatarId;
  if (!avatarId) {
    // console.log(`[getAvatarUrlByUserId] userId=${userId} -> avatar_id/avatarId NOT FOUND in profile:`, profile);
    return profile.avatar || "/images/avatarGeneric.png";
  }
  const avatar = avatars.find((a) => String(a.id) === String(avatarId));
  if (!avatar) {
    // console.log(`[getAvatarUrlByUserId] userId=${userId} -> avatar_id=${avatarId} NOT FOUND. avatars:`, avatars);
    return profile.avatar || "/images/avatarGeneric.png";
  }
  // console.log(`[getAvatarUrlByUserId] userId=${userId} -> avatar_id=${avatarId} -> imagePath=${avatar.imagePath}`);
  return avatar.imagePath || profile.avatar || "/images/avatarGeneric.png";
}


// --- Componente principal ---
const AccordionComments: React.FC<AccordionCommentsProps> = ({ postId }) => {
  // LOG: Montaje del componente
  console.log('[AccordionComments] MONTAR componente para postId:', postId);
  const dispatch = useDispatch<any>();
  // Obtén el usuario logueado y rol directamente del store
  const { userId: currentUserId, role } = useSelector((state: RootState) => state.session);
  const isAdmin = role === 'ROLE_ADMIN';

  // Selectores y estado
  // Selector directo para forzar re-render cuando cambia el store
  const commentsByPostId = useSelector((state: RootState) => state.comments.commentsByPostId);
  console.log('[AccordionComments] commentsByPostId store:', commentsByPostId);
  const comments = Array.isArray(commentsByPostId?.[postId]) ? commentsByPostId[postId] : [];
  console.log('[AccordionComments] comments para postId', postId, '->', comments);
  const commentsCount = comments.length;
  console.log('[AccordionComments] commentsCount para postId', postId, '->', commentsCount);
  const profiles = useSelector((state: RootState) => Array.isArray(state.profile?.profiles) ? state.profile.profiles : []);
  const avatars = useSelector((state: RootState) => Array.isArray(state.avatars?.avatars) ? state.avatars.avatars : []);

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

  // Cargar comentarios al montar el componente para que el contador sea correcto
  useEffect(() => {
    console.log('[AccordionComments] useEffect MONTAR: dispatch(fetchComments)', postId);
    dispatch(fetchComments(postId));
    // eslint-disable-next-line
  }, [dispatch, postId]);

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
  const allUserIds = useMemo(() => getAllUserIds(comments), [comments]);
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
    console.log('[AccordionComments] useEffect ABRIR: dispatch(fetchComments)', postId);
    setCommentsLoading(true);
    dispatch(fetchComments(postId)).then(() => {
      setCommentsLoading(false);
      console.log('[AccordionComments] fetchComments terminado al abrir para postId', postId);
    });
    // eslint-disable-next-line
  }, [dispatch, postId, open]);

  // Cargar perfiles solo cuando llegan comentarios nuevos
  useEffect(() => {
    if (!open) return;
    const allUserIds = getAllUserIds(comments);
    allUserIds.forEach((userId) => {
      if (!isProfileLoaded(userId, profiles)) {
        dispatch(fetchProfileById(userId));
      }
    });
    // eslint-disable-next-line
  }, [open, comments, profiles, dispatch]);

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
  console.log('[AccordionComments] RENDER PRINCIPAL - postId:', postId, 'commentsCount:', commentsCount, 'showSkeleton:', showSkeleton, 'commentsLoading:', commentsLoading);

  if (open && (showSkeleton || commentsLoading || !allProfilesReallyLoaded)) {
    console.log('[AccordionComments] MOSTRANDO SKELETON para postId:', postId);
    return <CommentsSkeleton count={Math.max(2, comments.length || 2)} />;
  }

  console.log('[AccordionComments] MOSTRANDO BOTÓN para postId:', postId, 'con count:', commentsCount);
  return (
    <div className={styles.commentsContainer}>
      <button
        className={styles.commentBtn}
        onClick={() => {
          if (open) setShowSkeleton(false);
          setOpen(!open);
        }}
        aria-label={open ? "Cerrar comentarios" : "Abrir comentarios"}
        style={{
          // Force visibility for debugging
          display: 'inline-flex',
          visibility: 'visible',
          opacity: 1
        }}
      >
        <span className={styles.commentIcon}><FaRegCommentDots size={20} /></span>
        <span className={styles.commentCount} style={{ color: '#6dd5ed', fontWeight: 'bold' }}>{commentsCount}</span>
        <span className={styles.commentLabel}>comentarios</span>
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
            comments={comments}
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