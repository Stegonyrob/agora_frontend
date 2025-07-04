import React from 'react';
import { Modal } from 'react-bootstrap';
import { IPost } from '../../../../../../../core/posts/IPost';
import { usePostForm } from '../../../../../../../hooks/usePostForm';
import PostBasicFields from './components/PostBasicFields';
import PostFormActions from './components/PostFormActions';
import PostImageManager from './components/PostImageManager';
import PostTagsField from './components/PostTagsField';
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
  const {
    title,
    setTitle,
    message,
    setMessage,
    imagePreviews,
    tags,
    handleImagesSelected,
    handleImageSelected,
    handleRemoveImage,
    setTags,
    submitForm,
    isSubmitting,
    globalError
  } = usePostForm({ post, show });

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitForm(onSubmit, onClose);
  };

  return (
    <Modal size="lg" show={show} onHide={onClose} className={styles.postForm}>
      <Modal.Header className={styles.postForm} closeButton>
        <Modal.Title>{post ? 'Editar Post' : 'Crear Post'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.postForm}>
        <form onSubmit={handleFormSubmit}>
          <PostBasicFields
            title={title}
            setTitle={setTitle}
            message={message}
            setMessage={setMessage}
          />

          <PostImageManager
            imagePreviews={imagePreviews}
            onImagesSelected={handleImagesSelected}
            onImageSelected={handleImageSelected}
            onRemoveImage={handleRemoveImage}
          />

          <PostTagsField
            tags={tags}
            setTags={setTags}
          />

          <PostFormActions
            onSubmit={() => { }}
            onCancel={onClose}
            isSubmitting={isSubmitting}
            globalError={globalError}
            isEditMode={!!post}
          />
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default PostForm;