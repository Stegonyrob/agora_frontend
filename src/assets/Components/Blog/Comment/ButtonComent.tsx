import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { IReply } from "../../../../core/replies/IReply";
import { ReplyRepository } from '../../../../core/replies/ReplyRepository';
import styles from './ButtonComent.module.scss';

interface User {
  userId: string;
  username: string;
  role: string;

}

interface Post {
  id: string;
}
interface ButtonCommentProps {
  postId: string;
  userId: string | undefined;
  className?: string;
}


const ButtonComment: React.FC<ButtonCommentProps> = ({ postId, userId, className }) => {
  const [show, setShow] = useState(false);
  const replyRepository = new ReplyRepository();
  const [commentCounter, setCommentCounter] = useState(0);
  const [replyMessage, setReplyMessage] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const buttonClass = className || 'default-class-name';

  const handleSaveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Reply message:', replyMessage);
    if (userId) {
      const commentData: IReply = {
        user_id: userId,
        reply_message: replyMessage,
        creation_date: new Date().toISOString(),
        reply_id: "reply_id_here",
        post_id: postId,
        postId: "",
        comment: ""
      };

      try {
        await replyRepository.create(commentData);
        handleClose();
      } catch (error) {
        console.error('Error sending comment: ', error);
      }
    }
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyMessage(event.target.value);
  };

  return (
    <div className={styles.buttonWrapper}>
      <span className="social-icons" style={{ width: "30px" }} onClick={handleShow}>
        <i className="bi bi-chat-text" onClick={() => setCommentCounter(prevState => prevState + 1)} />{" "}
        {commentCounter}
      </span>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> <p>{userId && typeof userId === 'string' ? userId : 'Usuario Desconocido'}</p> </Modal.Title>  </Modal.Header>
        <Form onSubmit={handleSaveChanges}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Example textarea</Form.Label>
              <Form.Control as="textarea" rows={3} onChange={handleTextareaChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};



export default ButtonComment;