import React from "react";
import { Container, Row } from "react-bootstrap";
import Avatar from './Avatar';
import styles from "./HeaderCardPosts.module.scss";
import UserInfo from "./UserInfo";


interface HeaderPostsProps {
  userId: number;
  userName: string;
}

const HeaderPosts: React.FC<HeaderPostsProps> = ({ userId, userName }) => {
  return (
    <Container>
      <Row>
        <div className={styles.headerCardPosts}>
          <Avatar userName={userName} source={""} alt={""} url={""} userId={0} />
          <UserInfo time="" location="" userId={0} userName={userName} loggedUserName={""} />
        </div>
      </Row>
    </Container>
  );
};




export default HeaderPosts;
