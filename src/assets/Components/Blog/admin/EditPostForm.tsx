import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { IPost } from '../../../../core/posts/IPost';
import styles from './EditPostForm.module.scss';

interface EditPostFormProps {
  post: IPost;
  onSubmit: (post: IPost) => Promise<void>;
  onClose: () => void;
  show: boolean;
}

const EditPostForm = ({ post, onSubmit, onClose, show }: EditPostFormProps) => {
  const [title, setTitle] = useState(post?.title || '');
  const [message, setMessage] = useState(post?.message || '');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newPost: IPost = {
      postId: Number(post?.postId) || 0,
      title: title,
      message: message,
      creation_date: post?.creation_date || new Date(), // changed to Date type
      userId: post?.userId || 0, // changed to number type
      length: 0, // added missing property
      location: '', // added missing property
      loves: 0, // added missing property
      comments: [], // added missing property
      isArchived: false, // added missing property
      tags: [], // added missing property
      alt_image: '', // added missing property
      source_image: '', // added missing property
      alt_avatar: '', // added missing property
      source_avatar: '', // added missing property
      username: '', // added missing property
      role: '', // added missing property
      url_avatar: '', // added missing property
    };
    onSubmit(newPost);
  };

  return (
    <Modal show={show} onHide={onClose} className={styles.editPostForm}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <label>
            Título:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <br />
          <label>
            Mensaje:
            <textarea value={message.toString()} onChange={(e) => setMessage(e.target.value)} />
          </label>
          <br />
          <Button type="submit" variant="primary">{post ? 'Actualizar Post' : 'Crear Post'}</Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPostForm;