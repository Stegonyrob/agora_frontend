import { useEffect, useState } from 'react';
import { Post } from 'types';
import api from '../../../services/api';
import CardPosts from './CardPosts';
import EditPostForm from './EditPostForm';

interface PostList  {
 posts: Post[];
 onSelect: (post: Post) => void;
 onDelete: (postId: string) => Promise<void>;
}
interface PostData {
  id: string;
  title: string;
  message: string;
 }
const PostList = ({ posts }: PostList ) => {
 const [selectedPost, setSelectedPost] = useState<Post | null>(null);
 const [fetchedPosts, setFetchedPosts] = useState<Post[]>([]); 

 // Load posts initially
 useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await api.fetchPosts();
        setFetchedPosts(fetchedPosts); 
      } catch (error) {
        console.error("Error loading posts: ", error);
      }
    };
    loadPosts();
 }, []);

 const handleSelect = (post: Post) => {
    setSelectedPost(post);
 };

 const handleDelete = async (postId: string) => {
    try {
      await api.deletePost(postId);
      console.log(`Post with ID: ${postId} deleted successfully.`);
      setFetchedPosts(fetchedPosts.filter(post => post.id !== postId)); 
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
 };
 const handleUpdate = async (updatedPost: Post) => {
  try {
    const updatedPostData = JSON.stringify({
      title: updatedPost.title,
      message: updatedPost.message,
    });
    const updatedPostResponse = await api.updatePost(updatedPost.id, updatedPostData);
    console.log(`Post with ID: ${updatedPost.id} updated successfully.`);
alert(`Post editado exitosamente`)
    setFetchedPosts(fetchedPosts.map(post => post.id === updatedPost.id ? updatedPostResponse : post));
  } catch (error) {
    console.error("Error updating post: ", error);
    alert(`No se pudo editar el post, por favor intentelo más tarde, y disculpe las molestias.`)
  }
};



 return (
    <div>
      <CardPosts posts={fetchedPosts} onSelect={handleSelect} onDelete={handleDelete} />
      {selectedPost && <EditPostForm post={selectedPost} onSubmit={handleUpdate} />}
    </div>
 );
};

export default PostList;