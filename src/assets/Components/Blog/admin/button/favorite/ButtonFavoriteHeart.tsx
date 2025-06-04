import styles from '@/assets/Components/Blog/admin/button/ButtonIcons.module.scss';
import EventFavoriteService from '@/core/favorites/EventFavoriteService';
import PostFavoriteService from '@/core/favorites/PostFavoriteService';
import { useEffect, useState } from 'react';

interface LikeButtonProps {
    userId: number;
    postId: number;
    requireLogin?: boolean;
    type: 'post' | 'event';
}

const LikeButton: React.FC<LikeButtonProps> = ({
    userId,
    postId,
    requireLogin = false,
    type
}) => {
    const [isLiked, setIsLiked] = useState(false);

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
                .catch(() => setIsLiked(false));
        }
        // Para eventos, no hay getFavorite, así que no hacemos nada
    }, [postId, userId, type, isAuthenticated]);

    const handleLike = () => {
        if (type === 'post') {
            if (!isAuthenticated) {
                alert("Debes iniciar sesión para dar like.");
                return;
            }

            favoriteService.giveLike(postId, userId).then(() => setIsLiked(true));
        } else if (type === 'event') {
            (favoriteService as EventFavoriteService).giveLike(postId).then(() => setIsLiked(true));
        }
    };

    const handleDislike = () => {
        if (type === 'post') {
            if (!isAuthenticated) {
                alert("Debes iniciar sesión para quitar el like.");
                return;
            }

            favoriteService.removeLike(postId, userId).then(() => setIsLiked(false));
        } else if (type === 'event') {
            (favoriteService as EventFavoriteService).removeLike(postId).then(() => setIsLiked(false));
        }
    };

    if (type === 'post' && !isAuthenticated) return null;

    return (
        <button
            className={styles.heartButton}
            onClick={e => {
                e.stopPropagation();
                isLiked ? handleDislike() : handleLike();
            }}
            aria-label="Favorito"
            type="button"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
            <i
                className={`fa${isLiked ? 's' : 'r'} fa-heart`}
                style={{ color: isLiked ? 'red' : 'white', fontSize: 28 }}
            />
        </button>
    );
};

export default LikeButton;