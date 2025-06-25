import styles from '@/assets/Components/Blog/admin/button/ButtonIcons.module.scss';
import EventFavoriteService from '@/core/favorites/EventFavoriteService';
import PostFavoriteService from '@/core/favorites/PostFavoriteService';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";

interface LikeButtonProps {
    postId: number;
    type: 'post' | 'event';

}

const LikeButton: React.FC<LikeButtonProps> = ({
    postId,
    type,

}) => {
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);


    const userId = useSelector((state: RootState) => state.session.userId);
    console.log("userId desde LikeButton:", userId);



    const favoriteService =
        type === 'event'
            ? new EventFavoriteService()
            : new PostFavoriteService();
    useEffect(() => {
        console.log("userId recibido en LikeButton:", userId);
        console.log(userId);
    }, [userId]);
    useEffect(() => {
        if (type === 'post') {
            favoriteService.getLovesCount(postId)
                .then((count: number) => setFavoritesCount(count))
                .catch(() => setFavoritesCount(0));
        }
        // Si quieres, puedes hacer lo mismo para eventos
    }, [postId, type]);

    const handleLike = () => {
        favoriteService.giveLike(postId, userId).then(() => {
            setIsLiked(true);
            setFavoritesCount(c => c + 1);
        });
    };

    const handleDislike = () => {
        favoriteService.removeLike(postId, userId).then(() => {
            setIsLiked(false);
            setFavoritesCount(c => Math.max(0, c - 1));
        });
    };

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
                style={{ color: isLiked ? 'red' : 'white', fontSize: 35, position: 'relative' }}
            >
                <span className={styles.heartCount}>{favoritesCount}</span>
            </i>
        </button>
    );
};

export default LikeButton;