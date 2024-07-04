
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Post } from '../../types/types';
import CardPosts from '../Components/Blog/CardPosts';
import PostForm from '../Components/Blog/admin/PostForm';
import PostList from '../Components/Blog/admin/PostList';



interface AdminViewProps {
   posts: Post[];
   onDeletePost: (postId: string) => void;
   onEditPost: (post: Post) => void;
   onCreatePost: (post: Post) => void;
   userId: string;
}
const AdminView: React.FC<AdminViewProps> = ({ posts, onDeletePost, onEditPost, onCreatePost }) => {
   const [selectedPost, setSelectedPost] = useState<Post | null>(null);

   const handleSelectPost = (post: Post) => {
      setSelectedPost(post);
   };

   const handleDeletePost = async (postId: string) => {
      await onDeletePost(postId);
   };

   const handleEditPost = async (post: Post): Promise<void> => {
      await onEditPost(post);
   };

   const handleCreatePost = async (post: Post): Promise<void> => {
      await onCreatePost(post);
   };

   const { userId } = useSelector((state: RootState) => state.user);

   return (
      <div>
         <PostList
            posts={posts}
            onSelect={handleSelectPost}
            onDelete={handleDeletePost}
            userId={userId}
         />
         <PostForm
            post={selectedPost}
            onSubmit={selectedPost ? handleEditPost : handleCreatePost} onClose={function (): void {
               throw new Error('Function not implemented.');
            }} />
         <CardPosts
            posts={posts}
            onSelect={handleSelectPost}
            onDelete={handleDeletePost} user={''} />
      </div>
   );
};

export default AdminView;