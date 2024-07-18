import { useSelector } from 'react-redux';
import { Post } from 'types';
import useAuth from '../../hooks/useAuth'; // Importa tu hook useAuth
import { RootState } from '../../redux/store';
import CardPosts from '../Components/Blog/admin/CardPosts';
import PostForm from '../Components/Blog/admin/PostForm';
import PostList from '../Components/Blog/admin/PostList';

export default function BlogView() {
  const userRole = useSelector<RootState>((state) => state.user.userRole);
  const accessToken = useSelector<RootState>((state) => state.auth.accessToken);
  const { userId } = useAuth(accessToken); // Utiliza tu hook useAuth para obtener userId

  // Convierte userId a string si no es null
  const userIdString: string | null = userId !== null ? String(userId) : null;

  return (
    <div>
      <h2>Agora</h2>
      <PostList
        posts={[]}
        onSelect={(post: Post) => {
          throw new Error("Function not implemented.");
        }}
        onDelete={(postId: string) => {
          throw new Error("Function not implemented.");
        }}
        userId={userIdString}
      />

      <PostForm
        onSubmit={(post: Post) => Promise.resolve()}
        onClose={() => { }}
      />

      <CardPosts
        posts={[]}
        onSelect={(post: Post) => {
          throw new Error("Function not implemented.");
        }}
        onDelete={(postId: string) => {
          throw new Error("Function not implemented.");
        }}
        user={''}
      />
    </div>
  );
}