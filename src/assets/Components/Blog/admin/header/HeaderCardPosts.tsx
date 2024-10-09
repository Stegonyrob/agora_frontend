import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { IPost } from "../../../../../core/posts/IPost";
import PostsService from "../../../../../core/posts/PostService";
import { RootState } from "../../../../../redux/store";
import Avatar from './Avatar';
import styles from "./HeaderCardPosts.module.scss";
import UserInfo from "./UserInfo";



interface HeaderPostsProps {
  user: number;
  onSelect: (post: IPost) => void;
  onDelete: (postId: string) => Promise<void>;
  posts: IPost[];
  role: string;
}

const HeaderPosts: React.FC<HeaderPostsProps> = ({ user, onSelect, onDelete, posts }) => {
  const accessToken = useSelector((state: RootState) => state.login.accessToken);
  const role = useSelector((state: RootState) => state.user.userRole);
  const isAuthenticated = useSelector((state: RootState) => state.login.isLoggedIn);
  const apiPost = new PostsService();



  return (
    <Container>
      <Row>
        {posts.map((post) => (
          <Col key={post.id}>
            <Card className={styles.cardPost}>
              <Avatar url_avatar={post.source_avatar} source_avatar={post.alt_avatar} userId={post.userId as number} alt_avatar={post.alt_avatar} />
              <UserInfo userId={post.userId as number}
                username={post.username}
                time={typeof post.creation_date === 'string' ? new Date(post.creation_date).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                }) : ''}
                location={post.location}
              /> </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};


export default HeaderPosts;
