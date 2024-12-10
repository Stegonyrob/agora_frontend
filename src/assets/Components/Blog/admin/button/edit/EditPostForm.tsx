import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { IPostDTO } from '../../../../../../core/posts/IPostDTO';
import styles from './EditModalForm.module.scss';

interface EditPostFormProps {
  post?: IPostDTO;
  onSubmit: (post: IPostDTO) => void;
  onClose: () => void;
  show: boolean;
}

const EditPostForm = ({ post, onSubmit, onClose, show }: EditPostFormProps) => {
  const [title, setTitle] = useState(post?.title || '');
  const [message, setMessage] = useState(post?.message || '');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newPost: IPostDTO = {
      id: Number(post?.id) || 0,
      title: title,
      message: message,
      creatorId: post?.creatorId || 0,
      location: '',
      loves: 0,
      comments: [],
      isArchived: false,
      tags: [],
      alt_image: '',
      source_image: '',
      alt_avatar: '',
      source_avatar: '',
      creatorName: '',
      role: '',
      url_avatar: '',
      images: [],
      isPublished: false,
      createdAt: '',

    };
    onSubmit(newPost);
  };

  return (
    <div className={styles.modalContainer}>
      <Modal show={show} onHide={onClose} className={styles.modalCard}>

        <Modal.Header className={styles.modalHeader} closeButton>
          <Modal.Title >Formulario de Edición de los Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
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
    </div>
  );
};

export default EditPostForm;