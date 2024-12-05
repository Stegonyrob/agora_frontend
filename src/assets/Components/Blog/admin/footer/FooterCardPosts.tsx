import React from "react";
import { Card } from "react-bootstrap";
import { IPost } from '../../../../../core/posts/IPost';
import AccordionComment from "../../comment/AccordionComment";
import ButtonComment from "../../comment/ButtonComent";
import styles from "./FooterCardPost.module.scss";



interface FooterPostsProps {
  user: number;
  onSelect: (post: IPost) => void;

  posts: IPost[];
  postId: number;

}

const FooterPosts: React.FC<FooterPostsProps> = ({ user, onSelect, posts, postId }) => {



  return (



    <Card className={styles.cardFooter}>
      <Card.Footer className={styles.cardFooter}>
        <span className={styles.socialIcons}>
          <i className="bi bi-heart" />
          {posts.length.toString()}
        </span>
        <ButtonComment postId={0} userId={user} counter={0} />
        <AccordionComment comments={[]} />
      </Card.Footer>
    </Card>
  );
}







export default FooterPosts;