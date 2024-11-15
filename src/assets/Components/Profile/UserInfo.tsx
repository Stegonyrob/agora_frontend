import PropTypes from "prop-types";
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
    const userId = sessionStorage.userId;
    console.log(sessionStorage.userId)



    return (
        <div className={styles.userInfo}>
            <a
                href={`/Profile/${userId}`}
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
UserInfo.propTypes = {
    userId: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
}
export default UserInfo;