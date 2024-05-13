import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Post } from 'types';
import styles from './EditPostForm.module.scss';

interface EditPostFormProps {
  post: Post;
  onSubmit: (post: Post) => Promise<void>;
  onClose: () => void;
  show: boolean;
}

const EditPostForm = ({ post, onSubmit, onClose, show }: EditPostFormProps) => {
  const [title, setTitle] = useState(post?.title || '');
  const [message, setMessage] = useState(post?.message || '');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newPost = {
      id: post?.id || "default-id",
      title: title,
      message: message,
      creation_date: post?.creation_date || "default-date",
      postname: post?.postname || "default-postname",
      user_id: post?.user_id || "default-user-id",
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
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
          <br />
          <Button type="submit" variant="primary">{post? 'Actualizar Post' : 'Crear Post'}</Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPostForm;