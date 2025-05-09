import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

import { IPost } from "../../../../core/posts/IPost";

import { ISession } from "../../../../core/auth/ISession";
import styles from "./CardPosts.module.scss";
import FooterPosts from "./footer/FooterCardPosts";
import HeaderPosts from "./header/HeaderCardPosts";

interface CardPostsProps {
  userId: number;
  onSelect: (post: IPost) => void;
  posts: IPost[];
  session: ISession[];
  id: number;
  isEvent?: boolean;
}

const CardPosts: React.FC<CardPostsProps> = ({
  onSelect,
  posts,
  id,
  isEvent = false,
}) => {
  const post: IPost | undefined = posts.find((post) => post.id === id);
  if (!post) {
    throw new Error(`No se encontr  un post con id ${id}`);
  }

  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [postsState, setPostsState] = useState<IPost[]>([]);
  const [loveCounter, setLoveCounter] = useState(0); // Solo corazones para eventos
  const userId = Number(sessionStorage.getItem("userId"));
  const userName = sessionStorage.getItem("userName");
  const userRole = sessionStorage.getItem("role");
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  if (!userId || !userName || !userRole || typeof isLoggedIn !== "boolean") {
    throw new Error("No se han encontrado los datos de la sesi n en localStorage");
  }

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
          <Col key={post.id}>
            <Card className={isEvent ? styles.cardEvent : styles.cardPost}>
              <HeaderPosts userId={userId} userName={userName} post={post} />
              <Card.Img
                variant="top"
                src={typeof post.image === "string" ? post.image : ""}
                className={isEvent ? styles.largeImage : styles.smallImage}
              />
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>
                  {isEvent ? (typeof post.description === "string" ? post.description.slice(0, 200) : "") : (typeof post.description === "string" ? post.description : "")}
                </Card.Text>
              </Card.Body>
              <FooterPosts
                userId={userId}
                onSelect={onSelect}
                posts={posts}
                postId={post.id}
                showComments={!isEvent}
                onLove={loveHandler}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CardPosts;