import React from "react";
import { Modal } from "react-bootstrap";
import { IPost } from "../../../../../../../core/posts/IPost";
import { usePostForm } from "../../../../../../../hooks/usePostForm";
import PostBasicFields from "./components/PostBasicFields";

import PostFormActions from "./components/PostFormActions";
import PostImageManager from "./components/PostImageManager";
import PostTagsField from "./components/PostTagsField";
import styles from "./ModalForm.module.scss";

interface PostFormProps {
  post?: IPost;
  onClose: () => void;
  onSubmit: (post: IPost) => Promise<void>;
  show: boolean;
  userId?: number;
}

const PostForm: React.FC<PostFormProps> = React.memo(({
  post,
  onClose,
  onSubmit,
  show,
  userId
}) => {
  const {
    title, setTitle,
    message, setMessage,
    tags, setTags,
    imagePreviews,
    isSubmitting,
    globalError,
    handleImagesSelected,
    handleRemoveImage,
    submitForm
  } = usePostForm({ post: post, show, userId });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitForm(onSubmit, onClose);
  };

  return (
    <Modal size="lg" show={show} onHide={onClose} className={styles.modalForm} centered style={{ zIndex: 1055 }}>
      <Modal.Header closeButton>
        <Modal.Title>
          {post ? "✏️ Editar Post" : "🎉 Crear Nuevo Post"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          {globalError && <div className={styles.globalError}>{globalError}</div>}

          <PostBasicFields
            title={title}
            setTitle={setTitle}
            message={message}
            setMessage={setMessage}
          />


          <PostImageManager
            imagePreviews={imagePreviews}
            onImagesSelected={handleImagesSelected}
            onImageSelected={() => { }} // Fix: required prop
            onRemoveImage={(identifier) => handleRemoveImage(typeof identifier === 'number' ? identifier : Number(identifier))}
          />

          <PostTagsField
            tags={tags}
            setTags={setTags}
          />

          <PostFormActions
            isSubmitting={isSubmitting}
            post={post}
            onClose={onClose}
          />
        </form>
      </Modal.Body>
    </Modal>
  );
});

export default PostForm;