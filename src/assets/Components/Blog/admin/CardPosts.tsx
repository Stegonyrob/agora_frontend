import CardGeneralContainer from "@/assets/Components/Generals/Card/CardGeneralContainer";
import { ISession } from "@/core/auth/ISession";
import React, { useEffect, useState } from "react";
import { IPost } from "../../../../core/posts/IPost";

interface CardPostsProps {
  userId: number;
  onSelect: (post: IPost) => void;
  posts: IPost[];
  isEvent?: boolean;
  session: ISession[];
  id: number;
  type: "post" | "event";
  isLoggedIn?: boolean;
}

const CardPosts: React.FC<CardPostsProps> = ({ onSelect, posts, isEvent = false }) => {
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [postsState, setPostsState] = useState<IPost[]>([]);
  const [commentCounter, setCommentCounter] = useState(0);
  const [tweetCounter, setTweetCounter] = useState(0);
  const [loveCounter, setLoveCounter] = useState(0);
  const userId = sessionStorage.userId;
  const userName = sessionStorage.userName;
  const userRole = sessionStorage.role;
  const isLoggedIn = sessionStorage.isLoggedIn;

  const commentHandler = () => {
    setCommentCounter((prevState) => {
      return prevState + 1;
    });
  };
  const tweetHandler = () => {
    setTweetCounter((prevState) => {
      return prevState + 1;
    });
  };
  const loveHandler = () => {
    setLoveCounter((prevState) => {
      return prevState + 1;
    });
  };

  useEffect(() => {
    setPostsState(posts);
  }, [posts]);

  return (
    <CardGeneralContainer
      type={isEvent ? "event" : "post"}
      items={posts.map((post) => ({
        id: post.id,
        title: post.title,
        message: post.message,
        description: typeof post.description === "string" ? post.description : post.description !== undefined && post.description !== null ? String(post.description) : "", // Ensure description is a string),
        image: typeof post.image === "string" ? post.image : "", // Ensure image is a string""),
        customContent: post.customContent,
        customButtons: (
          <div>
            <button onClick={commentHandler}>Comment</button>
            <button onClick={tweetHandler}>Tweet</button>
            <button onClick={loveHandler}>Love</button>
          </div>
        ),
      }))} // Transform `posts` to match the expected structure
      onSelect={onSelect}
      isLoggedIn={isLoggedIn} session={[]} userId={0} id={0} />
  );
};

export default CardPosts;