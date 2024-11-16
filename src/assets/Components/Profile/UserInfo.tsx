import PropTypes from "prop-types";
import { ReactNode } from "react";
import ButtonAjustProfile from "../Blog/admin/button/ajust/ButtonAjustProfile";
import Avatar from "../Blog/admin/header/Avatar";
import styles from './UserInfo.module.scss';
interface UserInfo {
    userId: ReactNode;
    loggedUserName: string;

}

const UserInfo = ({ }: UserInfo) => {

    const userName = sessionStorage.userName;
    console.log(sessionStorage.userName)
    const userId = sessionStorage.userId;
    console.log(sessionStorage.userId)



    const onAjust = (userId: number) => {
        window.location.href = `/Profile/${userId}`;
        return Promise.resolve(true);
    };

    return (
        <div className={styles.userInfo}>
            <Avatar userName={userName} source={""} alt={""} url={""} userId={0} />
            <a
                href={`/Profile/${userId}`}
                className={styles.userName}
            >
                {userName}
            </a>
            <ButtonAjustProfile userId={userId} onAjust={onAjust} label={""} />
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