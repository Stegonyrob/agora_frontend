import { ReactNode } from "react";
import styles from './UserInfo.module.scss';

interface UserInfo {
    userId: ReactNode;
    loggedUserName: string;
    time: string;
    location: string;
}

const UserInfo = ({ time, location }: UserInfo) => {

    const userName = sessionStorage.userName;
    console.log(sessionStorage.userName)



    return (
        <div className={styles.userInfo}>
            <a
                href={userName.replace(/\s/g, "-")}
                className={styles.userName}
            >
                {userName}
            </a>
            <p className={styles.time}>
                {time} {location}
            </p>
        </div >
    );
};

export default UserInfo;