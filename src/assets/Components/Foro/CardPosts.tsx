import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import api from '../../../services/api';
import styles from './CardPosts.module.scss';
import ButtonComment from "./Comment/ButtonComent";


interface Post {
  id: string;
  title: string;
  message: string;
  creation_date: string;
  postname: string;
  user_id: string;
}

interface CardPostsProps {
  posts: Post[];
  onSelect: (post: Post) => void;
  onDelete: (postId: string) => void;
  userId?: string;
}

const CardPosts: React.FC<CardPostsProps> = ({ onSelect, onDelete, userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
     const loadPosts = async () => {
       try {
         const fetchedPosts = await api.fetchPosts(); // Use the fetchPosts function from the api object
         setPosts(fetchedPosts);
       } catch (error) {
         console.error("Error loading posts: ", error);
         alert('Post no encontrado ,disculpa las molestias');
       }
     };
     loadPosts();
  }, []);


      return (
        <Container >
          <Row >
            {posts.map((post) => (
              <Col key={post.id} >
                   <Card className={styles.cardPost}>
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text>{post.message}</Card.Text>
          
           
            </Card.Body>
           <Card.Footer>
           <div className={styles.buttonWrapper}>
      
              <ButtonComment onSelect={function (postId: string): void {
                      throw new Error("Function not implemented.");
                    } } post={post} userName={""}/>
         
      
                <Button className={styles.button} variant="primary" onClick={() => onSelect(post)}>
                <i className="bi bi-pen"></i>
                </Button>
                <Button variant="danger" onClick={() => onDelete(post.id)}>
                <i className="bi bi-trash3"></i>
                </Button>
             
                </div>
           </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
  
  );
};

export default CardPosts;

