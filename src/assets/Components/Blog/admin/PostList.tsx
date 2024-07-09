import { useEffect, useState } from 'react';
import { Post } from 'types';

import apiPost from '../../../../services/posts.api';
import CardPosts from './CardPosts';
import EditPostForm from './EditPostForm';

interface PostList {
  posts: Post[];
  onSelect: (post: Post) => void;
  onDelete: (postId: string) => Promise<void>;
  userId: string | null;
}

const PostList = ({ posts }: PostList) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [fetchedPosts, setFetchedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await apiPost.fetchPosts();
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

  const handleClose = () => {
    setSelectedPost(null);
  };

  const handleDelete = async (postId: string) => {
    try {
      await apiPost.deletePost(postId);
      console.log(`Post with ID: ${postId} deleted successfully.`);
      setFetchedPosts(fetchedPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  const handleUpdate = async (updatedPost: Post) => {
    try {
      const updatedPostData = {
        title: updatedPost.title,
        message: updatedPost.message,
      };
      const updatedPostResponse = await apiPost.updatePost(updatedPost.id, updatedPostData);
      console.log(`Post with ID: ${updatedPost.id} updated successfully.`);
      alert(`Post editado exitosamente`);
      setFetchedPosts(fetchedPosts.map(post => post.id === updatedPost.id ? updatedPostResponse : post));
    } catch (error) {
      console.error("Error updating post: ", error);
      alert(`No se pudo editar el post, por favor intentenlo más tarde, por favor disculpen las molestias`);
    }
  };

  const handleCreate = async (newPost: Post) => {
    try {
      console.log("Enviando este post al backend:", newPost);

      const createdPost = await apiPost.createPost(newPost);
      console.log(`Post with ID: ${createdPost.id} created successfully.`);
      alert(`Post creado exitosamente`);
      setFetchedPosts([...fetchedPosts, createdPost]);
    } catch (error) {
      console.error("Error creating post: ", error);
      alert(`No se pudo crear el post, por favor intentenlo más tarde, por favor disculpen las molestias`);
    }
  };



  const onSubmit = async (post: Post) => {
    if (post.id) {
      await handleUpdate(post);
    } else {
      await handleCreate(post);
    }
  };

  return (
    <div>


      <div>
        <CardPosts posts={fetchedPosts} onSelect={handleSelect} onDelete={handleDelete} user={''} />
        {selectedPost && (
          <EditPostForm
            post={selectedPost}
            onSubmit={handleUpdate}
            onClose={handleClose}
            show={selectedPost !== null}
          />
        )}
      </div>
    </div>
  );
};

export default PostList;
