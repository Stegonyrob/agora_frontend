import PostListAdmin from '../Components/Blog/admin/list/PostListAdmin';
import styles from './scss/Views.module.scss';

const AdminView = () => {




   return (
      <div className={styles.container}>
         <h1>Admin View</h1>
         <PostListAdmin userId={1} />
      </div>
   );
};

export default AdminView;