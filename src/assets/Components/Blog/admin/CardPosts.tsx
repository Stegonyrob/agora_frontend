import React, { useState } from "react";
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
}


const CardPosts: React.FC<CardPostsProps> = ({ user, onSelect, onDelete }) => {
  console.log("CardPosts props: ", { user, onSelect, onDelete });
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [commentCounter, setCommentCounter] = useState(0);
  const [tweetCounter, setTweetCounter] = useState(0);
  const [loveCounter, setLoveCounter] = useState(0);


  const commentHandler = () => {
    console.log("Comment handler called");
    setCommentCounter((prevState) => prevState + 1);
  };
  const tweetHandler = () => {
    console.log("Tweet handler called");
    setTweetCounter((prevState) => prevState + 1);
  };
  const loveHandler = () => {
    console.log("Love handler called");
    setLoveCounter((prevState) => prevState + 1);
  };





  return (
    <Container>
      <Row>
        {posts.map((post) => (
          <Col key={post.id}>
            <Card className={styles.cardPost}>
              <HeaderPosts user={user} onSelect={onSelect} onDelete={onDelete} posts={posts} role={""} />
              <BodyPosts posts={post} title={""} message={""} tags={""} />
              <FooterPosts user={user} onSelect={onSelect} onDelete={onDelete} posts={posts} role={""} />
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CardPosts;