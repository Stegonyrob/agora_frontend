import { useLocation } from 'react-router-dom';
import CardPosts from './CardPosts';

interface Post {
  id: string;
  title: string;
  message: string;
  creation_date: string;
  postname: string;
  user_id: string;
}

interface PostListProps {
  userId?: string;
  posts: Post[];
}

const PostList = ({ userId, posts }: PostListProps) => {
  const location = useLocation();
  const userIdFromLocation = location.state?.userId;

  const handleSelect = (post: Post) => {
    // Add your onSelect logic here
  };

  const handleDelete = (postId: string) => {
    // Add your onDelete logic here
  };

  return (
    <div>
      <CardPosts
        userId={userId || userIdFromLocation}
        onSelect={handleSelect}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default PostList;
