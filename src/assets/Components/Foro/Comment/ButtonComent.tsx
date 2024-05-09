import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import styles from './ButtonComent.module.scss';

interface Post {
  id: string;
}

interface ButtonCommentProps {
  onSelect: (postId: string) => void;
  post: Post;
  userName: string; 
}

const ButtonComment: React.FC<ButtonCommentProps> = ({ onSelect, post, userName }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container>
      <div className={styles.buttonWrapper}>
        <Button className={styles.button} variant="success" onClick={handleShow}>
          <i className="bi bi-chat-text"></i>
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>   <p>{userName}</p> </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Example textarea</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default ButtonComment;