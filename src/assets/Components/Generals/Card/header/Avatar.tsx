import styles from './Avatar.module.scss';

const DEFAULT_USER_PHOTO_URL = import.meta.env.VITE_DEFAULT_USER_PHOTO_URL;
interface AvatarProps {
    userId: number;
    userName: string;
    alt_avatar: string;
    source_avatar: string;
    url_avatar: string;
    source: string; // Add this line
}

const Avatar: React.FC<AvatarProps> = ({ userId, userName, alt_avatar, source_avatar, url_avatar }) => {

    const source = source_avatar || DEFAULT_USER_PHOTO_URL;
    const alt = alt_avatar || userName || DEFAULT_USER_PHOTO_URL;
    const url = url_avatar || "avatarGeneric";

    return (
        <div>
            <a href={url}>
                <img
                    src={source}
                    alt={alt}
                    className={styles.imageAvatar} />
            </a>
        </div>
    )
}

Avatar.defaultProps = {
    source_avatar: DEFAULT_USER_PHOTO_URL,
    alt_avatar: "random user photo",
    url_avatar: "avatarGeneric"
}

export default Avatar