import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import PostList from '../Components/Blog/admin/PostList';
import styles from './scss/Views.module.scss';
export default function BlogView() {
  const accessToken = useSelector((state: RootState) => state.login.accessToken);
  const userId = accessToken ? parseInt(accessToken, 10) : 0;

  return (
    <div className={styles.container}>
      <h2>Agora</h2>
      <PostList userId={0} />
    </div>
  );
}
