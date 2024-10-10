import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../src/redux/reducers/userSlice";
import styles from './Avatar.module.scss';

const DEFAULT_USER_PHOTO_URL = import.meta.env.VITE_DEFAULT_USER_PHOTO_URL;
interface AvatarProps {
    source_avatar: string,
    url_avatar: string,
    alt_avatar: string,
    userId: number,
    userName: string,


}

const Avatar = (AvatarProps: any) => {
    const userId = sessionStorage.userId;
    console.log(sessionStorage.userId)
    const userName = sessionStorage.userName;
    console.log(sessionStorage.userName)

    const user = useSelector((state: RootState) => state.user);
    if (!user) {
        return null;
    }
    const source = user.source_avatar || DEFAULT_USER_PHOTO_URL;
    const alt = userName || DEFAULT_USER_PHOTO_URL;
    const url = user.url_avatar || "avatarGeneric";

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
0
Avatar.propTypes = {
    source: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
}

Avatar.defaultProps = {
    source: DEFAULT_USER_PHOTO_URL,
    alt: "random user photo",
    url: "avatarGeneric"
}

export default Avatar