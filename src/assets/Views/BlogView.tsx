import { useSelector } from 'react-redux';
import { Post } from 'types';
import { RootState } from '../../redux/store';
import CardPosts from '../Components/Blog/admin/CardPosts';
import PostForm from '../Components/Blog/admin/PostForm';
import PostList from '../Components/Blog/admin/PostList';

interface PostListProps {
  posts: Post[];
  onSelect: (post: Post) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
  userId: string | null;
}

interface CardPostsProps {
  posts: Post[];
  onSelect: (post: Post) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
  user: string;
}

export default function BlogView() {
  const userRole = useSelector((state: RootState) => state.user.userRole);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const userIdString = accessToken ? String(accessToken) : null;

  return (
    <div>
      <h2>Agora</h2>
      <PostList
        posts={[]}
        onSelect={(post: Post) => Promise.resolve()}
        onDelete={(postId: string) => Promise.resolve()}
        userId={userIdString}
      />

      <PostForm
        onSubmit={(post: Post) => Promise.resolve()}
        onClose={() => { }}
      />

      <CardPosts
        posts={[]}
        onSelect={(post: Post) => Promise.resolve()}
        onDelete={(postId: string) => Promise.resolve()}
        user={userIdString || ''}
      />
    </div>
  );
}