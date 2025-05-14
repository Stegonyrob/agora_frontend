import React from "react";
import { Container, Row } from "react-bootstrap";
import { IPost } from "../../../../../core/posts/IPost";
import Avatar from '../../../Generals/Card/header/Avatar';
import InfoHeader from "../../../Generals/Card/header/InfoHeader";
import styles from "./HeaderCardPosts.module.scss";


interface HeaderPostsProps {
  userId: number;
  userName: string;
  post: IPost;
}

const HeaderPosts: React.FC<HeaderPostsProps> = ({ userId, userName, post }) => {
  console.log("HeaderPosts props", { userId, userName, post });
  return (
    <Container>
      <Row>
        <div className={styles.headerCardPosts}>
          <Avatar
            userName={userName}
            source={""}
            userId={0}
            alt_avatar={""}
            source_avatar={""}
            url_avatar={""}
          />
          <InfoHeader
            creatorId={Number(post.creatorId) ?? 0}
            creatorName={post.creatorName}
            time={
              post.createdAt &&
              (typeof post.createdAt === "string" || typeof post.createdAt === "number"
                ? new Date(post.createdAt).toString()
                : "")
            }
            location={post.location ?? ""}
          />
        </div>
      </Row>
    </Container>
  );
};




export default HeaderPosts;
