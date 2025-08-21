import React from 'react';
import { Modal } from 'react-bootstrap';
import { IPost } from '../../../../../../../core/posts/IPost';
import { usePostForm } from '../../../../../../../hooks/usePostForm';
import PostBasicFields from './components/PostBasicFields';
import PostFormActions from './components/PostFormActions';
import PostImageManager from './components/PostImageManager';
import PostTagsField from './components/PostTagsField';
import styles from './EventForm.module.scss'; // Usar los mismos estilos que eventos

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

  // Wrapper to adapt PostPayload to IPost if possible
  const handleSubmitWrapper = async (payload: any) => {
    // If payload already matches IPost, just forward
    // Otherwise, adapt as needed (add missing fields, etc.)
    await onSubmit({ ...payload, ...post });
  };

  const handleButtonSubmit = async () => {
    console.log("🚀 PostForm - Button submit triggered");
    await submitForm(handleSubmitWrapper, onClose);
  };

  return (
    <Modal
      size="lg"
      centered
      show={show}
      onHide={onClose}
      className={styles.eventForm} // Usar el mismo estilo que eventos
      style={{ zIndex: 10000 }}
      backdropClassName="custom-backdrop"
    >
      <Modal.Header className={styles.modalHeader} closeButton>
        <Modal.Title className={styles.modalTitle}>
          {post ? 'Editar Post' : 'Crear Nuevo Post'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <form>
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
            onSubmit={handleButtonSubmit}
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