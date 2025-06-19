import { IPostDTO } from "@/core/posts/IPostDTO";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import { useSelector } from "react-redux";
import ImageUploadInline from "../../images/ImageUploadInline";
import styles from "./EditModalForm.module.scss";

interface EditPostFormProps {
  post?: IPostDTO;
  onSubmit: (post: IPostDTO) => void;
  onClose: () => void;
  show: boolean;
}

const EditPostForm = ({ post, onSubmit, onClose, show }: EditPostFormProps) => {
  const [title, setTitle] = useState(post?.title || "");
  const [message, setMessage] = useState(post?.message || "");
  const imagesState = useSelector((state: any) => state.images);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newPost: IPostDTO = {
      id: post?.id ?? 0,
      title,
      message,
      userId: post?.userId ?? 0,
      location: post?.location ?? "",
      loves: post?.loves ?? 0,
      comments: post?.comments ?? [],
      isArchived: post?.isArchived ?? false,
      tags: post?.tags ?? [],
      images: imagesState.images.map((img: any) => img.url),
      isPublished: post?.isPublished ?? false,
      alt_image: post?.alt_image ?? "",
      source_image: post?.source_image ?? "",
      alt_avatar: post?.alt_avatar ?? "",
      source_avatar: post?.source_avatar ?? "",
      userName: post?.userName ?? "",
      role: post?.role ?? "",
      url_avatar: post?.url_avatar ?? "",
      updatedAt: post?.updatedAt ?? "",
      createdAt: post?.createdAt ?? "",
      description: post?.description ?? "",
    };
    onSubmit(newPost);
  };

  return (
    <div className={styles.Container}>
      <Modal size="lg" centered show={show} onHide={onClose} className={styles.modalCard}>
        <Modal.Header className={styles.modalHeader} closeButton>
          <Modal.Title>Editar Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <label>
              Título:
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </label>
            <br />
            <label>
              Mensaje:
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </label>
            <br />
            <label>
              Imágenes:
              <ImageUploadInline />
            </label>
            <Button type="submit" variant="primary">
              {post ? "Actualizar Post" : "Crear Post"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditPostForm;