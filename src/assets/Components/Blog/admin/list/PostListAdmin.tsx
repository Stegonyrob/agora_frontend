import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import { IPost } from '../../../../../core/posts/IPost';
import { IPostDTO } from '../../../../../core/posts/IPostDTO';
import PostsService from '../../../../../core/posts/PostService';
import ButtonCreatePost from '../button/create/ButtonCreatePost';
import PostCard from './PostItem';
import styles from './PostListAdmin.module.scss';

interface PostList {
    post: IPost[];
    onSelect: (post: IPost) => void;
    onDelete: (postId: number) => Promise<void>;
    onClose: () => void;
    onEdit: (post: IPost) => void;
    onCreate: (newPost: IPostDTO) => Promise<void>
    userId: number | null;
    postId: number;
    onArchive: (postId: number) => Promise<boolean>;
    onUnarchive: (postId: number) => Promise<boolean>;
    onSubmit: (post: IPost) => void;
    onHide: () => void;
    role: string | null;
    userName: string | null;
    userRole: string | null;
}



const PostListAdmin = ({ userId }: { userId: number }, { post }: PostList,) => {
    const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
    const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);
    const [showForm, setShowForm] = React.useState(false);

    // Obtener userId y userRole desde sessionStorage
    const userRole = sessionStorage.getItem("role");
    const userName = sessionStorage.getItem("userName");
    console.log("userName:", userName);
    console.log("userId:", userId);
    console.log("userRole:", userRole);
    // Verificar si el usuario es admin
    if (userRole !== "admin") {
        console.error("Access denied: Only administrators can access this page.");
        alert("Acceso denegado: Solo los administradores pueden acceder a esta página.");
        return null; // Evitar renderizar el componente si no es admin
    }



    console.log("userId:", userId);
    console.log("userRole:", userRole);
    console.log("userName:", userName);
    const handleCreatePost = () => {
        setShowForm(true);
    };

    const apiPost = new PostsService();

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const fetchedPosts = await apiPost.fetchPosts();
                if (fetchedPosts) {
                    setFetchedPosts(fetchedPosts);
                } else {
                    console.warn("Fetched posts are null or undefined");
                }
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
            if (postId === null || postId === undefined) {
                throw new Error("PostId is null or undefined");
            }
            const postToDelete = fetchedPosts.find((post: IPost) => post.id === postId);
            if (postToDelete) {
                const postDTO: IPostDTO = {
                    id: postToDelete.id,
                    title: postToDelete.title,
                    message: postToDelete.message,
                    location: postToDelete.location,
                    loves: postToDelete.loves,
                    comments: postToDelete.comments,
                    isArchived: postToDelete.isArchived,
                    tags: postToDelete.tags,
                    images: postToDelete.images,
                    isPublished: postToDelete.isPublished,

                    alt_image: postToDelete.alt_image,
                    source_image: postToDelete.source_image,
                    alt_avatar: postToDelete.alt_avatar,
                    source_avatar: postToDelete.source_avatar,

                    role: postToDelete.role,
                    url_avatar: postToDelete.url_avatar,
                    userId: postToDelete.userId,
                    userName: postToDelete.userName,

                };
                await apiPost.deletePost(postDTO, postId);
            } else {
                console.error(`Post with ID: ${postId} not found.`);
            }
            console.log(`Post with ID: ${postId} deleted successfully.`);
            setFetchedPosts(fetchedPosts.filter((post: IPost) => post.id !== postId));
        } catch (error) {
            console.error("Error deleting post: ", error);
        }
    };

    const handleUpdate = async (updatedPost: IPost) => {
        try {
            if (!updatedPost) {
                throw new Error("Updated post is null or undefined");
            }

            // Sanitize inputs
            updatedPost.title = DOMPurify.sanitize(updatedPost.title);
            updatedPost.message = DOMPurify.sanitize(updatedPost.message);

            const updatedPostData: IPostDTO = {
                title: updatedPost.title,
                message: updatedPost.message,
                id: updatedPost.id,

                location: '',
                loves: 0,
                comments: [],
                isArchived: false,
                tags: [],
                images: [],
                isPublished: false,

                alt_image: '',
                source_image: '',
                alt_avatar: '',
                source_avatar: '',
                userId: 0,
                userName: '',

                role: '',
                url_avatar: '',

            };
            const updatedPostResponse = await apiPost.updatePost(updatedPostData, updatedPost.id);
            console.log(`Post with ID: ${updatedPost.id} updated successfully.`);
            const message = updatedPostResponse.message || "Default message";
            alert(`Post editado exitosamente: ${message}`);
            setFetchedPosts(fetchedPosts.map((post: IPost) => post.id === updatedPost.id ? updatedPostResponse : post));
        } catch (error) {
            console.error("Error updating post: ", error);
            alert("No se pudo editar el post, por favor intentenlo más tarde, por favor disculpen las molestias");
        }
    };
    const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            if (!event) {
                throw new Error("Event is null or undefined");
            }

            const newPost: IPostDTO = {
                id: 0,
                title: '',
                message: '',

                location: '',
                loves: 0,
                comments: [],
                isArchived: false,
                tags: [],
                images: [],
                isPublished: false,

                alt_image: '',
                source_image: '',
                alt_avatar: '',
                source_avatar: '',
                userId: 0,
                userName: '',

                role: '',
                url_avatar: ''
            };

            // Sanitize inputs
            newPost.title = DOMPurify.sanitize(newPost.title);
            newPost.message = DOMPurify.sanitize(newPost.message);

            const result = await handleCreate(newPost);
        } catch (error) {
            console.error("Error submitting post: ", error);
        }
    };

    const handleArchive = async (postId: number): Promise<boolean> => {
        try {
            const post = fetchedPosts.find((post: IPost) => post.id === postId);
            if (!post) {
                console.error(`Error archiving post: Post with ID: ${postId} not found`);
                return false;
            }

            const result = await apiPost.archivePost(postId, true);
            if (result) {
                console.log(`Post with ID: ${postId} archived successfully.`);
                setFetchedPosts(fetchedPosts.map((post: IPost) => post.id === postId ? { ...post, isArchived: true } : post));
                return true;
            } else {
                console.error(`Failed to archive post with ID: ${postId}`);
                return false;
            }
        } catch (error) {
            console.error("Error archiving post: ", error);
            return false;
        }
    };


    const handleUnArchive = async (postId: number): Promise<boolean> => {
        try {
            await apiPost.unArchivePost(postId, false);
            console.log(`Post with ID: ${postId} unarchived successfully.`);
            setFetchedPosts(fetchedPosts.map((post: IPost) => post.id === postId ? { ...post, isArchived: false } : post));
            return true;
        } catch (error) {
            console.error("Error unarchiving post: ", error);
            return false;
        }
    };

    const handleCreate = async (newPost: IPostDTO | null | undefined) => {
        if (newPost == null) {
            console.error("Error creating post: newPost is null or undefined");
            return;
        }

        // Sanitize inputs
        newPost.title = DOMPurify.sanitize(newPost.title);
        newPost.message = DOMPurify.sanitize(newPost.message);

        try {
            const createdPost = await apiPost.createPost(newPost);
            if (createdPost == null || createdPost.id == null) {
                console.error("Error creating post: createdPost is null or undefined or createdPost.id is null or undefined");
                return;
            }

            if (isNaN(createdPost.id)) {
                console.error("Error creating post: createdPost.id is not a number");
                return;
            }

            console.log(`Post with ID: ${createdPost.id} created successfully.`);
            alert("Post creado exitosamente");
            setFetchedPosts([...fetchedPosts, createdPost]);
            setShowForm(false);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error creating post: ", error);
                alert(`No se pudo crear el post: ${error.message}. Inténtelo de nuevo más tarde.`);
            } else {
                console.error("Error creating post: unknown error");
                alert("No se pudo crear el post, por favor intentenlo más tarde.");
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <h4 className={styles.title}>Lista de Posts</h4>
                <ButtonCreatePost onSubmit={handleCreate} userId={userId} userName={''} userRole={''} />

                <div className={styles.panelBody}>
                    {fetchedPosts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onSelect={handleSelect}
                            onDelete={handleDelete}
                            onSubmit={handleUpdate}
                            onEdit={handleUpdate}
                            userId={userId} onArchive={handleArchive} onUnArchive={handleUnArchive} postId={0} onCreate={handleCreate}


                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostListAdmin;