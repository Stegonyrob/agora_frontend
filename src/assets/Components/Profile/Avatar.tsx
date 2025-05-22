import PropTypes from 'prop-types';
import React from 'react';
import styles from './Avatar.module.scss';

interface AvatarProps {
    userName: string;
    userId: number;
    alt_avatar: string;
    source_avatar: string;
    url_avatar: string;
    source: string;
}
const Avatar: React.FC<AvatarProps> = ({ userName, userId, alt_avatar, source_avatar, url_avatar, source }) => {
    return (
        <div className={styles.avatarContainer}>
            <img src={url_avatar} alt={alt_avatar} className={styles.avatarImage} />
            <h2 className={styles.avatarName}>{userName}</h2>
        </div>
    )
}
Avatar.propTypes = {
    userName: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    alt_avatar: PropTypes.string.isRequired,
    source_avatar: PropTypes.string.isRequired,
    url_avatar: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
}
Avatar.defaultProps = {
    userName: 'User Name',
    userId: 0,
    alt_avatar: 'Avatar',

    source_avatar: 'Source Avatar',
    url_avatar: 'https://via.placeholder.com/150',
    source: 'Source',
}
export default Avatar;