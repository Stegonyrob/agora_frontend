import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { IPost } from '../../../../core/posts/IPost';
import { IPostDTO } from '../../../../core/posts/IPostDTO';
import PostService from '../../../../core/posts/PostService';
import { RootState } from '../../../../redux/store';
import styles from './PostForm.module.scss';

interface PostFormProps {
  post?: IPost;
  onClose: () => void;
  onSubmit: (post: IPost) => Promise<void>;

  show: boolean;

}


const PostForm: React.FC<PostFormProps> = ({ post, onClose }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [message, setMessage] = useState(post?.message || '');
  const [show, setShow] = useState(false);
  const role = useSelector((state: RootState) => state.login.loggedUserRole);
  const isAuthenticated = useSelector((state: RootState) => state.login.isLoggedIn);


  console.log(role, isAuthenticated)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const apiPost = new PostService();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newPost: IPostDTO = {
      id: 0,
      creation_date: new Date().toISOString(),
      postname: "New Post",
      userId: 0,
      title: title,
      message: message,
    };

    console.log('Enviando este post al backend:', newPost);

    try {
      if (!newPost.title || !newPost.message) {
        throw new Error('Título y mensaje son campos obligatorios.');
      }

      await apiPost.createPost(newPost);
      alert(`Post creado con exito.`);
      handleClose();
    } catch (error) {
      console.error('Error al crear el post:', error);
      if (error instanceof Error) {
        alert(`No se pudo crear el post: ${error.message}. Inténtelo de nuevo más tarde. Disculpe las molestias.`);
      }
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
              <textarea value={message.toString()} onChange={(e) => setMessage(e.target.value)} required />
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