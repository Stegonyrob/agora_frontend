import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import apiPost from "../../../../services/posts.api";
import AccordionComment from "../Comment/AccordionComment";
import ButtonComment from "../Comment/ButtonComent";
import styles from "./CardPosts.module.scss";

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
  onDelete: (postId: string) => Promise<void>;
  user: string;
}

const CardPosts: React.FC<CardPostsProps> = ({
  user,
  onSelect,
  onDelete,
}) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentCounter, setCommentCounter] = useState(0);
  const role = useSelector((state: RootState) => state.user.userRole);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const commentHandler = () => {
    setCommentCounter(commentCounter + 1);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const loadPosts = async () => {
        try {
          const fetchedPosts = await apiPost.fetchPosts(accessToken);
          setPosts(fetchedPosts);
        } catch (error) {
          console.error("Error loading posts: ", error);
          alert("Post not found, sorry for the inconvenience");
        }
      };
      loadPosts();
    }
  }, [isAuthenticated, accessToken]);

  return (
    <Container>
      <Row>
        {Array.isArray(posts) && posts.map((post) => (
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
                <ButtonComment postId={post.id} userId={user} />
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