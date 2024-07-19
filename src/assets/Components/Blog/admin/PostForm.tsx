import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import PostService from '../../../../core/posts/PostService';
import { RootState } from '../../../../redux/store';

import { IPost } from '../../../../core/posts/IPost';
import { IPostDTO } from '../../../../core/posts/IPostDTO';
import styles from './PostForm.module.scss';
interface PostFormProps {
  post?: IPost | null;
  onSubmit: (post: IPost) => Promise<void>;
  onClose: () => void;
  show: boolean;
  onCreate: (post: IPost) => void;
  onEdit: (post: IPost) => void;
  userId: number | null;
}


const PostForm: React.FC<PostFormProps> = ({ post, onClose }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [message, setMessage] = useState(post?.message || '');
  const [show, setShow] = useState(false);
  const roles = useSelector((state: RootState) => state.auth.role);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  console.log(roles, isAuthenticated)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const apiPost = new PostService();



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (roles !== "ADMIN" || !isAuthenticated) {
      alert("Solo el admin puede crear posts.");
      return;
    }

    try {
      const newPostDTO: IPostDTO = {
        title,
        message,
        creation_date: new Date().toISOString(),
        id: 0,
        postname: '',
        user_id: 0
      };

      const response = await apiPost.createPost(newPostDTO, roles);

      alert("Post creado con éxito.");
      handleClose();
    } catch (error) {
      console.error("Error al crear el post:", error);
      alert("No se pudo crear el post, por favor inténtelo más tarde, y disculpe las molestias.");
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
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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

