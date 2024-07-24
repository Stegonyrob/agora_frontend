import { useEffect, useState } from 'react';
import { IPost } from '../../../../core/posts/IPost';
import { IPostDTO } from '../../../../core/posts/IPostDTO';
import PostsService from '../../../../core/posts/PostService';
import CardPosts from './CardPosts';
import EditPostForm from './EditPostForm';
interface PostList {
  post: IPost[];
  onSelect: (post: IPost) => void;
  onDelete: (postId: string) => Promise<void>;
  onClose: () => void;
  onEdit: (post: IPost) => void;
  onCreate: (post: IPost) => void;

  userId: number | null;
}

const PostList = ({ userId }: { userId: number }, { post }: PostList) => {
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);

  const apiPost = new PostsService();

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

  const handleSelect = (post: IPost) => {
    setSelectedPost(post);
  };

  const handleClose = () => {
    setSelectedPost(null);
  };

  const handleDelete = async (postId: string) => {
    try {
      await apiPost.deletePost(Number(postId));
      console.log(`Post with ID: ${postId} deleted successfully.`);
      setFetchedPosts(fetchedPosts.filter((post: { id: number; }) => post.id !== Number(postId)));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  const handleUpdate = async (updatedPost: IPost) => {
    try {
      const updatedPostData: IPostDTO = {
        title: updatedPost.title,
        message: updatedPost.message,
        id: 0,
        creation_date: '',
        postname: '',
        userId: 0
      };
      const updatedPostResponse = await apiPost.updatePost(updatedPostData, updatedPost.id);
      console.log(`Post with ID: ${updatedPost.id} updated successfully.`);
      const message = updatedPostResponse.message || "Default message";
      alert(`Post editado exitosamente: ${message}`);
      setFetchedPosts(fetchedPosts.map((post: IPost) => post.id === updatedPost.id ? updatedPostResponse : post));
    } catch (error) {
      console.error("Error updating post: ", error);
      alert(`No se pudo editar el post, por favor intentenlo más tarde, por favor disculpen las molestias`);
    }
  };

  const handleCreate = async (newPost: IPost) => {
    try {
      const newPostData: IPostDTO = {
        title: newPost.title,
        message: newPost.message,
        id: newPost.id,
        creation_date: newPost.creation_date ? newPost.creation_date.toString() : '',
        postname: newPost.postname ? String(newPost.postname) : '',
        userId: newPost.userId as number
      };

      const createdPost = await apiPost.createPost(newPostData);
      console.log(`Post with ID: ${createdPost.id} created successfully.`);
      alert(`Post creado exitosamente`);
      setFetchedPosts([...fetchedPosts, createdPost]);
    } catch (error) {
      console.error("Error creating post: ", error);
      alert(`No se pudo crear el post, por favor intentenlo más tarde, por favor disculpen las molestias`);
    }
  };

  const onSubmit = async (post: IPostDTO) => {
    if (post.id) {
      await handleUpdate(post);
    } else {
      await handleCreate(post);
    }
  };

  return (
    <div>
      <div>
        <CardPosts
          posts={fetchedPosts}
          onSelect={handleSelect}
          onDelete={handleDelete}
          user={userId}

        />
        {selectedPost && (
          <EditPostForm
            post={selectedPost}
            onSubmit={onSubmit}
            onClose={handleClose}
            show={selectedPost !== null}
          />
        )}
      </div>
    </div>
  );
};

export default PostList;