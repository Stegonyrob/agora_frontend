import { IPostDTO } from "@/core/posts/IPostDTO";
import { useEditPostForm } from "@/hooks/useEditPostForm";
import React from "react";
import { Modal } from "react-bootstrap";
import EditPostBasicFields from "./components/EditPostBasicFields";
import EditPostFormActions from "./components/EditPostFormActions";
import EditPostImageManager from "./components/EditPostImageManager";
import EditPostTagsField from "./components/EditPostTagsField";
import styles from "./EditModalForm.module.scss";

interface EditPostFormProps {
  post?: IPostDTO;
  onSubmit: (post: IPostDTO) => void;
  onClose: () => void;
  show: boolean;
}

const EditPostForm: React.FC<EditPostFormProps> = ({ post, onSubmit, onClose, show }) => {
  const {
    title,
    setTitle,
    message,
    setMessage,
    imagePreviews,
    tags,
    handleImagesSelected,
    handleRemoveImage,
    setTags,
    submitForm,
    isSubmitting,
    globalError
  } = useEditPostForm({ post, show });

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitForm(onSubmit, onClose);
  };

  return (
    <Modal
      size="lg"
      centered
      show={show}
      onHide={onClose}
      style={{ zIndex: 10000 }}
      backdropClassName="custom-backdrop"
    >
      <Modal.Header className={styles.modalHeader} closeButton>
        <Modal.Title>Editar Post</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <form onSubmit={handleFormSubmit}>
          <EditPostBasicFields
            title={title}
            setTitle={setTitle}
            message={message}
            setMessage={setMessage}
          />

          <EditPostImageManager
            imagePreviews={imagePreviews}
            onImagesSelected={handleImagesSelected}
            onRemoveImage={handleRemoveImage}
          />

          <EditPostTagsField
            tags={tags}
            setTags={setTags}
          />

          <EditPostFormActions
            onSubmit={() => { }}
            onCancel={onClose}
            isSubmitting={isSubmitting}
            globalError={globalError}
          />
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPostForm;