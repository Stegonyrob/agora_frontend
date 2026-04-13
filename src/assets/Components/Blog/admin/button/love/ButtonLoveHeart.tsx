import styles from '@/assets/Components/Blog/admin/button/ButtonIcons.module.scss';
import EventLoveService from '@/core/favorites/EventLoveService';
import PostLoveService from '@/core/favorites/PostLoveService';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";

interface LoveButtonProps {
    postId: number;
    type: 'post' | 'event';
}

const LoveButton: React.FC<LoveButtonProps> = ({
    postId,
    type,
}) => {
    const [lovesCount, setLovesCount] = useState(0);
    const [isLoved, setIsLoved] = useState(false);

    const userId = useSelector((state: RootState) => state.session.userId);


    const loveService =
        type === 'event'
            ? new EventLoveService()
            : new PostLoveService();

    function isEventLoveService(service: any): service is EventLoveService {
        return typeof service.giveLoveRegistered === 'function' && typeof service.giveLoveAnonymous === 'function';
    }
    useEffect(() => {
    }, [userId]);
    useEffect(() => {
        loveService.getLovesCount(postId)
            .then((count: number) => setLovesCount(count))
            .catch(() => setLovesCount(0));
    }, [postId, type]);


    const handleLove = () => {
        if (type === 'event' && isEventLoveService(loveService)) {
            if (userId && userId > 0) {
                // Usuario registrado con perfil
                loveService.giveLoveRegistered(postId, userId).then(() => {
                    setIsLoved(true);
                    setLovesCount(c => c + 1);
                });
            } else {
                // Usuario anónimo
                loveService.giveLoveAnonymous(postId).then(() => {
                    setIsLoved(true);
                    setLovesCount(c => c + 1);
                });
            }
        } else {
            // post
            loveService.giveLove(postId, userId).then(() => {
                setIsLoved(true);
                setLovesCount(c => c + 1);
            });
        }
    };

    const handleUnlove = () => {
        if (type === 'event' && isEventLoveService(loveService)) {
            if (userId && userId > 0) {
                // Usuario registrado con perfil
                loveService.removeLoveRegistered(postId, userId).then(() => {
                    setIsLoved(false);
                    setLovesCount(c => Math.max(0, c - 1));
                });
            } else {
                // Usuario anónimo
                loveService.removeLoveAnonymous(postId).then(() => {
                    setIsLoved(false);
                    setLovesCount(c => Math.max(0, c - 1));
                });
            }
        } else {
            // post
            loveService.removeLove(postId, userId).then(() => {
                setIsLoved(false);
                setLovesCount(c => Math.max(0, c - 1));
            });
        }
    };

    return (
        <button
            className={styles.heartButton}
            onClick={e => {
                e.stopPropagation();
                isLoved ? handleUnlove() : handleLove();
            }}
            aria-label="Me gusta"
            type="button"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
            <i
                className={`bi ${isLoved ? 'bi-heart-fill' : 'bi-heart'}`}
                style={{ color: isLoved ? 'red' : 'white', fontSize: 35, position: 'relative' }}
            >
                <span className={styles.heartCount}>{lovesCount}</span>
            </i>
        </button>
    );
};

export default LoveButton;
