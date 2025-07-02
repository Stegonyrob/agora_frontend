import { IPostDTO } from "@/core/posts/IPostDTO";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

import DOMPurify from "dompurify";
import { useSelector } from "react-redux";
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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [date, setDate] = useState("");

  // Cargar datos del post cuando se abre el modal
  useEffect(() => {
    if (post && show) {
      setTitle(post.title || "");
      setMessage(post.message || "");


      // Formatear la fecha para el input type="date"
      if (post.createdAt) {
        const formattedDate = new Date(post.createdAt).toISOString().split('T')[0];
        setDate(formattedDate);
      }

      // Cargar imágenes existentes
      setExistingImages(post.images || []);
    }
  }, [post, show]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Sanitizar inputs
    const sanitizedTitle = DOMPurify.sanitize(title);
    const sanitizedMessage = DOMPurify.sanitize(message);

    if (!post || typeof post.id !== "number") {
      throw new Error("El post original debe tener un id válido.");
    }

    // Combinar imágenes existentes y nuevas del store
    const allImages = [
      ...existingImages,
      ...imagesState.images.map((img: any) => img.url)
    ];

    const updatedPost: IPostDTO = {
      ...post,
      id: post.id,
      title: sanitizedTitle,
      message: sanitizedMessage,
      createdAt: post.createdAt,
      images: allImages,
    };

    onSubmit(updatedPost);
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
        <Modal.Title>Formulario de Edición de los Post</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.titleLabel}>
              Título:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.titleLabel}>
              Mensaje:
            </label>
            <textarea
              value={message.toString()}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className={styles.submitButtonContainer}>
            <Button type="submit" variant="primary">
              {post ? "Actualizar Post" : "Crear Post"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPostForm;