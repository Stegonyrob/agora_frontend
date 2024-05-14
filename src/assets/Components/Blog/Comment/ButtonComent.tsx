import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { IReply } from "../../../../core/replies/IReply";
import { ReplyRepository } from '../../../../core/replies/ReplyRepository';
import styles from './ButtonComent.module.scss';
interface Post {
  id: string;
}

interface ButtonCommentProps {
  onSelect: (postId: string) => void;
  post: Post;
  userName: string; 
  className?: string; 
}
//para alacarame manda el reply pero va null debo revisar modelo controler y service en back
//recuerda solucionar esto 

const ButtonComment: React.FC<ButtonCommentProps> = ({ post, userName, className }) => {
  const [show, setShow] = useState(false);
  const replyRepository = new ReplyRepository(); 
  const [commentCounter, setCommentCounter] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const buttonClass = className || 'default-class-name';
  const commentHandler = () => {
    setCommentCounter(prevState => prevState + 1);
  };
  const handleSaveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const textareaValue = form.elements.namedItem('exampleForm.ControlTextarea1') as HTMLTextAreaElement;
  
    const commentData: IReply = {
      user_id: "user_id_here",
      reply_message: textareaValue.value,
      creation_date: new Date().toISOString(),
      reply_id: "reply_id_here",
      post_id: post.id,
      postId: "",
      comment: ""
    };
  
    try {
      await replyRepository.create(commentData);
      handleClose();
    } catch (error) {
      console.error('Error sending comment: ', error);
    }
      const commentHandler = () => {
    setCommentCounter(prevState => prevState + 1);
  };
  };
  return (
           <div className={styles.buttonWrapper}>
         <span className="social-icons" style={{ width: "30px" }}  onClick={handleShow}>
          <i className="bi bi-chat-text" onClick={commentHandler} />{" "}
                    {commentCounter}
        </span>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title> <p>{userName}</p> </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSaveChanges}>
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