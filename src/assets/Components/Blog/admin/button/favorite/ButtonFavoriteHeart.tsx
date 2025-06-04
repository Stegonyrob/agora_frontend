import styles from '@/assets/Components/Blog/admin/button/ButtonIcons.module.scss';
import EventFavoriteService from '@/core/favorites/EventFavoriteService';
import PostFavoriteService from '@/core/favorites/PostFavoriteService';
import { IPost } from '@/core/posts/IPost';
import { useEffect, useState } from 'react';

interface LikeButtonProps {
    userId: number;
    onSelect: (post: IPost) => void;
    posts: IPost[];
    postId: number;
    requireLogin?: boolean;
    type: 'post' | 'event';
}

const LikeButton: React.FC<LikeButtonProps> = ({
    userId,
    onSelect,
    posts,
    postId,
    requireLogin = false,
    type
}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [animate, setAnimate] = useState(false);

    const favoriteService =
        type === 'event'
            ? new EventFavoriteService()
            : new PostFavoriteService();

    const isAuthenticated = !!userId && userId !== 0;

    useEffect(() => {
        if (type === 'post') {
            if (!isAuthenticated) {
                setIsLiked(false);
                return;
            }
            // @ts-expect-error: getFavorite solo existe en PostFavoriteService
            favoriteService.getFavorite(postId, userId)
                .then((response: number[]) => {
                    const liked = response.includes(userId);
                    setIsLiked(liked);
                })
                .catch((error: unknown) => {
                    console.error("Error fetching favorite:", error);
                });
        }
        // Para eventos, no hay getFavorite, así que no hacemos nada
    }, [postId, userId, type, isAuthenticated]);

    const handleLike = () => {
        if (type === 'post') {
            if (!isAuthenticated) {
                alert("Debes iniciar sesión para dar like.");
                return;
            }

            favoriteService.giveLike(postId, userId)
                .then(() => {
                    setIsLiked(true);
                    setAnimate(true);
                })
                .catch((error: unknown) => console.error("Error liking:", error));
        } else if (type === 'event') {
            (favoriteService as EventFavoriteService).giveLike(postId)
                .then(() => {
                    setIsLiked(true);
                    setAnimate(true);
                })
                .catch((error: unknown) => console.error("Error liking event:", error));
        }
    };

    const handleDislike = () => {
        if (type === 'post') {
            if (!isAuthenticated) {
                alert("Debes iniciar sesión para quitar el like.");
                return;
            }

            favoriteService.removeLike(postId, userId)
                .then(() => {
                    setIsLiked(false);
                    setAnimate(true);
                })
                .catch((error: unknown) => console.error("Error disliking:", error));
        } else if (type === 'event') {
            (favoriteService as EventFavoriteService).removeLike(postId)
                .then(() => {
                    setIsLiked(false);
                    setAnimate(true);
                })
                .catch((error: unknown) => console.error("Error disliking event:", error));
        }
    };

    const handleAnimationEnd = () => {
        setAnimate(false);
    };

    if (type === 'post' && !isAuthenticated) return null;

    return (
        <button
            className={styles.heartWrapper}
            onClick={e => {
                e.stopPropagation();
                if (isLiked) {
                    handleDislike();
                } else {
                    handleLike();
                }
                const selectedPost = posts.find(post => post.id === postId);
                if (onSelect && selectedPost) {
                    onSelect(selectedPost);
                }
            }}
            aria-label="Favorito"
            type="button"
        >
            <i
                className={`fa${isLiked ? 's' : 'r'} fa-heart ${isLiked ? styles.backgroundHeart : ''}`}
                onAnimationEnd={handleAnimationEnd}
            />
        </button>
    );
};

export default LikeButton;