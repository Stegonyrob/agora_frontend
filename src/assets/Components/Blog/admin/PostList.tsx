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

  const userName = sessionStorage.getItem("userName");
  const userRole = sessionStorage.getItem("role");
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  console.log("CardPosts: isLoggedIn", isLoggedIn);
  console.log("CardPosts: userId", userId);
  console.log("CardPosts: userName", userName);
  console.log("CardPosts: userRole", userRole);
  const apiPost = new PostsService();

  useEffect(() => {
    const loadPosts = async () => {
      console.log("Starting to load posts...");
      try {
        const fetchedPosts = await apiPost.fetchPosts();
        console.log("Fetched posts:", fetchedPosts);
        setFetchedPosts(fetchedPosts);
      } catch (error) {
        console.error("Error loading posts: ", error);
      }
    };
    loadPosts();
  }, []);

  const handleSelect = (post: IPost) => {
    console.log("Post selected:", post);
    setSelectedPost(post);
  };

  const handleClose = () => {
    console.log("Closing selected post.");
    setSelectedPost(null);
  };

  console.log("Rendering PostList component with userId:", userId);

  return (
    <div>
      <div>
        <CardPosts
          posts={fetchedPosts}
          onSelect={handleSelect}
          user={userId}
          session={[]}
          postId={0}
          userId={0}
          id={0}
        />
      </div>
    </div>
  );
};

export default PostList;
