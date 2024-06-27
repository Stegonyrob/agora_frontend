import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import api from "../../../services/api";
import styles from "./CardPosts.module.scss";
import AccordionComment from "./Comment/AccordionComment";
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
  user: string;
}

const CardPosts: React.FC<CardPostsProps> = ({
  user,
  onSelect,
  onDelete,
  userId,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [commentCounter, setCommentCounter] = useState(0);
  const [tweetCounter, setTweetCounter] = useState(0);
  const [loveCounter, setLoveCounter] = useState(0);

  const commentHandler = () => {
    setCommentCounter((prevState) => prevState + 1);
  };
  const tweetHandler = () => {
    setTweetCounter((prevState) => prevState + 1);
  };
  const loveHandler = () => {
    setLoveCounter((prevState) => prevState + 1);
  };
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await api.fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error loading posts: ", error);
        alert("Post not found, sorry for the inconvenience");
      }
    };
    loadPosts();
  }, []);
  return (
    <Container>
      <Row>
        {posts.map((post) => (
          <Col key={post.id}>
            <Card className={styles.cardPost}>
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.message}</Card.Text>
              </Card.Body>
              <Card.Footer className={styles.cardFooter}>
                <span className="social-icons" style={{ width: "3rem" }}>
                  <i className="bi bi-pen" onClick={() => onSelect(post)} />{" "}
                </span>
                <ButtonComment postId={""} userId={undefined} />
                <span className="social-icons" style={{ width: "3rem" }}>
                  <i
                    className="bi bi-trash3"
                    onClick={() => onDelete(post.id)}
                  />{" "}
                </span>
              </Card.Footer>
              <AccordionComment comments={[]} />
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CardPosts;
