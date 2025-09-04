import React from 'react';
import { Modal } from 'react-bootstrap';
import { IPost } from '../../../../../../../core/posts/IPost';
import { usePostForm } from '../../../../../../../hooks/usePostForm';
import PostBasicFields from './components/PostBasicFields';
import PostFormActions from './components/PostFormActions';
import PostImageManager from './components/PostImageManager';
import PostTagsField from './components/PostTagsField';
import styles from './ModalForm.module.scss'; // Usar los mismos estilos que eventos

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
    setTags,
    handleImagesSelected,
    handleRemoveImage,
    submitForm,
    isSubmitting,
    globalError
  } = usePostForm({ post, show });

  const handleSubmit = async () => {
    await submitForm(onSubmit, onClose);
  };

  return (
    <Modal
      size="lg"
      centered
      show={show}
      onHide={onClose}
      className={styles.modalForm}
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
            onImageSelected={() => { }}
            onRemoveImage={handleRemoveImage}
          />

          <PostTagsField
            tags={tags}
            setTags={setTags}
          />

          <PostFormActions
            onSubmit={handleSubmit}
            onCancel={onClose}
            onClose={onClose}
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