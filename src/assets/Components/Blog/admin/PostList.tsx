import { useEffect, useState } from 'react';
import { IPost } from '../../../../core/posts/IPost';
import { IPostDTO } from '../../../../core/posts/IPostDTO';
import PostsService from '../../../../core/posts/PostService';
import EditPostForm from '../admin/edit/EditPostForm';
import CardPosts from './CardPosts';
interface PostList {
  post: IPost[];
  onSelect: (post: IPost) => void;
  onDelete: (postId: number) => Promise<void>;
  onClose: () => void;
  onEdit: (post: IPost) => void;
  onCreate: (post: IPost) => void;
  userId: number | null;
  postId: number;
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

  const handleDelete = async (postId: number) => {
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
        id: updatedPost.id,
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
        creation_date: new Date,
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
        userId: newPost.userId as number,
        creation_date: new Date,
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
      console.log(`Post with ID: ${createdPost.id} created successfully.`);
      alert(`Post creado exitosamente`);
      setFetchedPosts([...fetchedPosts, createdPost]);
    } catch (error) {
      console.error("Error creating post: ", error);
      alert(`No se pudo crear el post, por favor intentenlo más tarde, por favor disculpen las molestias`);
    }
  };

  const onSubmit = async (post: IPostDTO) => {
    if (post === null || post === undefined) {
      console.error("Error submitting post: post is null or undefined");
      return;
    }

    if (post.id === null || post.id === undefined) {
      console.error("Error submitting post: post.id is null or undefined");
      return;
    }

    if (post.id) {
      try {
        await handleUpdate(post);
      } catch (error) {
        console.error("Error updating post: ", error);
      }
    } else {
      try {
        await handleCreate(post);
      } catch (error) {
        console.error("Error creating post: ", error);
      }
    }
  };

  const handleArchive = async (postId: number): Promise<void> => {
    try {
      await apiPost.archivePost(postId);
      console.log(`Post with ID: ${postId} archived successfully.`);
      setFetchedPosts(fetchedPosts.map((post: IPost) => post.id === postId ? { ...post, isArchived: true } : post));
    } catch (error) {
      console.error("Error archiving post: ", error);
    }
  };

  return (
    <div>
      <div>
        <CardPosts
          posts={fetchedPosts}
          onSelect={handleSelect}
          onDelete={handleDelete}
          onArchive={handleArchive}
          user={userId} session={[]}
          onSubmit={handleUpdate} postId={0} />
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