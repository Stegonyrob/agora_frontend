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
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  const apiPost = new PostService();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title || !message) {
      alert('Título y mensaje son campos obligatorios.');
      return;
    }

    const newPost: IPostDTO = {
      id: post?.id || 0,
      creationDate: new Date(),
      userId: 1,
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
      await apiPost.createPost(newPost);
      alert('Post creado con éxito.');
      onClose();
      setTitle('');
      setMessage('');
    } catch (error) {
      console.error('Error al crear el post:', error);
      alert(`No se pudo crear el post: ${error instanceof Error ? error.message : 'Error desconocido'}. Inténtelo de nuevo más tarde.`);
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