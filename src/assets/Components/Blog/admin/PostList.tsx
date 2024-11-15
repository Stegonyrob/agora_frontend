import { useEffect, useState } from "react";
import { IPost } from "../../../../core/posts/IPost";
import PostsService from "../../../../core/posts/PostService";
import CardPosts from "./CardPosts";
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

  return (
    <div>
      <div>
        <CardPosts
          posts={fetchedPosts}
          onSelect={handleSelect}
          user={userId}
          session={[]}
          postId={0}
        />
      </div>
    </div>
  );
};

export default PostList;
