import IProfile from "@/core/profiles/IProfile";
import React from "react";
import styles from "./Profile.module.scss";

interface ProfileProps {
    profile?: IProfile;
    onEdit: () => void;
}
const Profile: React.FC<ProfileProps> = ({ profile, onEdit }) => {
    if (!profile) {
        return <p>No profile data available.</p>;
    }

    return (
        <div className={styles.profileContainer}>
            <img className={styles.avatar} src={profile.avatar} alt="Profile Avatar" />
            <p><strong>Nombre:</strong> {profile.firstName} </p>
            <p><strong>Primer Apellido:</strong> </p>
            <p><strong>Segundo Apellido:</strong> {profile.lastName2}</p>
            <p><strong>Parentesco:</strong> {profile.relationship}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Ciudad:</strong> {profile.city}</p>
            <p><strong>País:</strong> {profile.country}</p>
            <p><strong>Teléfono:</strong> {profile.phone}</p>
            <button onClick={onEdit} className={styles.editButton}>Editar Perfil</button>
        </div>
    );
};
export default Profile;
