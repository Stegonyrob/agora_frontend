import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import PostList from '../Components/Blog/admin/PostList';
import UserInfo from '../Components/Profile/UserInfo';
import styles from './scss/Views.module.scss';
export default function BlogView() {
  const accessToken = useSelector((state: RootState) => state.login.accessToken);
  const userId = accessToken ? parseInt(accessToken, 10) : 0;
  const userName = sessionStorage.getItem("userName");
  const userRole = sessionStorage.getItem("role");
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  console.log("BlogView: isLoggedIn", isLoggedIn);
  console.log("BlogView: userId", userId);
  console.log("BlogView: userName", userName);
  console.log("BlogView: userRole", userRole);

  return (
    <div className={styles.container}>
      <h2>Ágora</h2>
      <UserInfo userId={userId} userName={""} loggedUserName={''} location={''} time={''} profile={undefined} />
      <PostList userId={0} />
    </div>
  );
}
