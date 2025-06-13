import React, { useEffect, useState } from "react";
import { IPost } from "../../../../core/posts/IPost";
import PostsService from "../../../../core/posts/PostService";
import CardItem from "../card/CardItem";
import styles from "../card/CardItem.module.scss";
interface PostListProps {
    userId: number | null;
}

const PostList: React.FC<PostListProps> = ({ userId }) => {
    const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);

    console.log("userId:", userId);

    const apiPost = new PostsService();

    useEffect(() => {
        console.log("useEffect posts called");
        const loadPosts = async () => {
            console.log("loadPosts called");
            try {
                const fetchedPosts = await apiPost.fetchPosts();
                console.log("fetchedPosts:", fetchedPosts);
                setFetchedPosts(fetchedPosts);
            } catch (error) {
                console.error("Error loading posts: ", error);
            }
        };
        loadPosts();
    }, []);

    const handleSelect = (item: any) => {
        console.log("Selected item:", item);
    };

    console.log("fetchedPosts:", fetchedPosts);

    return (
        <div className={styles.cardContainer}>
            {fetchedPosts.map((post) => (
                <CardItem
                    key={post.id}
                    type="post"
                    id={post.id}
                    title={post.title}
                    description={post.message}
                    creationDate={post.creationDate}
                    favoritesCount={post.favoritesCount}
                    commentsCount={post.commentsCount}
                    images={post.image}
                    user={post.user}
                    userRole={post.userRole}
                    attendeesCount={post.attendeesCount ?? 0}
                    onSelect={handleSelect}
                />
            ))}
        </div>
    );
};

export default PostList;
