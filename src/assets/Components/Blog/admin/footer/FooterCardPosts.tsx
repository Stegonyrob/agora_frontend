import React from "react";
import { Card } from "react-bootstrap";
import { IPost } from "../../../../../core/posts/IPost";
import AccordionComment from "../../Comment/AccordionComment";
import ButtonComment from "../../Comment/ButtonComent";
import styles from "./FooterCardPost.module.scss";



interface FooterPostsProps {
  user: number;
  onSelect: (post: IPost) => void;
  onDelete: (postId: string) => Promise<void>;
  posts: IPost[];

}

const FooterPosts: React.FC<FooterPostsProps> = ({ user, onSelect, onDelete, posts }) => {
  const isLoggedIn = sessionStorage.isLoggedIn;
  console.log(isLoggedIn)
  const userId = sessionStorage.userId;
  console.log(sessionStorage.userId)
  const userName = sessionStorage.userName;
  console.log(sessionStorage.userName)
  const userRole = sessionStorage.role;
  console.log(sessionStorage.role)

  console.log("FooterPosts props: ", { user, onSelect, onDelete, posts });



  if (isLoggedIn && userRole === 'ROLE_ADMIN') {
    return (
      <Card className={styles.cardPost}>
        <Card.Footer className={styles.cardFooter}>

          <span className="social-icons">
            <i className="bi bi-heart" />
            {posts.length.toString()}
          </span>
          <ButtonComment postId={0} userId={user} counter={posts.length} />
          <AccordionComment comments={[]} />
          <span className="social-icons" >
            <i
              className="bi bi-file-earmark-arrow-up"
              onClick={() => {
                console.log("Deleting post: ", posts);
                onDelete(posts[0].postId ? posts[0].postId.toString() : '');
              }}
            />
          </span>
          <span className="social-icons" >

            <i
              className="bi bi-pencil-square"
              onClick={() => {
                console.log("Editing post: ", posts);
                onSelect(posts[0]);
              }}
            />
          </span>
        </Card.Footer>
      </Card>
    );
  }

  else if (isLoggedIn && userRole === 'ROLE_USER') {
    return (
      <Card className={styles.cardPost}>
        <Card.Footer className={styles.cardFooter}>
          <span className="social-icons">
            <i className="bi bi-heart" />
            {posts.length.toString()}
          </span>
          <ButtonComment postId={0} userId={user} counter={posts.length} />
          <AccordionComment comments={[]} />
        </Card.Footer>
      </Card>
    );
  }


}





export default FooterPosts;