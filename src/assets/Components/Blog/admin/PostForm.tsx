import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import api from "../../../../services/posts.api";
import { Post } from '../../../../types/types';
import styles from './PostForm.module.scss';

interface PostFormProps {
  post?: Post | null;
  onSubmit: (post: Post) => Promise<void>;
  onClose: () => void;
}


const PostForm: React.FC<PostFormProps> = ({ post, onClose }) => {
  const [title, setTitle] = useState(post ? post.title : '');
  const [message, setMessage] = useState(post ? post.message : '');
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newPost: { title: string; message: string; creationDate?: string } = {
      title: title,
      message: message,
      creationDate: new Date().toISOString(),
    };

    console.log('Enviando este post al backend:', newPost);

    try {
      await api.createPost(newPost);
      alert(`Post creado con exito.`);
      handleClose();
    } catch (error) {
      console.error('Error al crear el post:', error);
      alert(`No se pudo crear el post, por favor intentelo más tarde, y disculpe las molestias.`);
    }
  };



  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {post ? 'Actualizar Post' : 'Crear Post'}
      </Button>

      <Modal show={show} onHide={handleClose} className={styles.postForm}>
        <Modal.Header className={styles.postForm} closeButton>
          <Modal.Title>Nuevo Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.postForm}>
          <form onSubmit={handleSubmit}>
            <label>
              Título:
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <br />
            <label>
              Mensaje:
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
            </label>
            <br />
            <Button type="submit" variant="primary">
              {post ? 'Actualizar Post' : 'Crear Post'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PostForm;
