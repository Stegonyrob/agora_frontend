import { useEffect, useState } from 'react';
import { IPost } from '../../../../core/posts/IPost';
import { IPostDTO } from '../../../../core/posts/IPostDTO';
import PostsService from '../../../../core/posts/PostService';

import { ISession } from '../../../../core/auth/ISession';
import CardPosts from './CardPosts';
import EditPostForm from './edit/EditPostForm';
interface PostListProps {
  posts: IPost[];
  onSelect: (post: IPost) => void;
  onDelete: (postId: string) => Promise<void>;
  onClose: () => void;
  onEdit: (post: IPost) => void;
  onCreate: (post: IPost) => void;

  session: ISession[];
}

const PostList = ({ posts }: PostListProps) => {

  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const userId = sessionStorage.userId;

  const userName = sessionStorage.userName;

  const userRole = sessionStorage.role;

  const isLoggedIn = sessionStorage.isLoggedIn;

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
    setSelectedPost(post);
    setShowEditModal(true);
  };

  const handleClose = () => {
    setSelectedPost(null);
    setShowEditModal(false);
  };

  const handleDelete = async (postId: string) => {
    console.log("handleDelete called", postId);
    try {
      await apiPost.deletePost(Number(postId));
      console.log(`Post with ID: ${postId} deleted successfully.`);
      setFetchedPosts(fetchedPosts.filter((post: { postId: number; }) => post.postId !== Number(postId)));
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
        postId: 0,
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

      };
      const updatedPostResponse = await apiPost.updatePost(updatedPostData, updatedPost.postId);
      console.log(`Post with ID: ${updatedPost.postId} updated successfully.`);
      const message = updatedPostResponse.message || "Default message";
      alert(`Post editado exitosamente: ${message}`);
      setFetchedPosts(fetchedPosts.map((post: IPost) => post.postId === updatedPost.postId ? updatedPostResponse : post));
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
        postId: newPost.postId,
        creation_date: new Date(),
        userId: newPost.userId as number,
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
        url_avatar: ''
      };

      const createdPost = await apiPost.createPost(newPostData);
      console.log(`Post with ID: ${createdPost.postId} created successfully.`);
      alert(`Post creado exitosamente`);
      setFetchedPosts([...fetchedPosts, createdPost]);
    } catch (error) {
      console.error("Error creating post: ", error);
      alert(`No se pudo crear el post, por favor intentenlo más tarde, por favor disculpen las molestias`);
    }
  };

  const onSubmit = async (post: IPost) => {
    console.log('onSubmit called', post);
    if (post.postId) {
      console.log('Updating post');
      const updatedPost: IPostDTO = {
        ...post,
        creation_date: new Date(post.creation_date),
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
          user={userId} session={[]}
        />
        {selectedPost && (
          <EditPostForm
            post={selectedPost as IPostDTO}
            onSubmit={handleUpdate}
            onClose={handleClose}
            show={showEditModal}
          />
        )}
      </div>
    </div>
  );
};

export default PostList;