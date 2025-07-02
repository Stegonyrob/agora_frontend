import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { IPost } from '../../../../../../../core/posts/IPost';
import { IPostDTO } from '../../../../../../../core/posts/IPostDTO';
import PostService from '../../../../../../../core/posts/PostService';
import { RootState } from '../../../../../../../redux/store';
import TagSelector from '../../../tags/TagSelector';
import ButtonAddImage from '../../image/ButtonAddImage';
import styles from './PostForm.module.scss';
interface PostFormProps {
  post?: IPost;
  onClose: () => void;
  onSubmit: (post: IPost) => Promise<void>;
  show: boolean;
  userId: number;
  userName: string;
}

const PostForm: React.FC<PostFormProps> = ({ post, onClose, onSubmit, show }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [message, setMessage] = useState(post?.message || '');
  const [images, setImages] = useState<string[]>(post?.images || []);
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const role = useSelector((state: RootState) => state.session.role);
  const isAuthenticated = useSelector((state: RootState) => state.session.isLoggedIn);
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  const apiPost = new PostService();

  // Maneja la selección de imágenes desde ButtonAddImage
  const handleImageSelected = (imageSrc: string, imageTitle: string) => {
    setImages((prev) => [...prev, imageSrc]);
  };

  // Elimina una imagen del array
  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title || !message) {
      alert('Título y mensaje son campos obligatorios.');
      return;
    }

    const newPost: IPostDTO = {
      id: post?.id || 0,
      userName: post?.userName || '',
      title,
      message,
      location: '',
      loves: 0,
      comments: [],
      isArchived: false,
      tags: tags,
      images: images,
      isPublished: false,
      alt_image: '',
      source_image: '',
      alt_avatar: '',
      source_avatar: '',
      userId: post?.userId || 0,
      role: '',
      url_avatar: '',
      updatedAt: '',
      createdAt: '',
      description: ''
    };

    if (isAuthenticated) {
      newPost.userId = role === 'admin' ? 0 : 1;
      newPost.userName = role === 'admin' ? 'admin' : 'user';
      newPost.role = role === 'admin' ? 'admin' : 'user';
      newPost.url_avatar = role === 'admin' ? 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon' : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm';
    }

    if (post) {

    };

    try {
      await apiPost.createPost(newPost);
      alert('Post creado con éxito.');
      onClose();
      setTitle('');
      setMessage('');
      setImages([]);
      setTags([]);
    } catch (error) {
      console.error('Error al crear el post:', error);
      alert(`No se pudo crear el post: ${error instanceof Error ? error.message : 'Error desconocido'}. Inténtelo de nuevo más tarde.`);
    }
  };

  return (
    <Modal dark size="lg" show={show} onHide={onClose} className={styles.postForm}>
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

          <ButtonAddImage onImageSelected={handleImageSelected} />

          <div className={styles.imagePreviewContainer}>
            {images.map((img, idx) => (
              <div key={idx} className={styles.imagePreview}>
                <img src={img} alt={`preview-${idx}`} width={80} />
                <button type="button" onClick={() => handleRemoveImage(idx)}>Eliminar</button>
              </div>
            ))}
          </div>

          <TagSelector
            selectedTags={tags}
            onTagsChange={setTags}
            placeholder="Agregar tags para el post..."
          />

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