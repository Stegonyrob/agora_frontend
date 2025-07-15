import ProfileForm from "@/assets/Components/Profile/ProfileForm";
import { updateAvatarUrl } from "@/core/auth/sessionStore";
import { IPost } from "@/core/posts/IPost";
import IProfile from "@/core/profiles/IProfile";
import IProfileDTO from "@/core/profiles/IProfileDTO";
import ProfileService from "@/core/profiles/ProfileService";
import { useAvatars } from "@/hooks/useAvatars";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AdminManager from "../Components/Blog/admin/users/AdminManager";
import Profile from "../Components/Profile/Profile";
import styles from "./scss/Views.module.scss";

interface ProfileProps {
    posts: IPost[];
}

const ProfileView: React.FC<ProfileProps> = ({ posts }) => {
    const dispatch = useDispatch();
    const { getAvatarImageUrl, avatars, defaultAvatar, isLoaded } = useAvatars();
    const [login, setLogin] = React.useState<boolean>(false);
    const [register, setRegister] = React.useState<boolean>(false);

    const [userName, setUserName] = React.useState<string>("John Doe");
    const [showProfileForm, setShowProfileForm] = React.useState<boolean>(false);
    const [profile, setProfile] = useState<IProfile | null>(null);

    const profileService = new ProfileService();

    // Obtener el userId desde sessionStorage
    const userId = sessionStorage.getItem("userId");

    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        if (userId) {
            const role = sessionStorage.getItem('role');
            const admin = role === 'ROLE_ADMIN';
            setIsAdmin(admin);
            fetchProfileData(parseInt(userId, 10), admin);
        }
    }, [userId]);

    // Efecto para actualizar el avatar cuando los avatares se cargan
    useEffect(() => {
        if (profile && isLoaded) {
            updateSessionAvatar(profile);
        }
    }, [isLoaded, avatars]);

    const fetchProfileData = async (id: number, isAdmin: boolean) => {
        if (!id) {
            console.error("Invalid user ID");
            return;
        }

        try {
            const fetchedProfile = await profileService.getProfileById(id, isAdmin);
            if (!fetchedProfile) {
                console.error("Profile data not found");
                return;
            }
            console.log('🔍 ProfileView - Profile fetched:', fetchedProfile);
            setProfile(fetchedProfile);

            // También actualizar el avatar en la sesión si es necesario
            await updateSessionAvatar(fetchedProfile);
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    const updateSessionAvatar = async (profileData: IProfile) => {
        if (!isLoaded) return;

        try {
            if (profileData.avatar_id) {
                console.log('🖼️ ProfileView - Actualizando avatar de sesión inicial, avatar_id:', profileData.avatar_id);

                const targetAvatar = avatars.find(avatar => avatar.id === profileData.avatar_id);

                if (targetAvatar) {
                    const avatarUrl = await getAvatarImageUrl(targetAvatar);
                    console.log('🖼️ ProfileView - Actualizando sesión con URL:', avatarUrl);
                    dispatch(updateAvatarUrl(avatarUrl));
                } else if (profileData.avatar && profileData.avatar.trim() !== '') {
                    console.log('🖼️ ProfileView - Actualizando sesión con avatar personalizado:', profileData.avatar);
                    dispatch(updateAvatarUrl(profileData.avatar));
                }
            } else if (profileData.avatar && profileData.avatar.trim() !== '') {
                console.log('🖼️ ProfileView - Actualizando sesión con avatar directo:', profileData.avatar);
                dispatch(updateAvatarUrl(profileData.avatar));
            }
        } catch (error) {
            console.error('❌ ProfileView - Error actualizando avatar de sesión:', error);
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
            console.log('🔄 ProfileView - Actualizando perfil:', updatedProfile);
            const updatedData = await profileService.updateProfile(profile.id, updatedProfile);
            console.log('✅ ProfileView - Perfil actualizado:', updatedData);

            setProfile(updatedData);

            // Si se actualizó el avatar, también actualizar la sesión
            if (updatedData.avatar_id && isLoaded) {
                console.log('🖼️ ProfileView - Actualizando avatar en sesión, avatar_id:', updatedData.avatar_id);

                // Buscar el avatar específico por ID
                const targetAvatar = avatars.find(avatar => avatar.id === updatedData.avatar_id);

                if (targetAvatar) {
                    console.log('🖼️ ProfileView - Avatar encontrado:', targetAvatar);
                    try {
                        const avatarUrl = await getAvatarImageUrl(targetAvatar);
                        console.log('🖼️ ProfileView - URL de avatar generada:', avatarUrl);
                        dispatch(updateAvatarUrl(avatarUrl));
                    } catch (error) {
                        console.error('❌ ProfileView - Error generando URL de avatar:', error);
                    }
                } else if (updatedData.avatar && updatedData.avatar.trim() !== '') {
                    // Si es un avatar personalizado (URL directa)
                    console.log('🖼️ ProfileView - Usando avatar personalizado:', updatedData.avatar);
                    dispatch(updateAvatarUrl(updatedData.avatar));
                } else if (defaultAvatar) {
                    console.log('🖼️ ProfileView - Usando avatar por defecto');
                    try {
                        const avatarUrl = await getAvatarImageUrl(defaultAvatar);
                        dispatch(updateAvatarUrl(avatarUrl));
                    } catch (error) {
                        console.error('❌ ProfileView - Error con avatar por defecto:', error);
                    }
                }
            }

            setShowProfileForm(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.centeredTitle}>
                {isAdmin ? 'Bienvenido Administrador' : 'Perfil de Usuario'}
            </h1>
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
                profile={profile as IProfileDTO}
                onSelect={(profile: IProfile) => console.log("Profile selected:", profile)}
                onClose={handleCloseProfileForm}
                show={showProfileForm}
                setUserId={(value: React.SetStateAction<number>) => console.log("User ID set:", value)}
            />

            {/* AdminManager como función secundaria debajo del perfil */}
            {isAdmin && <AdminManager />}
        </div>
    );
};

export default ProfileView;
