import ProfileForm from "@/assets/Components/Profile/ProfileForm";
import { updateAvatarUrl } from "@/core/auth/sessionStore";
import { IPost } from "@/core/posts/IPost";
import IProfile from "@/core/profiles/IProfile";
import IProfileDTO from "@/core/profiles/IProfileDTO";
import ProfileService from "@/core/profiles/ProfileService";
import { useAvatars } from "@/hooks/useAvatars";
import { useCurrentUser } from "@/hooks/useCurrentUser";
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
    const { userId } = useCurrentUser();
    const [login, setLogin] = React.useState<boolean>(false);
    const [register, setRegister] = React.useState<boolean>(false);

    const [userName, setUserName] = React.useState<string>("John Doe");
    const [showProfileForm, setShowProfileForm] = React.useState<boolean>(false);
    const [profile, setProfile] = useState<IProfile | null>(null);

    const profileService = new ProfileService();

    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        if (userId) {
            const role = sessionStorage.getItem('role');
            const admin = role === 'ROLE_ADMIN';
            setIsAdmin(admin);
            fetchProfileData(userId, admin);
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
            // Error: Invalid user ID
            return;
        }

        try {
            const fetchedProfile = await profileService.getProfileById(id, isAdmin);
            if (!fetchedProfile) {
                console.error("Profile data not found");
                return;
            }
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
                const targetAvatar = avatars.find(avatar => avatar.id === profileData.avatar_id);

                if (targetAvatar) {
                    const avatarUrl = await getAvatarImageUrl(targetAvatar);
                    dispatch(updateAvatarUrl(avatarUrl));
                } else if (profileData.avatar && profileData.avatar.trim() !== '') {
                    dispatch(updateAvatarUrl(profileData.avatar));
                }
            } else if (profileData.avatar && profileData.avatar.trim() !== '') {
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
                // Actualizando avatar en sesión

                // Buscar el avatar específico por ID
                const targetAvatar = avatars.find(avatar => avatar.id === updatedData.avatar_id);

                if (targetAvatar) {
                    // Avatar encontrado
                    try {
                        const avatarUrl = await getAvatarImageUrl(targetAvatar);
                        // URL de avatar generada
                        dispatch(updateAvatarUrl(avatarUrl));
                    } catch (error) {
                        console.error('❌ ProfileView - Error generando URL de avatar:', error);
                    }
                } else if (updatedData.avatar && updatedData.avatar.trim() !== '') {
                    // Si es un avatar personalizado (URL directa)
                    // Usando avatar personalizado
                    dispatch(updateAvatarUrl(updatedData.avatar));
                } else if (defaultAvatar) {
                    // Usando avatar por defecto
                    try {
                        const avatarUrl = await getAvatarImageUrl(defaultAvatar);
                        dispatch(updateAvatarUrl(avatarUrl));
                    } catch (error) {
                        console.error('❌ ProfileView - Error con avatar por defecto:', error);
                    }
                }
            }

            setShowProfileForm(false);
        } catch (error: any) {
            console.error("Error updating profile:", error);

            // Si es error 500, probablemente el perfil no existe en el backend
            // Intentar crear el perfil desde cero
            if (error.response?.status === 500) {
                console.log('🔧 ProfileView - Error 500 detectado, el perfil no existe en backend');
                console.log('💡 ProfileView - Esto indica que el backend no creó automáticamente el perfil al registrar');
                console.log('⚠️ ProfileView - Se requiere intervención manual del desarrollador del backend');

                // Aquí podrías implementar la creación del perfil si el backend lo soporta
                // Por ahora, mostramos un mensaje explicativo al usuario
                // Mostrar información técnica útil para debugging
                const userInfo = `Usuario ID: ${userId}
Perfil ID en memoria: ${profile?.id || 'null'}
Endpoint fallido: PUT /api/v1/any/user/profile/${profile?.id}`;

                console.log('🔍 Información del usuario:', userInfo);

                alert(`Error: Tu perfil no pudo ser actualizado porque no existe en el servidor.

Esto puede pasar cuando el sistema no creó automáticamente tu perfil al registrarte.

Por favor, contacta al administrador del sistema para que cree tu perfil manualmente.

Detalles técnicos:
${userInfo}`);
            }
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
                userId={userId || 0}
                setLogin={setLogin}
                setRegister={setRegister}
                setUserName={setUserName}
                onSubmit={handleSubmit}
                profile={profile as IProfileDTO}
                onSelect={(profile: IProfile) => console.log("Profile selected:", profile)}
                onClose={handleCloseProfileForm}
                show={showProfileForm}
                setUserId={() => { }}
            />

            {/* AdminManager como función secundaria debajo del perfil */}
            {isAdmin && <AdminManager />}
        </div>
    );
};

export default ProfileView;
