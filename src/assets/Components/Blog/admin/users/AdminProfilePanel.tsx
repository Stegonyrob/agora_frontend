import Profile from '@/assets/Components/Profile/Profile';
import ProfileForm from '@/assets/Components/Profile/ProfileForm';
import IProfile from '@/core/profiles/IProfile';
import IProfileDTO from '@/core/profiles/IProfileDTO';
import ProfileService from '@/core/profiles/ProfileService';
import React, { useEffect, useState } from 'react';
import AdminManager from './AdminManager';
import styles from './UserManager.module.scss';

const AdminProfilePanel: React.FC = () => {
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const userId = sessionStorage.getItem('userId');
    const profileService = new ProfileService();

    useEffect(() => {
        if (userId) {
            const isAdmin = sessionStorage.getItem('role') === 'ROLE_ADMIN';
            fetchProfileData(parseInt(userId, 10), isAdmin);
        }
    }, [userId]);

    const fetchProfileData = async (id: number, isAdmin: boolean) => {
        try {
            const fetchedProfile = await profileService.getProfileById(id, isAdmin);
            if (fetchedProfile) {
                setProfile(fetchedProfile);
            } else {
                setProfile(null);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching profile data:', error.message);
            } else {
                console.error('Unknown error fetching profile data:', error);
            }
            setProfile(null);
        }
    };

    const handleOpenProfileForm = () => setShowProfileForm(true);
    const handleCloseProfileForm = () => setShowProfileForm(false);

    const handleSubmit = async (updatedProfile: IProfileDTO) => {
        if (!profile) return;
        try {
            const updatedData = await profileService.updateProfile(profile.id, updatedProfile);
            setProfile(updatedData);
            setShowProfileForm(false);
        } catch (error) {
            // Manejo de error opcional
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.centeredTitle}>Perfil de Administrador</h1>
            {profile ? (
                <Profile profile={profile} onEdit={handleOpenProfileForm} />
            ) : (
                <p>No hay datos de perfil disponibles.</p>
            )}
            <ProfileForm
                userId={parseInt(userId || '', 10)}
                setLogin={() => { }}
                setRegister={() => { }}
                setUserName={() => { }}
                setUserId={() => { }}
                onSubmit={handleSubmit}
                profile={profile as IProfileDTO}
                onSelect={() => { }}
                onClose={handleCloseProfileForm}
                show={showProfileForm}
            />
            <div className="mt-5">
                <AdminManager />
            </div>
        </div>
    );
};

export default AdminProfilePanel;
