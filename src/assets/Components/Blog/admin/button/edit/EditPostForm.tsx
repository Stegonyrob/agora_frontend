import { IPostDTO } from "@/core/posts/IPostDTO";
import { useEditPostForm } from "@/hooks/useEditPostForm";
import React from "react";
import { Modal } from "react-bootstrap";
import ImagePreviewGrid from "../../images/ImagePreviewGrid";
import ImageUploadButton from "../../images/ImageUploadButton";
import EditPostBasicFields from "./components/EditPostBasicFields";
import EditPostFormActions from "./components/EditPostFormActions";
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

  // Adapter to convert PostPayload to IPostDTO before calling onSubmit
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const handleSubmit = (postPayload: any) => {
      // You should replace this with the actual conversion logic
      // For now, we assume post has all required fields
      onSubmit({ ...post, ...postPayload });
    };
    await submitForm(handleSubmit, onClose);
  };

  return (
    <Modal
      size="lg"
      centered
      show={show}
      onHide={onClose}
      className={styles.eventForm}
      style={{ zIndex: 10000 }}
      backdropClassName="custom-backdrop"
    >
      <Modal.Header className={styles.eventForm} closeButton>
        <Modal.Title className={styles.modalTitle}>Editar Post</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.eventForm}>
        <form onSubmit={handleFormSubmit}>
          <EditPostBasicFields
            title={title}
            setTitle={setTitle}
            message={message}
            setMessage={setMessage}
          />

          <div className={styles.imageSection}>
            <h3 className={styles.imageSectionTitle}>Gestión de Imágenes</h3>
            <div className={styles.newImagesUploadSection}>
              <h4 className={styles.subsectionTitle}>Seleccionar imágenes:</h4>
              <ImageUploadButton onImagesSelected={handleImagesSelected} />
              <small className={styles.helpText}>
                Las imágenes existentes se muestran con el badge "Existente". Puedes eliminar cualquier imagen antes de guardar.
              </small>
            </div>
            <ImagePreviewGrid
              imagePreviews={imagePreviews}
              onRemoveImage={handleRemoveImage}

            />
          </div>

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