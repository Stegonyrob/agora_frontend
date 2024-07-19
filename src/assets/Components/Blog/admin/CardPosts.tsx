import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { IPost } from "../../../../core/posts/IPost";
import PostsService from "../../../../core/posts/PostService";
import { RootState } from "../../../../redux/store";
import AccordionComment from "../Comment/AccordionComment";
import ButtonComment from "../Comment/ButtonComent";
import styles from "./CardPosts.module.scss";



interface CardPostsProps {
  user: string;
  onSelect: (post: IPost) => void;
  onDelete: (postId: string) => Promise<void>;
  posts: IPost[];
}

const CardPosts: React.FC<CardPostsProps> = ({ user, onSelect, onDelete }) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const role = useSelector((state: RootState) => state.user.userRole);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const apiPost = new PostsService();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [commentCounter, setCommentCounter] = useState(0);

  const commentHandler = () => {
    setCommentCounter(commentCounter + 1);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [isAuthenticated,]);

  const loadPosts = async () => {
    try {
      const fetchedPosts = await apiPost.fetchPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error loading posts: ", error);
      alert("Post not found, sorry for the inconvenience");
    }
  };

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
                <ButtonComment postId={post.id} userId={parseInt(user, 10)} />
                <span className="social-icons" style={{ width: "3rem" }}>
                  <i
                    className="bi bi-trash3"
                    onClick={() => onDelete(post.id.toString())}
                  />
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