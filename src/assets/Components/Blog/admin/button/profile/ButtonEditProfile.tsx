import React, { useEffect, useState } from "react";
import styles from '../ButtonIcons.module.scss';

import ProfileForm from "@/assets/Components/Profile/ProfileForm";
import IProfile from '@/core/profiles/IProfile';
import IProfileDTO from '@/core/profiles/IProfileDTO';
import ProfileService from "@/core/profiles/ProfileService";


interface User {
    userId: number;
    username: string;
    role: string;
    profile: IProfile | null;
    profileDTO: IProfileDTO | null;

}


interface ButtonEditProps {
    userId: number;
    userName: string;
    profile: IProfile | null;
    onSubmit: (profile: IProfileDTO) => void;
    label: string;
}

const ButtonEditProfile: React.FC<ButtonEditProps> = ({ userId, userName, onSubmit }) => {
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<IProfile | null>(null);
    const apiProfile = new ProfileService();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const fetchedProfileById = await apiProfile.fetchProfileById(userId);
                setSelectedProfile(fetchedProfileById);
            } catch (error) {
                console.error("Error loading profile: ", error);
            }
        };
        loadProfile();
    }, [userId]);

    const handleSelect = (profile: IProfile) => {
        setSelectedProfile(profile);
    };

    const handleShow = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleUpdate = async (updatedProfile: IProfileDTO) => {
        await apiProfile.updateProfile(userId, updatedProfile);
        onSubmit(updatedProfile);
    };

    return (



        <div className={styles.socialIcons}>
            <span className={styles.socialIcons} onClick={handleShow}>
                <i
                    className="bi bi-gear-fill"
                    onClick={handleShow}
                />
            </span>
            {selectedProfile && (
                <ProfileForm
                    profile={selectedProfile as IProfileDTO}
                    onSelect={handleSelect}
                    onSubmit={handleUpdate}
                    onClose={handleCloseModal}
                    show={showModal}
                    userId={userId}
                />
            )}
        </div>
    );
};
export default ButtonEditProfile;