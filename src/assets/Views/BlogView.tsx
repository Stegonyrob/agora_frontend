import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import PostList from '../Components/Card/post/PostList';
import styles from "../Views/scss/Views.module.scss";

export default function PostsView() {
  const { userId, userName, role: userRole, isLoggedIn } = useSelector((state: RootState) => state.session);
  const isAdmin = userRole === "ROLE_ADMIN";

  return (
    <div>
      <h2 className={styles.centeredTitle}>Publicaciones</h2>
      <PostList userId={userId} />
    </div>
  );
}