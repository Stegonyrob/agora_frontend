import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import PostList from '../Components/Card/post/PostList';
export default function PostsView() {
  const accessToken = useSelector((state: RootState) => state.login.accessToken);
  const userId = accessToken ? parseInt(accessToken, 10) : 0;
  const userName = sessionStorage.getItem("userName");
  const userRole = sessionStorage.getItem("role");
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";



  return (
    <div>
      <h2>Publicaciones</h2>

      <PostList userId={null} />

    </div>
  );
};


