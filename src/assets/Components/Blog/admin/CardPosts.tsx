import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { IPost } from "../../../../core/posts/IPost";
import BodyPosts from "./body/BodyCardPosts";
import styles from "./CardPosts.module.scss";
import FooterPosts from "./footer/FooterCardPosts";
import HeaderPosts from './header/HeaderCardPosts';



interface CardPostsProps {
  user: number;
  onSelect: (post: IPost) => void;
  onDelete: (postId: string) => Promise<void>;
  posts: IPost[];
  role: string;
  userName: string;
}


const CardPosts: React.FC<CardPostsProps> = ({ user, onSelect, onDelete, posts }) => {
  console.log("CardPosts props: ", { user, onSelect, onDelete });
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [postsState, setPostsState] = useState<IPost[]>([]);
  const [commentCounter, setCommentCounter] = useState(0);
  const [tweetCounter, setTweetCounter] = useState(0);
  const [loveCounter, setLoveCounter] = useState(0);

  console.log("CardPosts state: ", {
    selectedPost,
    show,
    posts,
    commentCounter,
    tweetCounter,
    loveCounter,
  });

  const commentHandler = () => {
    console.log("Comment handler called");
    setCommentCounter((prevState) => {
      console.log("Comment counter: ", prevState);
      return prevState + 1;
    });
  };
  const tweetHandler = () => {
    console.log("Tweet handler called");
    setTweetCounter((prevState) => {
      console.log("Tweet counter: ", prevState);
      return prevState + 1;
    });
  };
  const loveHandler = () => {
    console.log("Love handler called");
    setLoveCounter((prevState) => {
      console.log("Love counter: ", prevState);
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
              <HeaderPosts userId={user} userName={""} />
              <BodyPosts posts={post} title={""} message={""} tags={[]} />
              <FooterPosts user={user} onSelect={onSelect} onDelete={onDelete} posts={posts} role={""} />
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CardPosts;