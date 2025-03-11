import styles from '@/assets/Components/Blog/admin/button/ButtonIcons.module.scss';
import FavoriteService from '@/core/favorites/favoriteService';
import { IPost } from '@/core/posts/IPost';
import { useEffect, useState } from 'react';
interface LikeButtonProps {
    userId: number;
    onSelect: (post: IPost) => void;

    posts: IPost[];
    postId: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ userId, onSelect, posts, postId }) => {
    const [likes, setLikes] = useState<number[]>([]);
    const [isLiked, setIsLiked] = useState(false);
    const favoriteService = new FavoriteService();

    useEffect(() => {
        console.log("Fetching favorite post for postId:", postId);
        favoriteService.getFavoritePost(postId)
            .then(response => {
                console.log("Fetched likes:", response);
                setLikes(response);
                setIsLiked(response.includes(userId));
            })
            .catch(error => {
                console.error("Error fetching favorite post:", error);
            });
    }, [postId, userId]);

    const handleLike = () => {
        console.log("Liking postId:", postId);
        favoriteService.giveLike(postId, userId)
            .then(response => {
                console.log("Updated likes after liking:", response);
                setLikes(response);
                setIsLiked(true);
            })
            .catch(error => {
                console.error("Error liking post:", error);
            });
    };

    const handleDislike = () => {
        console.log("Disliking postId:", postId);
        favoriteService.removeLike(postId, userId)
            .then(response => {
                console.log("Updated likes after disliking:", response);
                setLikes(response);
                setIsLiked(false);
            })
            .catch(error => {
                console.error("Error disliking post:", error);
            });
    };

    return (
        <div className={styles.socialIcons}>
            {isLiked ? (
                <i className="bi bi-heart-fill" style={{ color: 'red' }} onClick={handleDislike} />
            ) : (
                <i className="bi bi-heart" onClick={handleLike} />
            )}
            <span>{likes.length} </span>
        </div>
    );
};

export default LikeButton;