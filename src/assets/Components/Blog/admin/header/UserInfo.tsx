import { ReactNode } from "react";
import styles from './UserInfo.module.scss';
interface UserInfo {
    userId: ReactNode;
    userName: string;
    time: string;
    location: string;
}

const UserInfo = ({ userName, time, location }: UserInfo) => {
    const normalizeUserLink = () => {
        if (userName) {
            return userName.replaceAll(" ", "-");
        } else {
            return "";
        }
    };

    return (
        <div className={styles.userInfo}>
            <a
                href={normalizeUserLink()}
                className={styles.userName}
            >
                {userName}
            </a>
            <p className={styles.time}>
                {time}  {location}
            </p>
        </div>
    );
};

export default UserInfo;