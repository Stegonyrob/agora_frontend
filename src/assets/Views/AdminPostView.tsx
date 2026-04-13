import { IPost } from "@/core/posts/IPost";
import { IPostDTO } from "@/core/posts/IPostDTO";
import PostService from "@/core/posts/PostService";
import { fetchTagsByPost } from "@/core/tags/tagStore";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ListAdmin from "../Components/Blog/admin/list/generic/ListAdmin";
import styles from "../Views/scss/Views.module.scss";
const AdminPostView = ({ userId }: { userId: number }) => {
    const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
    const dispatch = useDispatch();

    // 🔄 HELPER: Función para ordenar posts (más nuevo primero)
    const sortPostsByDate = (posts: IPost[]): IPost[] => {
        return posts.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA; // Descendente: más nuevo primero
        });
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postService = new PostService();
                const page = await postService.getAllPosts(0, 100); // Obtener los primeros 100 posts
                const posts = page?.content ?? [];

                // 🔄 ORDENAR POSTS: Más nuevo primero (descendente por fecha de creación)
                const sortedPosts = sortPostsByDate(posts);
                setFetchedPosts(sortedPosts);

                for (const post of sortedPosts) {
                    if (post.id) {
                        dispatch(fetchTagsByPost(post.id) as any);
                    }
                }
            } catch (error: any) {
                console.error("❌ Error fetching posts:", error);
                if (error.response) {
                    console.error("📋 Response status:", error.response.status);
                    console.error("📋 Response data:", error.response.data);
                }
            }
        };
        fetchPosts();
    }, [dispatch]);

    // 🎧 ESCUCHAR EVENTOS: Escuchar eventos de actualización de posts
    useEffect(() => {
        const handlePostUpdate = (event: CustomEvent) => {
            const { postId, action } = event.detail;

            if (action === 'create') {
                // Para posts nuevos, refrescar toda la lista para asegurar orden correcto
                const fetchPosts = async () => {
                    try {
                        const postService = new PostService();
                        const page = await postService.getAllPosts(0, 100);
                        const posts = page?.content ?? [];
                        const sortedPosts = sortPostsByDate(posts);
                        setFetchedPosts(sortedPosts);

                        // Cargar tags para posts nuevos
                        for (const post of sortedPosts) {
                            if (post.id) {
                                dispatch(fetchTagsByPost(post.id) as any);
                            }
                        }
                    } catch (error) {
                        console.error("❌ Error refrescando posts:", error);
                    }
                };
                fetchPosts();
            }
        };

        // Agregar listener para eventos de actualización
        window.addEventListener('postUpdated', handlePostUpdate as EventListener);

        // Cleanup
        return () => {
            window.removeEventListener('postUpdated', handlePostUpdate as EventListener);
        };
    }, [dispatch, sortPostsByDate]);

    const handleSelect = (item: IPost) => setSelectedPost(item);

    const handleUpdate = async (post: IPost) => {
        try {
            const postService = new PostService();

            let updatedPostWithImages = { ...post };
            if (post.id) {
                try {
                    const postWithImages = await postService.getPostById(post.id);
                    updatedPostWithImages = {
                        ...post,
                        images: postWithImages.images || []
                    };
                } catch (imageError) {
                    console.warn("⚠️ [AdminPostView] Error recargando imágenes:", imageError);

                    // ✅ ACTUALIZACIÓN OPTIMISTA: Actualizar la UI inmediatamente con las imágenes recargadas
                    setFetchedPosts(prev => {
                        const updated = prev.map(p => (p.id === post.id ? { ...p, ...updatedPostWithImages } : p));
                        // 🔄 MANTENER ORDEN: Reordenar después de actualizar para mantener consistencia
                        return sortPostsByDate(updated);
                    });

                    // 🏷️ ACTUALIZAR STORE REDUX: Refrescar las tags en el store después de la actualización
                    if (post.id) {
                        dispatch(fetchTagsByPost(post.id) as any);
                    }
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
                        // ❌ REMOVIDO: tags: [], - Las tags se manejan por separado en useEditPostForm
                        alt_image: (post as any).alt_image || "",
                        source_image: (post as any).source_image || "",
                        alt_avatar: (post as any).alt_avatar || "",
                        source_avatar: (post as any).source_avatar || "",
                        userName: (post as any).userName || "",
                        role: (post as any).role || "",
                        url_avatar: (post as any).url_avatar || ""
                    };

                    await postService.updatePost(post.id, postDTO);
                } catch (error) {
                    console.error("❌ AdminPostView - Error updating post:", error);
                    // En caso de error, revertir la actualización optimista y mantener orden
                    const originalPost = fetchedPosts.find(p => p.id === post.id);
                    if (originalPost) {
                        setFetchedPosts(prev => {
                            const reverted = prev.map(p => (p.id === post.id ? originalPost : p));
                            // 🔄 MANTENER ORDEN después de revertir
                            return sortPostsByDate(reverted);
                        });
                    }
                }
            };

            const handleCreate = async (newPost: IPost) => {
                try {
                    setFetchedPosts(prev => {
                        const exists = prev.some(p => p.id === newPost.id);
                        if (exists) {
                            return prev.map(p => p.id === newPost.id ? newPost : p);
                        } else {
                            return [newPost, ...prev];
                        }
                    });
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
