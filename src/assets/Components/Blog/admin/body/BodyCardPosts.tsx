import React from "react";
import { Card } from "react-bootstrap";
import { IPost } from "../../../../../core/posts/IPost";
import styles from "./BodyCardPosts.module.scss";

import PropTypes from "prop-types";
import ImageBody from "../../../Blog/admin/body/ImageBody";


interface BodyPostsProps {
  posts: IPost;
  title: string;
  message: string;
  tags: string[];
}

const BodyPosts: React.FC<BodyPostsProps> = ({ posts }) => {
  console.log('BodyPosts');
  console.log('posts', posts);
  return (
    <Card className={styles.cardPost}>
      <Card.Body>
        <Card.Title>{posts.title}</Card.Title>
        <ImageBody post={posts} source={""} alt={""} />
        <Card.Text>{posts.message}</Card.Text>
      </Card.Body>
    </Card>
  );
};
BodyPosts.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

BodyPosts.defaultProps = {
  title: "Algo Pasó",
  message: "Bienvenidos a Ágora Centro Educativo de Apoyo Especializado",
};
export default BodyPosts;