import PostListAdmin from '../Components/Blog/admin/list/PostListAdmin';
import styles from './scss/Views.module.scss';

const AdminView = () => {
   // Obtener el nombre del usuario desde sessionStorage
   const userName = sessionStorage.getItem('userName') || 'Usuario';

   return (
      <div className={styles.container}>
         <h1>Bienvenido, {userName}</h1>
         <PostListAdmin userId={1} />
      </div>
   );
};

export default AdminView;