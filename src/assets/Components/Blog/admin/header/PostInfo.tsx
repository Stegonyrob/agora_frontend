import PropTypes from "prop-types";
import styles from './PostInfo.module.scss';

interface PostInfoProps {
    time: string;
    location: string;
    creatorId: number;
    creatorName: string;
}

const PostInfo: React.FC<PostInfoProps> = ({ time, location, creatorId, creatorName }) => {
    return (
        <div className={styles.userInfo}>
            <a
                className={styles.userName}
            >
                {creatorName}
            </a>
            <p className={styles.time}>
                {time} {location}
            </p>
        </div>
    );
};

PostInfo.propTypes = {
    creatorId: PropTypes.number.isRequired,
    creatorName: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
}

export default PostInfo;