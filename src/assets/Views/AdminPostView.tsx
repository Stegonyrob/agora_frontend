import { IPost } from "@/core/posts/IPost";
import { IPostDTO } from "@/core/posts/IPostDTO";
import PostService from "@/core/posts/PostService";
import { useEffect, useState } from "react";
import ListAdmin from "../Components/Blog/admin/list/generic/ListAdmin";

const AdminPostView = ({ userId }: { userId: number }) => {
    const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postService = new PostService();
                const posts = await postService.fetchPosts();
                if (posts) {
                    setFetchedPosts(posts);
                } else {
                    console.warn("Fetched posts are null or undefined");
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, []);

    const handleSelect = (item: IPost) => {
        setSelectedPost(item);
    };


    const handleUpdate = async (post: IPost) => {
        try {
            const postService = new PostService();
            const postDTO: IPostDTO = {
                id: post.id,
                title: post.title,
                message: typeof post.message === "string" ? post.message : "",
                alt_avatar: typeof post.alt_avatar === "string" ? post.alt_avatar : "",
                source_avatar: typeof post.source_avatar === "string" ? post.source_avatar : "",
                images: Array.isArray(post.images) ? post.images : [],
                isArchived: post.isArchived ?? false,
                updatedAt: "",
                createdAt: "",
                description: "",
                userId: 0,
                location: "",
                loves: 0,
                comments: [],
                tags: [],
                isPublished: false,
                alt_image: "",
                source_image: "",
                userName: "",
                role: "",
                url_avatar: ""
            };
            await postService.updatePost(postDTO, post.id);
            setFetchedPosts((prev) =>
                prev.map((p) => (p.id === post.id ? { ...p, ...post } : p))
            );
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    const handleCreate = async (newPost: IPostDTO) => {
        try {
            const postService = new PostService();
            const createdPost = await postService.createPost(newPost);
            setFetchedPosts((prev) => [...prev, createdPost]);
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const handleArchive = async (postId: number): Promise<boolean> => {
        try {
            const postService = new PostService();
            await postService.archivePost(postId, true);
            setFetchedPosts((prev) =>
                prev.map((post) =>
                    post.id === postId ? { ...post, isArchived: true } : post
                )
            );
            return true;
        } catch (error) {
            console.error("Error archiving post:", error);
            return false;
        }
    };

    const handleUnArchive = async (postId: number): Promise<boolean> => {
        try {
            const postService = new PostService();
            await postService.unArchivePost(postId, false);
            setFetchedPosts((prev) =>
                prev.map((post) =>
                    post.id === postId ? { ...post, isArchived: false } : post
                )
            );
            return true;
        } catch (error) {
            console.error("Error unarchiving post:", error);
            return false;
        }
    };

    // Add handleDelete function
    const handleDelete = async (postId: number): Promise<void> => {
        try {
            const postService = new PostService();
            const postToDelete = fetchedPosts.find((post) => post.id === postId);
            if (!postToDelete) {
                console.error("Post not found for deletion:", postId);
                return;
            }
            // Construct a minimal IPostDTO for deletion
            const postDTO: IPostDTO = {
                id: postToDelete.id,
                title: postToDelete.title,
                message: typeof postToDelete.message === "string" ? postToDelete.message : "",
                alt_avatar: typeof postToDelete.alt_avatar === "string" ? postToDelete.alt_avatar : "",
                source_avatar: typeof postToDelete.source_avatar === "string" ? postToDelete.source_avatar : "",
                images: Array.isArray(postToDelete.images) ? postToDelete.images : [],
                isArchived: postToDelete.isArchived ?? false,
                updatedAt: "",
                createdAt: "",
                description: "",
                userId: 0,
                location: "",
                loves: 0,
                comments: [],
                tags: [],
                isPublished: false,
                alt_image: "",
                source_image: "",
                userName: "",
                role: "",
                url_avatar: ""
            };
            await postService.deletePost(postDTO, postId);
            setFetchedPosts((prev) => prev.filter((post) => post.id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <div>
            <h1>Admin Post View</h1>
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