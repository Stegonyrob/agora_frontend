import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

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
    <div>
      {posts.map((post) => (
        <Card key={post.id} style={{ width: "18rem", marginBottom: "1rem" }}>
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <Card.Text>{post.message}</Card.Text>
            <Button variant="primary" onClick={() => onSelect(post)}>Editar</Button>
            <Button variant="danger" onClick={() => onDelete(post.id)}>Borrar</Button>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>Creado el: {post.creation_date}</ListGroup.Item>
            <ListGroup.Item>Nombre del post: {post.postname}</ListGroup.Item>
            <ListGroup.Item>Autor/a: {post.user_id}</ListGroup.Item>
          </ListGroup>
        </Card>
      ))}
    </div>
  );
};

export default CardPosts;