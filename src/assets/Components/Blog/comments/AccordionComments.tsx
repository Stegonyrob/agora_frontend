import React, { useState } from 'react';
import styles from './AccordionComments.module.scss';

interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  date: string;
  replies?: Comment[];
}

interface AccordionCommentsProps {
  postId: number;
}

const avatarList = [
  "https://randomuser.me/api/portraits/lego/1.jpg",
  "https://randomuser.me/api/portraits/lego/2.jpg",
  "https://randomuser.me/api/portraits/lego/3.jpg",
  "https://randomuser.me/api/portraits/lego/4.jpg",
  "https://randomuser.me/api/portraits/lego/5.jpg",
  "https://randomuser.me/api/portraits/lego/6.jpg",
];

// Datos fake para pruebas
const FAKE_COMMENTS: Comment[] = [
  {
    id: 1,
    user: 'Alice',
    avatar: avatarList[0],
    text: '¡Gran post!',
    date: 'Hoy',
    replies: [
      {
        id: 11,
        user: 'Bob',
        avatar: avatarList[1],
        text: 'Totalmente de acuerdo',
        date: 'Hoy',
      },
    ],
  },
  {
    id: 2,
    user: 'Charlie',
    avatar: avatarList[2],
    text: 'Gracias por compartir.',
    date: 'Ayer',
    replies: [],
  },
];

const AccordionComments: React.FC<AccordionCommentsProps> = ({ postId }) => {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>(FAKE_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) {
      console.log('Add Comment: Empty comment text');
      return;
    }
    console.log('Add Comment:', newComment);
    setComments(prev => [
      ...prev,
      {
        id: Date.now(),
        user: 'Tú',
        avatar: avatarList[Math.floor(Math.random() * avatarList.length)],
        text: newComment,
        date: 'Ahora',
        replies: [],
      },
    ]);
    setNewComment('');
  };

  const handleAddReply = (parentId: number) => {
    if (!replyText.trim()) {
      console.log('Add Reply: Empty reply text');
      return;
    }
    console.log(`Add Reply to Comment ID ${parentId}:`, replyText);
    setComments(comments =>
      comments.map(comment =>
        comment.id === parentId
          ? {
            ...comment,
            replies: [
              ...(comment.replies || []),
              {
                id: Date.now(),
                user: 'Tú',
                avatar: avatarList[Math.floor(Math.random() * avatarList.length)],
                text: replyText,
                date: 'Ahora',
              },
            ],
          }
          : comment
      )
    );
    setReplyTo(null);
    setReplyText('');
  };

  const renderReplies = (replies?: Comment[]) =>
    replies?.map(reply => (
      <div key={reply.id} className={styles.reply}>
        <img src={reply.avatar} alt={reply.user} className={styles.avatarSmall} />
        <div>
          <span className={styles.user}>{reply.user}</span>
          <span className={styles.date}>{reply.date}</span>
          <p className={styles.text}>{reply.text}</p>
        </div>
      </div>
    ));

  return (
    <div className={styles.commentsContainer}>
      <button className={styles.iconBtn} onClick={() => { console.log('Toggle Comments'); setOpen(!open); }}>
        <i className="bi bi-chat-dots"></i>
        <span className={styles.counter}>{comments.length}</span>
      </button>
      {open && (
        <div className={styles.accordion}>
          <div className={styles.addCommentRow}>
            <img src={avatarList[0]} alt="avatar" className={styles.avatarSmall} />
            <input
              type="text"
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={e => { console.log('New Comment Input:', e.target.value); setNewComment(e.target.value); }}
              className={styles.input}
              onKeyDown={e => e.key === 'Enter' && handleAddComment()}
            />
            <button className={styles.sendBtn} onClick={handleAddComment}>
              <i className="bi bi-send"></i>
            </button>
          </div>
          <div className={styles.commentsList}>
            {comments.length === 0 && (
              <div className={styles.noComments}>Sin comentarios aún.</div>
            )}
            {comments.map(comment => (
              <div key={comment.id} className={styles.comment}>
                <img src={comment.avatar} alt={comment.user} className={styles.avatarSmall} />
                <div className={styles.commentBody}>
                  <div className={styles.commentHeader}>
                    <span className={styles.user}>{comment.user}</span>
                    <span className={styles.date}>{comment.date}</span>
                  </div>
                  <div className={styles.commentText}>{comment.text}</div>
                  <div className={styles.actionsRow}>
                    <button
                      className={styles.replyBtn}
                      onClick={() => { console.log('Toggle Reply Input for Comment ID', comment.id); setReplyTo(replyTo === comment.id ? null : comment.id); }}
                    >
                      <i className="bi bi-reply"></i>
                    </button>
                  </div>
                  {replyTo === comment.id && (
                    <div className={styles.replyInputRow}>
                      <input
                        type="text"
                        placeholder="Responder..."
                        value={replyText}
                        onChange={e => { console.log('Reply Input for Comment ID', comment.id, ':', e.target.value); setReplyText(e.target.value); }}
                        className={styles.input}
                        onKeyDown={e => e.key === 'Enter' && handleAddReply(comment.id)}
                      />
                      <button
                        className={styles.sendBtn}
                        onClick={() => handleAddReply(comment.id)}
                      >
                        <i className="bi bi-send"></i>
                      </button>
                    </div>
                  )}
                  {renderReplies(comment.replies)}
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