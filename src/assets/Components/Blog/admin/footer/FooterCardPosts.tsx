import React from "react";
import { Card } from "react-bootstrap";
import { IPost } from "../../../../../core/posts/IPost";
import AccordionComment from "../../Comment/AccordionComment";
import ButtonComment from "../../Comment/ButtonComent";
import ButtonEdit from "../edit/ButtonEditPost";
import styles from "./FooterCardPost.module.scss";



interface FooterPostsProps {
  user: number;
  onSelect: (post: IPost) => void;
  onDelete: (postId: number) => Promise<void>;
  onArchive: (postId: number) => Promise<void>;
  posts: IPost[];

}

const FooterPosts: React.FC<FooterPostsProps> = ({ user, onSelect, onDelete, onArchive, posts }) => {
  const isLoggedIn = sessionStorage.isLoggedIn;
  const userId = sessionStorage.userId;
  const userName = sessionStorage.userName;
  const userRole = sessionStorage.role;




  if (isLoggedIn && userRole === 'ROLE_ADMIN') {
    return (
      <Card className={styles.cardFooter} >
        <Card.Footer className={styles.cardFooter}>

          <span className={styles.socialIcons}>
            <i className="bi bi-heart" />
            {posts.length.toString()}
          </span>
          <ButtonComment postId={0} userId={user} counter={posts.length} />
          <AccordionComment comments={[]} />
          <span className={styles.socialIcons}>
            <i
              className="bi bi-file-earmark-arrow-up"
              onClick={() => {
                console.log("Archiving post: ", posts);
                const postId = posts[0]?.postId ?? 0;
                onArchive(postId)
              }}
            />
          </span>
          <span className={styles.socialIcons}>
            <ButtonEdit postId={0} userId={0} post={posts[0]} onSubmit={function (post: IPost): Promise<void> {
              throw new Error("Function not implemented.");
            }} />
          </span>
        </Card.Footer>
      </Card>
    );
  }

  else if (isLoggedIn && userRole === 'ROLE_USER') {
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


}





export default FooterPosts;