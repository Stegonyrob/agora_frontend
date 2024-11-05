import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { IPost } from '../../../../../core/posts/IPost';
import { IPostDTO } from '../../../../../core/posts/IPostDTO';
import PostsService from '../../../../../core/posts/PostService';
import PostForm from '../PostForm';
import PostCard from './PostItem';
import styles from './PostListAdmin.module.scss';

interface PostList {
    post: IPost[];
    onSelect: (post: IPost) => void;
    onDelete: (postId: number) => Promise<void>;
    onClose: () => void;
    onEdit: (post: IPost) => void;
    onCreate: (post: IPost) => void;
    userId: number | null;
    postId: number;

    onArchive: (postId: number) => Promise<boolean>;
    onUnarchive: (postId: number) => Promise<boolean>;
    onSubmit: (post: IPost) => void;

}



const PostListAdmin = ({ userId }: { userId: number }, { post }: PostList) => {
    const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
    const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);
    const [showForm, setShowForm] = React.useState(false);

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
            await apiPost.deletePost(postId);
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
            const updatedPostData: IPostDTO = {
                title: updatedPost.title,
                message: updatedPost.message,
                id: updatedPost.id,
                userId: 0,
                location: '',
                loves: 0,
                comments: [],
                isArchived: false,
                tags: [],
                images: [],
                isPublished: false,
                publishDate: '',
                alt_image: '',
                source_image: '',
                alt_avatar: '',
                source_avatar: '',
                username: '',
                role: '',
                url_avatar: '',
                creation_date: new Date(),
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
    const handleCreate = async (newPost: IPostDTO) => {
        try {
            const createdPost = await apiPost.createPost(newPost);
            console.log(`Post with ID: ${createdPost.id} created successfully.`);
            alert("Post creado exitosamente");
            setFetchedPosts([...fetchedPosts, createdPost]);
        } catch (error) {
            console.error("Error creating post: ", error);
            alert("No se pudo crear el post, por favor intentenlo más tarde, por favor disculpen las molestias");
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
                creation_date: new Date(),
                userId: 0,
                location: '',
                loves: 0,
                comments: [],
                isArchived: false,
                tags: [],
                images: [],
                isPublished: false,
                publishDate: '',
                alt_image: '',
                source_image: '',
                alt_avatar: '',
                source_avatar: '',
                username: '',
                role: '',
                url_avatar: ''
            };

            const result = await handleCreate(newPost);
        } catch (error) {
            console.error("Error submitting post: ", error);
        }
    };

    const handleArchive = async (postId: number): Promise<void> => {
        if (postId === null || postId === undefined) {
            console.error("Error archiving post: postId is null or undefined");
            return;
        }

        try {
            const result = await apiPost.archivePost(postId);
            if (result) {
                console.log(`Post with ID: ${postId} archived successfully.`);
                setFetchedPosts(fetchedPosts.map((post: IPost) => post.id === postId ? { ...post, isArchived: true } : post));
            } else {
                console.error(`Failed to archive post with ID: ${postId}`);
            }
        } catch (error) {
            console.error("Error archiving post: ", error);
        }
    };


    const handleUnArchive = async (postId: number): Promise<void> => {
        try {
            await apiPost.unArchivePost(postId);
            console.log(`Post with ID: ${postId} archived successfully.`);
            setFetchedPosts(fetchedPosts.map((post: IPost) => post.id === postId ? { ...post, isArchived: true } : post));
        } catch (error) {
            console.error("Error archiving post: ", error);
        }

    };
    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <h4 className={styles.title}>Lista de Posts</h4>
                <Button variant="primary" onClick={handleCreatePost}>
                    Crear Post
                </Button>
                {showForm && (
                    <PostForm
                        onClose={() => setShowForm(false)}
                        onSubmit={async (post) => console.log(post)} show={false} />
                )}
                <div className={styles.panelBody}>
                    {fetchedPosts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onSelect={handleSelect}
                            onDelete={handleDelete}
                            onArchive={handleArchive}

                            onUnarchive={handleUnArchive}
                            onSubmit={handleUpdate}

                            onEdit={handleUpdate}

                            userId={userId}
                            postId={post.id} onCreate={function (): void {
                                ;
                            }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostListAdmin;


// import { useEffect, useState } from 'react';
// import { IPost } from '../../../../../core/posts/IPost';
// import { IPostDTO } from '../../../../../core/posts/IPostDTO';
// import PostsService from '../../../../../core/posts/PostService';
// import styles from './PostListAdmin.module.scss';


// interface PostList {
//     post: IPost[];
//     onSelect: (post: IPost) => void;
//     onDelete: (postId: number) => Promise<void>;
//     onClose: () => void;
//     onEdit: (post: IPost) => void;
//     onCreate: (post: IPost) => void;
//     userId: number | null;
//     postId: number;
// }



// const PostListAdmin = ({ userId }: { userId: number }, { post }: PostList) => {
//     const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
//     const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);
//     const apiPost = new PostsService();

//     useEffect(() => {
//         const loadPosts = async () => {
//             try {
//                 const fetchedPosts = await apiPost.fetchPosts();
//                 setFetchedPosts(fetchedPosts);
//             } catch (error) {
//                 console.error("Error loading posts: ", error);
//             }
//         };
//         loadPosts();
//     }, []);

//     const handleSelect = (post: IPost) => {
//         setSelectedPost(post);
//     };

//     const handleClose = () => {
//         setSelectedPost(null);
//     };

//     const handleDelete = async (postId: number) => {
//         try {
//             await apiPost.deletePost(Number(postId));
//             console.log(`Post with ID: ${postId} deleted successfully.`);
//             setFetchedPosts(fetchedPosts.filter((post: { id: number; }) => post.id !== Number(postId)));
//         } catch (error) {
//             console.error("Error deleting post: ", error);
//         }
//     };

//     const handleUpdate = async (updatedPost: IPost) => {
//         try {
//             const updatedPostData: IPostDTO = {
//                 title: updatedPost.title,
//                 message: updatedPost.message,
//                 id: updatedPost.id,
//                 userId: 0,
//                 location: '',
//                 loves: 0,
//                 comments: [],
//                 isArchived: false,
//                 tags: [],
//                 images: [],
//                 isPublished: false,
//                 publishDate: '',
//                 alt_image: '',
//                 source_image: '',
//                 alt_avatar: '',
//                 source_avatar: '',
//                 username: '',
//                 role: '',
//                 url_avatar: '',
//                 creation_date: new Date,
//             };
//             const updatedPostResponse = await apiPost.updatePost(updatedPostData, updatedPost.id);
//             console.log(`Post with ID: ${updatedPost.id} updated successfully.`);
//             const message = updatedPostResponse.message || "Default message";
//             alert(`Post editado exitosamente: ${message}`);
//             setFetchedPosts(fetchedPosts.map((post: IPost) => post.id === updatedPost.id ? updatedPostResponse : post));
//         } catch (error) {
//             console.error("Error updating post: ", error);
//             alert(`No se pudo editar el post, por favor intentenlo más tarde, por favor disculpen las molestias`);
//         }
//     };

//     const handleCreate = async (newPost: IPost) => {
//         try {
//             const newPostData: IPostDTO = {
//                 title: newPost.title,
//                 message: newPost.message,
//                 id: newPost.id,
//                 userId: newPost.userId as number,
//                 creation_date: new Date,
//                 location: '',
//                 loves: 0,
//                 comments: [],
//                 isArchived: false,
//                 tags: [],
//                 images: [],
//                 isPublished: false,
//                 publishDate: '',
//                 alt_image: '',
//                 source_image: '',
//                 alt_avatar: '',
//                 source_avatar: '',
//                 username: '',
//                 role: '',
//                 url_avatar: ''
//             };

//             const createdPost = await apiPost.createPost(newPostData);
//             console.log(`Post with ID: ${createdPost.id} created successfully.`);
//             alert(`Post creado exitosamente`);
//             setFetchedPosts([...fetchedPosts, createdPost]);
//         } catch (error) {
//             console.error("Error creating post: ", error);
//             alert(`No se pudo crear el post, por favor intentenlo más tarde, por favor disculpen las molestias`);
//         }
//     };

//     const onSubmit = async (post: IPostDTO) => {
//         if (post === null || post === undefined) {
//             console.error("Error submitting post: post is null or undefined");
//             return;
//         }

//         if (post.id === null || post.id === undefined) {
//             console.error("Error submitting post: post.id is null or undefined");
//             return;
//         }

//         if (post.id) {
//             try {
//                 await handleUpdate(post);
//             } catch (error) {
//                 console.error("Error updating post: ", error);
//             }
//         } else {
//             try {
//                 await handleCreate(post);
//             } catch (error) {
//                 console.error("Error creating post: ", error);
//             }
//         }
//     };

//     const handleArchive = async (postId: number): Promise<void> => {
//         if (postId === null || postId === undefined) {
//             console.error("Error archiving post: postId is null or undefined");
//             return;
//         }

//         try {
//             const result = await apiPost.archivePost(postId);
//             if (result) {
//                 console.log(`Post with ID: ${postId} archived successfully.`);
//                 setFetchedPosts(fetchedPosts.map((post: IPost) => post.id === postId ? { ...post, isArchived: true } : post));
//             } else {
//                 console.error(`Failed to archive post with ID: ${postId}`);
//             }
//         } catch (error) {
//             console.error("Error archiving post: ", error);
//         }
//     };
//     return (
//         <div className={styles.container}>
//             <div className={styles.panelHeading}>
//                 <h4 className={styles.title}>Lista de posts</h4>
//                 <div className={styles.btnGroup}>
//                     <button className="btn btn-default" title="Crear post" onClick={handleCreate}><i className="bi bi-plus-circle"></i></button>
//                 </div>
//             </div>
//             <div className={styles.panel}>
//                 <div className={styles.panelHeading}>
//                     <h4 className={styles.title}>Lista de Posts</h4>
//                     <div className={styles.btnGroup}>
//                         <input type="text" className="form-control" placeholder="Search" />
//                         <button className="btn btn-default" title="Reload"><i className="bi bi-arrow-repeat"></i></button>
//                         <button className="btn btn-default" title="Pdf"><i className="bi bi-file-earmark-pdf-fill"></i></button>
//                         <button className="btn btn-default" title="Excel"><i className="bi bi-file-earmark-excel-fill"></i></button>
//                     </div>
//                 </div>
//                 <div className={styles.panelBody}>
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>Numero de Post</th>
//                                 <th>Fecha de creación</th>
//                                 <th>Estado de publicación</th>
//                                 <th>Title</th>
//                                 <th>Mensaje</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {fetchedPosts.map(post => (
//                                 <tr key={post.id}>
//                                     <td>{post.id}</td>
//                                     <td>{post.creation_date}</td>
//                                     <td>{post.isPublished ? 'Publicado' : 'No publicado'}</td>
//                                     <td>{post.title}</td>
//                                     <td>{post.message}</td>
//                                     <td>
//                                         <ul className={styles.actionList}>
//                                             <li><a href="#" data-tip="edit"><i className="bi bi-pencil-square"></i></a></li>
//                                             <li><a href="#" data-tip="delete"><i className="bi bi-trash"></i></a></li>
//                                         </ul>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//                 <div className={styles.panelFooter}>
//                     <div>Mostrando <b>{fetchedPosts.length}</b> de <b>25</b> entradas</div>
//                     <ul className="pagination">
//                         <li><a href="#">1</a></li>
//                         <li><a href="#">2</a></li>
//                         <li><a href="#">3</a></li>
//                         <li><a href="#">4</a></li>
//                         <li><a href="#">5</a></li>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PostListAdmin;