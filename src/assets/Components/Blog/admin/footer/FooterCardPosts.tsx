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

  const post = posts[0] || { postId: null, comments: [] };

  return (
    <Card className={styles.cardPost}>
      <Card.Footer className={styles.cardFooter}>
        <span className="social-icons">
          <i className="bi bi-heart" />
          {post.postId ? post.postId.toString() : user.toString()}
        </span>
        <ButtonComment postId={post.postId} userId={user} counter={post.comments.length} />
        <AccordionComment comments={[]} />
        {role === "admin" && (
          <span className="social-icons" >
            <i
              className={post.postId && post.isArchived ? "bi bi-file-earmark-arrow-down" : "bi bi-file-earmark-arrow-up"}
              onClick={() => {
                console.log("Deleting post: ", post);
                onDelete(post.postId ? post.postId.toString() : '');
              }}
            />
          </span>
        )}
        {role === "admin" && (
          <span className="social-icons">
            <i className="bi bi-pencil-square" onClick={() => {
              console.log("Selecting post: ", post);
              onSelect(post);
            }} />{" "}
          </span>
        )}
      </Card.Footer>
    </Card>
  );
};

export default FooterPosts;