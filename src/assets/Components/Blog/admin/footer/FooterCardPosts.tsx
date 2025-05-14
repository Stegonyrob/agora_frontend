import React from "react";
import { Card } from "react-bootstrap";
import { IPost } from '../../../../../core/posts/IPost';
import AccordionComment from "../../comment/AccordionComment";
import ButtonComment from "../../comment/ButtonComent";
import ButtonFavoriteHeart from "../button/favorite/ButtonFavoriteHeart";
import styles from "./FooterCardPost.module.scss";



interface FooterPostsProps {
  userId: number;
  onSelect: (post: IPost) => void;

  posts: IPost[];
  postId: number;
  onLove?: () => void;

}

const FooterPosts: React.FC<FooterPostsProps> = ({ userId, onSelect, posts, postId }) => {
  console.log("FooterPostsProps:", { userId, onSelect, posts, postId });
  const post = posts.find((post) => post.id === postId);
  console.log("post:", post);




  return (



    <Card className={styles.cardFooter}>
      <Card.Footer className={styles.cardFooter}>
        <ButtonFavoriteHeart userId={userId} onSelect={onSelect} posts={posts} postId={postId} />
        <ButtonComment postId={0} userId={userId} counter={0} />
        <AccordionComment comments={[]} />
      </Card.Footer>
    </Card>
  );
}







export default FooterPosts;