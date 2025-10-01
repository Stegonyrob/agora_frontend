import React, { useEffect, useState } from "react";
import { IPost } from "../../../../core/posts/IPost";
import PostService from "../../../../core/posts/PostService";
import Pagination from "../../Pagination";
import CardItem from "../card/CardItem";
import styles from "../card/CardItem.module.scss";
import CardItemSkeleton from "../card/CardItemSkeleton"; // Importa el esqueleto

interface PostListProps {
    userId: number | null; // Esta prop no se usa en el componente actual
}

interface Page<T> {
    content: T[];
    totalPages: number;
    number: number;
    size: number;
    totalElements: number;
}

// Define la interfaz para los tags tal como los espera CardItem
interface CardItemTag {
    id: number;
    name: string;
    archived?: boolean;
}

// Función para normalizar el formato de los tags antes de pasarlos a CardItem
const mapTagsForCardItem = (rawTags: (string | { id: number; name: string; archived?: boolean })[] | undefined): CardItemTag[] => {
    if (!rawTags) return [];
    return rawTags.map((tag, idx) => {
        if (typeof tag === 'string') {
            return { id: idx, name: tag };
        } else if (typeof tag === 'object' && tag !== null && 'name' in tag) {
            // Si ya es un objeto de tag, asegúrate de que 'id' y 'name' estén presentes
            return { id: tag.id ?? idx, name: tag.name, archived: tag.archived };
        }
        // Fallback para formatos inesperados, aunque no debería ocurrir con las interfaces correctas
        return { id: idx, name: 'Unknown Tag' };
    });
};

const PostList: React.FC<PostListProps> = ({ userId }) => {
    const [fetchedPosts, setFetchedPosts] = useState<IPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const apiPost = new PostService();
    const POSTS_PER_PAGE = 10; // Define cuántos esqueletos mostrar

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setIsLoading(true);
                const pageData: Page<IPost> = await apiPost.getAllPosts(page, POSTS_PER_PAGE);
                setFetchedPosts(pageData.content);
                setTotalPages(pageData.totalPages);
            } catch (error) {
                console.error("Error loading posts: ", error);
                // Opcional: Manejar el estado de error para mostrar un mensaje al usuario
            } finally {
                setIsLoading(false);
            }
        };
        loadPosts();
    }, [page]);

    const handleSelect = (item: any) => {
        console.log("Selected item:", item);
        // Aquí podrías añadir lógica para la selección del post si es necesario
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div>
            <div className={styles.cardContainer}>
                {isLoading ? (
                    // Muestra 10 esqueletos de tipo 'post' mientras carga
                    Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
                        <CardItemSkeleton key={index} type="post" />
                    ))
                ) : (
                    // Muestra solo los posts no archivados
                    fetchedPosts
                        .filter(post => !post.isArchived && !post.archived)
                        .map((post) => (
                            <CardItem
                                key={post.id}
                                type="post"
                                id={post.id}
                                title={post.title}
                                description={post.message}
                                creationDate={post.creationDate}
                                lovesCount={post.favoritesCount ?? 0}
                                commentsCount={post.commentsCount ?? 0}
                                images={post.images || post.image}
                                tags={mapTagsForCardItem(post.tags)}
                                user={post.user}
                                userRole={post.userRole}
                                attendeesCount={post.attendeesCount ?? 0}
                                onSelect={handleSelect}
                                eventDate={post.eventDate}
                                eventTime={post.eventTime}
                            />
                        ))
                )}
            </div>

            {/* La paginación solo se muestra si no está cargando y hay contenido */}
            {!isLoading && totalPages > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default PostList;