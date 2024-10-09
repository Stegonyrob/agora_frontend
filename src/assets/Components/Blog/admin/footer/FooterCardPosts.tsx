import React from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { IPost } from "../../../../../core/posts/IPost";
import { RootState } from "../../../../../redux/store";
import AccordionComment from "../../Comment/AccordionComment";
import ButtonComment from "../../Comment/ButtonComent";
import styles from "./FooterCardPost.module.scss";



interface FooterPostsProps {
  user: number;
  onSelect: (post: IPost) => void;
  onDelete: (postId: string) => Promise<void>;
  posts: IPost[];
  role: string;
}

const FooterPosts: React.FC<FooterPostsProps> = ({ user, onSelect, onDelete, posts }) => {
  console.log("FooterPosts props: ", { user, onSelect, onDelete, posts });
  const { accessToken, role, isLoggedIn } = useSelector((state: RootState) => ({
    accessToken: state.login.accessToken,
    role: state.user.userRole,
    isLoggedIn: state.login.isLoggedIn,
  }));

  console.log("FooterPosts state: ", { accessToken, role, isLoggedIn });

  if (!isLoggedIn) return null;

  return (
    <Card className={styles.cardPost}>
      <Card.Footer className={styles.cardFooter}>
        <span className="social-icons">
          <i className="bi bi-heart" />
          {posts.length > 0 ? posts[0].id.toString() : user.toString()}
        </span>
        <ButtonComment postId={posts[0]?.id} userId={user} counter={posts[0]?.comments?.length || 0} />
        <AccordionComment comments={[]} />
        {role === "admin" && (
          <span className="social-icons" >
            <i
              className={posts.length > 0 && posts[0].isArchived ? "bi bi-file-earmark-arrow-down" : "bi bi-file-earmark-arrow-up"}
              onClick={() => {
                console.log("Deleting post: ", posts[0]);
                onDelete(posts.length > 0 ? posts[0].id.toString() : '');
              }}
            />
          </span>
        )}
        {role === "admin" && (
          <span className="social-icons">
            <i className="bi bi-pencil-square" onClick={() => {
              console.log("Selecting post: ", posts[0]);
              onSelect(posts[0]);
            }} />{" "}
          </span>
        )}
      </Card.Footer>
    </Card>
  );
};

export default FooterPosts;