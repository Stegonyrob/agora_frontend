import PropTypes from "prop-types";
import React from "react";
import ButtonEditProfile from "../Blog/admin/button/profile/ButtonEditProfile";
import Avatar from "../Blog/admin/header/Avatar";
import styles from './UserInfo.module.scss';
interface UserInfo {
    userId: number;
    loggedUserName: string;
    profile: any;
}

const UserInfo = ({ loggedUserName, profile }: UserInfo) => {

    const userName = sessionStorage.userName ?? "";
    console.log(sessionStorage.userName);
    const userId = sessionStorage.userId ?? "";

    console.log(userId);






    return (
        <div className={styles.userInfo}>
            {userName && (
                <React.Fragment>
                    <Avatar userName={userName} userId={userId} alt_avatar={""} source_avatar={""} url_avatar={""} source={""} />
                    <a
                        href={`/profile/${userId}`}
                        className={styles.userName}
                    >
                        {userName}
                    </a>
                    <ButtonEditProfile onSubmit={() => { }} userId={userId} userName={userName} profile={profile} label={"Editar Perfil"} />
                </React.Fragment>
            )}
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