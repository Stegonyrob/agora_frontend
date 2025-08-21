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
                console.log("🚀 Starting to fetch posts...");
                const postService = new PostService();
                const page = await postService.getAllPosts(0, 100); // Obtener los primeros 100 posts
                console.log("📦 Posts loaded successfully:", page?.totalElements, "total posts");
                setFetchedPosts(page?.content ?? []);
            } catch (error: any) {
                console.error("❌ Error fetching posts:", error);
                if (error.response) {
                    console.error("📋 Response status:", error.response.status);
                    console.error("📋 Response data:", error.response.data);
                }
            }
        };
        fetchPosts();
    }, []);

    const handleSelect = (item: IPost) => setSelectedPost(item);

    const handleUpdate = async (post: IPost) => {
        try {
            console.log("🚀 AdminPostView - Actualizando post completo:", post);

            // ✅ ACTUALIZACIÓN OPTIMISTA: Actualizar la UI inmediatamente
            setFetchedPosts(prev => prev.map(p => (p.id === post.id ? { ...p, ...post } : p)));
            console.log("⚡ AdminPostView - UI actualizada optimistamente");

            const postService = new PostService();
            // Crear un DTO limpio del post sin las tags (las tags se manejan separadamente)
            const postDTO: IPostDTO = {
                id: post.id,
                userId: post.userId,
                title: post.title,
                message: String(post.message),
                description: (post as any).description || "",
                location: post.location || "",
                loves: (post as any).loves || 0,
                comments: (post as any).comments || [],
                images: (post.images && Array.isArray(post.images) && post.images.length > 0 && typeof post.images[0] === 'object')
                    ? post.images as any[]
                    : [],
                isArchived: post.isArchived ?? false,
                isPublished: post.isPublished ?? true,
                createdAt: post.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: [], // Las tags se manejan por separado en useEditPostForm
                alt_image: (post as any).alt_image || "",
                source_image: (post as any).source_image || "",
                alt_avatar: (post as any).alt_avatar || "",
                source_avatar: (post as any).source_avatar || "",
                userName: (post as any).userName || "",
                role: (post as any).role || "",
                url_avatar: (post as any).url_avatar || ""
            };

            console.log("📤 AdminPostView - Payload del post (sin tags):", postDTO);
            await postService.updatePost(post.id, postDTO);
            console.log("✅ AdminPostView - Post actualizado en backend");
        } catch (error) {
            console.error("❌ AdminPostView - Error updating post:", error);
            // En caso de error, revertir la actualización optimista
            const originalPost = fetchedPosts.find(p => p.id === post.id);
            if (originalPost) {
                setFetchedPosts(prev => prev.map(p => (p.id === post.id ? originalPost : p)));
                console.log("🔄 AdminPostView - Revertida actualización optimista por error");
            }
        }
    };

    const handleCreate = async (newPost: IPost) => {
        try {
            // El post ya fue creado en usePostForm, solo actualizar la lista local
            console.log("✅ AdminPostView - Post recibido desde usePostForm:", newPost);
            setFetchedPosts(prev => [...prev, newPost]);
        } catch (error) {
            console.error("Error adding post to list:", error);
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