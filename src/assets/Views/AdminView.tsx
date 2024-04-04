
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Post } from '../../types/types';
import CardPosts from '../Components/Foro/CardPosts';
import PostForm from '../Components/Foro/PostForm';
import PostList from '../Components/Foro/PostList';
import { RootState } from '../redux/store';



interface AdminViewProps {
 posts: Post[];
 onDeletePost: (postId: string) => void;
 onEditPost: (post: Post) => void;
 onCreatePost: (post: Post) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ posts, onDeletePost, onEditPost, onCreatePost }) => {
 const [selectedPost, setSelectedPost] = useState<Post | null>(null);

 const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
 };

 const handleDeletePost = (postId: string) => {
    onDeletePost(postId);
 };

 const handleEditPost = (post: Post) => {
    onEditPost(post);
 };

 const handleCreatePost = (post: Post) => {
    onCreatePost(post);
 };
 const { userId } = useSelector((state: RootState) => state.user);
 return (
    <div>
      // En el componente padre de PostList

<PostList userId={userId ?? undefined} posts={[]} onSelect={function (posts: any): void {
          throw new Error('Function not implemented.');
       } } onDelete={function (postsId: any): void {
          throw new Error('Function not implemented.');
       } } />
      <PostForm post={selectedPost} onSubmit={selectedPost ? handleEditPost : handleCreatePost} />
      <CardPosts posts={posts} onSelect={handleSelectPost} onDelete={handleDeletePost} />
    </div>
 );
};

export default AdminView;
