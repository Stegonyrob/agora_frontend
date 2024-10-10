import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { LoginState } from "../../../../../redux/reducers/loginSlice";
import styles from './UserInfo.module.scss';

interface UserInfo {
    userId: ReactNode;
    userName: string;
    time: string;
    location: string;
}

const UserInfo = ({ time, location }: UserInfo) => {
    const loggedUserName = useSelector((state: LoginState) => state.loggedUserName);

    if (!loggedUserName) {
        return null;
    }

    return (
        <div className={styles.userInfo}>
            <a
                href={loggedUserName.replace(/\s/g, "-")}
                className={styles.userName}
            >
                {loggedUserName}
            </a>
            <p className={styles.time}>
                {time} {location}
            </p>
        </div >
    );
};

export default UserInfo;