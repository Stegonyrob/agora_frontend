import { useEffect, useState } from 'react';
import { IPost } from '../../../../core/posts/IPost';
import { IPostDTO } from '../../../../core/posts/IPostDTO';
import PostsService from '../../../../core/posts/PostService';

import CardPosts from './CardPosts';
import EditPostForm from './EditPostForm';
interface PostListProps {
  posts: IPost[];
  onSelect: (post: IPost) => void;
  onDelete: (postId: string) => Promise<void>;
  onClose: () => void;
  onEdit: (post: IPost) => void;
  onCreate: (post: IPost) => void;
  userId: number;
  username: string;
  role: string;
}

const PostList = ({ userId, posts }: PostListProps) => {

  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);

  const apiPost = new PostsService();

  useEffect(() => {
    const loadPosts = async () => {
      console.log("Begin loadPosts");
      try {
        const fetchedPosts = await apiPost.fetchPosts();
        console.log("Posts fetched successfully. Data: ", fetchedPosts);
        setFetchedPosts(fetchedPosts);
      } catch (error) {
        console.error("Error loading posts: ", error);
      } finally {
        console.log("End loadPosts");
      }
    };
    loadPosts();
  }, []);

  const handleSelect = (post: IPost) => {
    console.log("handleSelect called", post);
    setSelectedPost(post);
  };

  const handleClose = () => {
    console.log("handleClose called");
    setSelectedPost(null);
  };

  const handleDelete = async (postId: string) => {
    console.log("handleDelete called", postId);
    try {
      await apiPost.deletePost(Number(postId));
      console.log(`Post with ID: ${postId} deleted successfully.`);
      setFetchedPosts(fetchedPosts.filter((post: { id: number; }) => post.id !== Number(postId)));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  const handleUpdate = async (updatedPost: IPostDTO) => {
    console.log("handleUpdate called", updatedPost);
    try {
      const updatedPostData: IPostDTO = {
        title: updatedPost.title,
        message: updatedPost.message,
        id: 0,
        creation_date: new Date(),
        userId: 0,
        location: '',
        loves: 0,
        comments: [],
        isArchived: false,
        tags: [],
        images: [],

        isPublished: false,
        publishDate: '',
        alt_image: '',
        source_image: '',
        alt_avatar: '',
        source_avatar: '',
        username: '',
        role: '',
        url_avatar: '',
        category: ''
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
    console.log("handleCreate called", newPost);
    try {
      const newPostData: IPostDTO = {
        title: newPost.title,
        message: newPost.message,
        id: newPost.id,
        creation_date: new Date(),
        userId: newPost.userId as number,
        location: '',
        loves: 0,
        comments: [],
        isArchived: false,
        category: '',
        tags: [],
        images: [],
        isPublished: false,
        publishDate: '',
        alt_image: '',
        source_image: '',
        alt_avatar: '',
        source_avatar: '',
        username: '',
        role: '',
        url_avatar: ''
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

  const onSubmit = async (post: IPost) => {
    console.log('onSubmit called', post);
    if (post.id) {
      console.log('Updating post');
      const updatedPost: IPostDTO = {
        ...post,
        creation_date: new Date(post.creation_date),
        category: '', // Add this property
        images: [], // Add this property
        isPublished: false, // Add this property
        publishDate: '', // Add this property
        alt_image: '', // Add this property
        source_image: '', // Add this property
        alt_avatar: '', // Add this property
        source_avatar: '', // Add this property
        username: '', // Add this property
        role: '', // Add this property
        url_avatar: '', // Add this property,
      };
      await handleUpdate(updatedPost);
    } else {
      console.log('Creating post');
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
          role={''}
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