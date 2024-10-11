import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { ISession } from "../../../../core/auth/ISession";
import { IPost } from "../../../../core/posts/IPost";
import BodyPosts from "./body/BodyCardPosts";
import styles from "./CardPosts.module.scss";
import FooterPosts from "./footer/FooterCardPosts";
import HeaderPosts from "./header/HeaderCardPosts";

interface CardPostsProps {
  user: number;
  onSelect: (post: IPost) => void;
  onDelete: (postId: number) => Promise<void>;
  posts: IPost[];
  onArchive: (postId: number) => Promise<void>;
  session: ISession[];
}

const CardPosts: React.FC<CardPostsProps> = ({
  user,
  onSelect,
  onDelete,
  posts,
  onArchive,
}) => {

  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [postsState, setPostsState] = useState<IPost[]>([]);
  const [commentCounter, setCommentCounter] = useState(0);
  const [tweetCounter, setTweetCounter] = useState(0);
  const [loveCounter, setLoveCounter] = useState(0);
  const userId = sessionStorage.userId;
  const userName = sessionStorage.userName;
  const userRole = sessionStorage.role;
  const isLoggedIn = sessionStorage.isLoggedIn;

  const commentHandler = () => {
    setCommentCounter((prevState) => {
      return prevState + 1;
    });
  };
  const tweetHandler = () => {
    setTweetCounter((prevState) => {
      return prevState + 1;
    });
  };
  const loveHandler = () => {
    setLoveCounter((prevState) => {
      return prevState + 1;
    });
  };

  useEffect(() => {
    setPostsState(posts);
  }, [posts]);

  return (
    <Container>
      <Row>
        {posts.map((post) => (
          <Col key={post.postId}>
            <Card className={styles.cardPost}>
              <HeaderPosts userId={userId} userName={userName} />
              <BodyPosts posts={post} title={""} message={""} tags={[]} />
              <FooterPosts
                user={user}
                onSelect={onSelect}
                onDelete={onDelete}
                posts={posts}
                onArchive={(postId) => Promise.resolve()}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CardPosts;
