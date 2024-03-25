import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

interface Post {
  id: string;
  title: string;
  message: string;
  creation_date: string;
  postname: string;
  user_id: string;
}

interface CardPostsProps {
  onSelect: (post: Post) => void;
  onDelete: (postId: string) => void;
  userId?: string;
}

const CardPosts: React.FC<CardPostsProps> = ({ onSelect, onDelete, userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container className="g-2" style={{ marginLeft:"-22rem", marginBottom:"5rem" }}>
      <Row>
        {posts.map((post) => (
          <Col key={post.id} xs={12} sm={6} md={4} lg={3}>
            <Card style={{ width: "18rem", marginBottom: "1rem" }}>
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.message}</Card.Text>
                <Button className="mt-2" variant="primary" onClick={() => onSelect(post)} style={{ marginRight: "0.5rem" }}>Editar</Button>
                <Button className="mt-2" variant="danger" onClick={() => onDelete(post.id)}>Borrar</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CardPosts;