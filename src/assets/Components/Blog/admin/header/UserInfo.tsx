import { ReactNode } from "react";
import styles from './UserInfo.module.scss';
interface UserInfo {
    userId: ReactNode;
    username: string;
    time: string;
    location: string;
}

const UserInfo = ({ username, time, location }: UserInfo) => {
    const normalizeUserLink = () => {
        return username.replaceAll(" ", "-");
    };

    return (
        <div className={styles.userInfo}>
            <a
                href={normalizeUserLink()}
                className={styles.userName}
            >
                {username}
            </a>
            <p className={styles.time}>
                {time}  {location}
            </p>
        </div>
    );
};

export default UserInfo;