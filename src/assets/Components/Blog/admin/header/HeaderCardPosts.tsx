import React from "react";
import { Container, Row } from "react-bootstrap";
import { IPost } from "../../../../../core/posts/IPost";
import Avatar from './Avatar';
import styles from "./HeaderCardPosts.module.scss";
import PostInfo from "./PostInfo";


interface HeaderPostsProps {
  userId: number;
  userName: string;
  post: IPost;
}

const HeaderPosts: React.FC<HeaderPostsProps> = ({ userId, userName, post }) => {
  return (
    <Container>
      <Row>
        <div className={styles.headerCardPosts}>
          <Avatar userName={userName} source={""} alt={""} url={""} userId={0} />
          <PostInfo creatorId={post.creatorId} creatorName={post.creatorName} time={post.createdAt} location={post.location} />
        </div></Row>
    </Container>
  );
};




export default HeaderPosts;
