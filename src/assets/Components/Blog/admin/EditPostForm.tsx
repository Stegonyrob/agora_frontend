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
    const newPost = {
      id: Number(post?.id) || 0,
      title: title,
      message: message,
      creation_date: post?.creation_date || "default-date",
      postname: post?.postname || "default-postname",
      userId: post?.userId || "default-user-id",
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