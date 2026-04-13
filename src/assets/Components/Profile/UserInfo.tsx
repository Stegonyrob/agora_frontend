import React from "react";
import { validateInput } from '../../../utils/validationUtils';
import ButtonEditProfile from "../Blog/admin/button/profile/ButtonEditProfile";

import Avatar from "../Avatar/Avatar";
import styles from './UserInfo.module.scss';

interface UserInfo {
    loggedUserName: string;
    profile: any;
}

const UserInfo = ({ loggedUserName, profile }: UserInfo) => {

    const userName = sessionStorage.userName ?? "";
    const userId = sessionStorage.userId ?? "";

    // Validar los inputs antes de usarlos
    if (!validateInput(userName) || !validateInput(userId)) {
        console.error('Invalid input detected.');
        return null;
    }

    return (
        <div className={styles.userInfo}>
            {userName && (
                <React.Fragment>
                    <Avatar userName={userName} avatarUrl={profile.avatarUrl} onProfile={() => { }} onSettings={() => { }} onLogout={() => { }} />
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
export default UserInfo;