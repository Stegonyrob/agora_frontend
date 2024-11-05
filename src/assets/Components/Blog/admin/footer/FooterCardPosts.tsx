import React from "react";
import { Card } from "react-bootstrap";
import { IPost } from '../../../../../core/posts/IPost';
import { IPostDTO } from "../../../../../core/posts/IPostDTO";
import AccordionComment from "../../Comment/AccordionComment";
import ButtonComment from "../../Comment/ButtonComent";
import ButtonArchive from "../archive/ButtonArchivePost";
import ButtonEdit from "../edit/ButtonEditPost";
import styles from "./FooterCardPost.module.scss";



interface FooterPostsProps {
  user: number;
  onSelect: (post: IPost) => void;
  onDelete: (postId: number) => Promise<void>;
  onArchive: (postId: number) => Promise<boolean>;
  onSubmit: (post: IPost) => void;
  posts: IPost[];
  postId: number;

}

const FooterPosts: React.FC<FooterPostsProps> = ({ user, onSelect, onDelete, onSubmit, onArchive, posts, postId }) => {
  console.log("FooterPosts: posts", posts);
  console.log("FooterPosts: user", user);
  console.log("FooterPosts: isLoggedIn", sessionStorage.isLoggedIn);
  console.log("FooterPosts: userId", sessionStorage.userId);
  console.log("FooterPosts: userName", sessionStorage.userName);
  console.log("FooterPosts: userRole", sessionStorage.role);

  const isLoggedIn = sessionStorage.isLoggedIn;
  const userId = sessionStorage.userId;
  const userName = sessionStorage.userName;
  const userRole = sessionStorage.role;

  const handleUpdate = async (updatedPost: IPostDTO) => {
    await onSubmit(updatedPost);
  };


  if (isLoggedIn && userRole === 'ROLE_ADMIN') {
    console.log("FooterPosts: Admin user");
    return (
      <Card className={styles.cardFooter} >
        <Card.Footer className={styles.cardFooter}>

          <span className={styles.socialIcons}>
            <i className="bi bi-heart" />
            {posts.length.toString()}
          </span>
          <ButtonComment postId={0} userId={user} counter={posts.length} />
          <AccordionComment comments={[]} />
          <ButtonArchive postId={0} userId={user} post={posts[0]} onArchive={onArchive} label={""} onSubmit={function (post: IPost): void {
            throw new Error("Function not implemented.");
          }} />
          <span className={styles.socialIcons}>
            <ButtonEdit postId={0} userId={0} post={posts[0]} onSubmit={handleUpdate} label={""} />
          </span>
        </Card.Footer>
      </Card>
    );
  }

  else if (isLoggedIn && userRole === 'ROLE_USER') {
    console.log("FooterPosts: User user");
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

  console.log("FooterPosts: Not logged in user");
}





export default FooterPosts;