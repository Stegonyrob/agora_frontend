import React, { useEffect, useState } from "react";
import { IPost } from "../../../../core/posts/IPost";
import PostsService from "../../../../core/posts/PostService";
import Pagination from "../../Pagination";
import CardItem from "../card/CardItem";
import styles from "../card/CardItem.module.scss";

interface PostListProps {
    userId: number | null;
}

interface Page<T> {
    content: T[];
    totalPages: number;
    number: number;
    size: number;
    totalElements: number;
}

const PostList: React.FC<PostListProps> = ({ userId }) => {
    const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const apiPost = new PostsService();

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const pageData: Page<IPost> = await apiPost.getAllPosts(page, 10); // 10 posts por página
                setFetchedPosts(pageData.content);
                setTotalPages(pageData.totalPages);
            } catch (error) {
                console.error("Error loading posts: ", error);
            }
        };
        loadPosts();
    }, [page]);

    const handleSelect = (item: any) => {
        console.log("Selected item:", item);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div>
            <div className={styles.cardContainer}>
                {fetchedPosts.map((post) => (
                    <CardItem
                        key={post.id}
                        type="post"
                        id={post.id}
                        title={post.title}
                        description={post.message}
                        creationDate={post.creationDate}
                        favoritesCount={post.favoritesCount ?? 0}
                        commentsCount={post.commentsCount ?? 0} // Solo el número
                        images={post.image}
                        user={post.user}
                        userRole={post.userRole}
                        attendeesCount={post.attendeesCount ?? 0}
                        onSelect={handleSelect}
                    />
                ))}
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default PostList;