import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { IPost } from '../../../../../../../core/posts/IPost';
import { IPostDTO } from '../../../../../../../core/posts/IPostDTO';
import PostService from '../../../../../../../core/posts/PostService';
import { RootState } from '../../../../../../../redux/store';
import styles from './PostForm.module.scss';

interface PostFormProps {
  post?: IPost;
  onClose: () => void;
  onSubmit: (post: IPost) => Promise<void>;
  show: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ post, onClose, onSubmit, show }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [message, setMessage] = useState(post?.message || '');
  const role = useSelector((state: RootState) => state.login.loggedUserRole);
  const isAuthenticated = useSelector((state: RootState) => state.login.isLoggedIn);

  const apiPost = new PostService();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newPost: IPostDTO = {
      id: post ? post.id : 0, // Si es un nuevo post, el ID será 0
      creation_date: new Date(),
      userId: 0, // Ajusta según tu lógica
      title,
      message,
      location: '',
      loves: 0,
      comments: [],
      isArchived: false,
      tags: [],
      images: [],
      isPublished: false,
      publishDate: '',
      alt_image: '',
      source_image: '',
      alt_avatar: '',
      source_avatar: '',
      username: '',
      role: '',
      url_avatar: ''
    };

    try {
      if (!newPost.title || !newPost.message) {
        throw new Error('Título y mensaje son campos obligatorios.');
      }

      await apiPost.createPost(newPost);
      alert(`Post creado con éxito.`);
      onClose(); // Cierra el modal después de crear
    } catch (error) {
      console.error('Error al crear el post:', error);
      if (error instanceof Error) {
        alert(`No se pudo crear el post: ${error.message}. Inténtelo de nuevo más tarde.`);
      }
    }
  };

  return (
    <Modal show={show} onHide={onClose} className={styles.postForm}>
      <Modal.Header className={styles.postForm} closeButton>
        <Modal.Title>{post ? 'Editar Post' : 'Crear Post'}</Modal.Title>
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
  );
};

export default PostForm;