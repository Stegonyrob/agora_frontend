import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { PostDTO } from '../../../../dto/post.dto';
import { RootState } from '../../../../redux/store';
import apiPost from '../../../../services/posts.api';
import { Post } from '../../../../types/types';
import styles from './PostForm.module.scss';

interface PostFormProps {
  post?: Post | null;
  onSubmit: (post: Post) => Promise<void>;
  onClose: () => void;
}


const PostForm: React.FC<PostFormProps> = ({ post, onClose }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [message, setMessage] = useState(post?.message || '');
  const [show, setShow] = useState(false);
  const role = useSelector((state: RootState) => state.auth.role);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  console.log(role, isAuthenticated)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const newPostDTO = new PostDTO(title, message, new Date().toISOString());
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (role === "ADMIN" && isAuthenticated) {
      try {
        const response = await apiPost.createPost(newPostDTO, role, isAuthenticated);


        console.log(role)
        console.log(isAuthenticated)
        console.log(response)
        alert("Post creado con éxito.");
        handleClose();
        return response;
      } catch (error) {
        console.error("Error al crear el post:", error);
        alert("No se pudo crear el post, por favor intentelo más tarde, y disculpe las molestias.");
        throw error;
      }
    } else {
      alert("Solo el admin puede crear posts.");
      console.log(role)
      console.log(isAuthenticated)
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {post ? "Actualizar Post" : "Crear Post"}
      </Button>

      <Modal show={show} onHide={handleClose} className={styles.postForm}>
        <Modal.Header className={styles.postForm} closeButton>
          <Modal.Title>Nuevo Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.postForm}>
          <form onSubmit={handleSubmit}>
            <label>
              Título:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Mensaje:
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </label>
            <br />
            <Button type="submit" variant="primary">
              {post ? "Actualizar Post" : "Crear Post"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PostForm;

