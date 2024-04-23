import { useEffect, useState } from 'react';
import { Post } from 'types'; // Assuming this is the correct import for your Post type
import api from '../../../services/api';
import CardPosts from './CardPosts';
import EditPostForm from './EditPostForm';

interface PostList  {
 posts: Post[];
 onSelect: (post: Post) => void;
 onDelete: (postId: string) => Promise<void>;
}

const PostList = ({ posts }: PostList ) => {
 const [selectedPost, setSelectedPost] = useState<Post | null>(null);
 const [fetchedPosts, setFetchedPosts] = useState<Post[]>([]); // Define a state for fetched posts

 // Load posts initially
 useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await api.fetchPosts();
        setFetchedPosts(fetchedPosts); // Update the state with fetched posts
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
      setFetchedPosts(fetchedPosts.filter(post => post.id !== postId)); // Update the state to remove the deleted post
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
 };

 return (
    <div>
      <CardPosts posts={fetchedPosts} onSelect={handleSelect} onDelete={handleDelete} />
      {selectedPost && <EditPostForm post={selectedPost} onSubmit={function (post: Post): void {
        // Implement the onSubmit logic here
      } } />}
    </div>
 );
};

export default PostList;