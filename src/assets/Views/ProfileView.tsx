import ProfileForm from "@/assets/Components/Profile/ProfileForm";
import { IPost } from "@/core/posts/IPost";
import IProfile from "@/core/profiles/IProfile";
import IProfileDTO from "@/core/profiles/IProfileDTO";
import ProfileService from "@/core/profiles/ProfileService";
import React, { useEffect, useState } from "react";
import Profile from "../Components/Profile/Profile";
import styles from "./scss/Views.module.scss";

interface ProfileProps {
    posts: IPost[];
}

const ProfileView: React.FC<ProfileProps> = ({ posts }) => {
    const [login, setLogin] = React.useState<boolean>(false);
    const [register, setRegister] = React.useState<boolean>(false);

    const [userName, setUserName] = React.useState<string>("John Doe");
    const [showProfileForm, setShowProfileForm] = React.useState<boolean>(false);
    const [profile, setProfile] = useState<IProfile | null>(null);

    const profileService = new ProfileService();

    // Obtener el userId desde sessionStorage
    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        if (userId) {
            fetchProfileData(parseInt(userId, 10));
        }
    }, [userId]);

    const fetchProfileData = async (id: number) => {
        if (!id) {
            console.error("Invalid user ID");
            return;
        }

        try {
            const fetchedProfile = await profileService.fetchProfileById(id);
            if (!fetchedProfile) {
                console.error("Profile data not found");
                return;
            }
            setProfile(fetchedProfile);
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    const handleOpenProfileForm = () => setShowProfileForm(true);
    const handleCloseProfileForm = () => setShowProfileForm(false);

    const handleSubmit = async (updatedProfile: IProfileDTO) => {
        if (!profile) {
            console.error("Profile not found");
            return;
        }

        try {
            const updatedData = await profileService.updateProfile(profile.id, updatedProfile);
            setProfile(updatedData);
            setShowProfileForm(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Perfil de Usuario</h1>
            {profile ? (
                <Profile profile={profile} onEdit={handleOpenProfileForm} />
            ) : (
                <p>No profile data available.</p>
            )}

            <ProfileForm
                userId={parseInt(userId || "", 10)}
                setLogin={setLogin}
                setRegister={setRegister}
                setUserName={setUserName}
                onSubmit={handleSubmit}
                profileDTO={undefined}
                profile={profile}
                onSelect={(profile: IProfile) => console.log("Profile selected:", profile)}
                onClose={handleCloseProfileForm}
                show={showProfileForm}
                setRole={(value: React.SetStateAction<string>) => console.log("Role set:", value)}
                setUserId={(value: React.SetStateAction<number>) => console.log("User ID set:", value)}
            />
        </div>
    );
};

export default ProfileView;
