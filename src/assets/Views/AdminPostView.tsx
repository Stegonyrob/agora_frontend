import { IPost } from "@/core/posts/IPost";
import { IPostDTO } from "@/core/posts/IPostDTO";
import PostService from "@/core/posts/PostService";
import { useEffect, useState } from "react";
import ListAdmin from "../Components/Blog/admin/list/generic/ListAdmin";
import styles from "../Views/scss/Views.module.scss";
const AdminPostView = ({ userId }: { userId: number }) => {
    const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postService = new PostService();
                const posts = await postService.fetchPosts();
                setFetchedPosts(posts ?? []);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, []);

    const handleSelect = (item: IPost) => setSelectedPost(item);

    const handleUpdate = async (post: IPost) => {
        try {
            const postService = new PostService();
            const postDTO: IPostDTO = { ...post, message: String(post.message), images: post.images ?? [] };
            await postService.updatePost(postDTO, post.id);
            setFetchedPosts(prev => prev.map(p => (p.id === post.id ? { ...p, ...post } : p)));
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    const handleCreate = async (newPost: IPostDTO) => {
        try {
            const postService = new PostService();
            await postService.createPost(newPost);
            const updatedPosts = await postService.fetchPosts();
            setFetchedPosts(updatedPosts ?? []);
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const handleArchive = async (postId: number): Promise<boolean> => {
        try {
            const postService = new PostService();
            await postService.archivePost(postId, true);
            setFetchedPosts(prev => prev.map(post => post.id === postId ? { ...post, isArchived: true } : post));
            return true;
        } catch (error) {
            console.error("Error archiving post:", error);
            return false;
        }
    };

    const handleUnArchive = async (postId: number): Promise<boolean> => {
        try {
            const postService = new PostService();
            await postService.archivePost(postId, false);
            setFetchedPosts(prev => prev.map(post => post.id === postId ? { ...post, isArchived: false } : post));
            return true;
        } catch (error) {
            console.error("Error unarchiving post:", error);
            return false;
        }
    };

    const handleDelete = async (postId: number): Promise<void> => {
        try {
            const postService = new PostService();
            await postService.deletePost({ id: postId } as IPostDTO, postId);
            setFetchedPosts(prev => prev.filter(post => post.id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <div>     <h1 className={styles.centeredTitle}>Admin Post View</h1>

            <ListAdmin
                items={fetchedPosts}
                type="post"
                onSelect={handleSelect}
                onDelete={handleDelete}
                onEdit={handleUpdate}
                onArchive={handleArchive}
                onUnArchive={handleUnArchive}
                onSubmit={handleUpdate}
                onCreate={handleCreate}
                userId={userId}
            />
        </div>
    );
};

export default AdminPostView;