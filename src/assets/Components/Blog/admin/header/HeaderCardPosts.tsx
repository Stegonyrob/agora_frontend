import React from "react";
import { Container, Row } from "react-bootstrap";
import Avatar from './Avatar';
import UserInfo from "./UserInfo";



interface HeaderPostsProps {
  userId: number;
  userName: string;
}

const HeaderPosts: React.FC<HeaderPostsProps> = ({ userId, userName }) => {
  return (
    <Container>
      <Row>
        <div>
          <Avatar userId={userId} userName={userName} source_avatar={""} alt_avatar={""} url_avatar={""} />
          <UserInfo userId={userId} userName={userName} time={""} location={""} />
        </div>
      </Row>
    </Container>
  );
};




export default HeaderPosts;
