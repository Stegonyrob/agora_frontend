import IProfile from "@/core/profiles/IProfile";
import { useAvatars } from "@/hooks/useAvatars";
import React, { useEffect, useState } from "react";
import styles from "./Profile.module.scss";

interface ProfileProps {
    profile?: IProfile;
    onEdit: () => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onEdit }) => {
    const { getAvatarImageUrl, defaultAvatar, avatars, isLoaded } = useAvatars();
    const [avatarUrl, setAvatarUrl] = useState<string>("/images/avatarGeneric.png");

    useEffect(() => {
        const loadAvatarUrl = async () => {
            if (profile?.avatar) {
                setAvatarUrl(profile.avatar);
            } else if (profile?.avatar_id) {
                try {
                    // Si los avatares no están cargados, esperar un poco y reintentar
                    if (!isLoaded || avatars.length === 0) {
                        return;
                    }

                    // Buscar el avatar específico por ID
                    const targetAvatar = avatars.find(avatar => avatar.id === profile.avatar_id);

                    if (targetAvatar) {
                        const url = await getAvatarImageUrl(targetAvatar);
                        setAvatarUrl(url);
                    } else if (defaultAvatar) {
                        const url = await getAvatarImageUrl(defaultAvatar);
                        setAvatarUrl(url);
                    } else {
                        setAvatarUrl("/images/avatarGeneric.png");
                    }
                } catch (error) {
                    console.error("❌ Profile - Error obteniendo avatar URL:", error);
                    setAvatarUrl("/images/avatarGeneric.png");
                }
            } else {
                console.log("🖼️ Profile - Usando avatar por defecto - Razón:");
                console.log("  - profile?.avatar:", !!profile?.avatar);
                console.log("  - profile?.avatar_id:", !!profile?.avatar_id);
                console.log("  - isLoaded:", isLoaded);
                setAvatarUrl("/images/avatarGeneric.png");
            }
        };

        loadAvatarUrl();
    }, [profile, getAvatarImageUrl, defaultAvatar, avatars, isLoaded]);

    if (!profile) {
        return (
            <div className={styles.noProfile}>
                <p>No hay datos de perfil disponibles.</p>
            </div>
        );
    }

    const fullName = `${profile.firstName || ''} ${profile.lastName1 || ''} ${profile.lastName2 || ''}`.trim();

    return (
        <div className={styles.profileWrapper}>
            {/* Header del perfil */}
            <div className={styles.profileHeader}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatarContainer}>
                        <img
                            className={styles.avatar}
                            src={avatarUrl}
                            alt="Avatar del perfil"
                            onError={(e) => {
                                console.error("❌ Profile - Error cargando imagen:", avatarUrl);
                                (e.target as HTMLImageElement).src = "/images/avatarGeneric.png";
                            }}
                        />
                    </div>
                    <div className={styles.userInfo}>
                        <h2 className={styles.userName}>{fullName || 'Usuario'}</h2>
                        <p className={styles.userRole}>{profile.relationship || 'Miembro'}</p>
                    </div>
                </div>
                <button onClick={onEdit} className={styles.editButton}>
                    <i className="bi bi-pencil-square"></i>
                    {' '}
                    Editar Perfil
                </button>
            </div>

            {/* Información de identidad */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>INFORMACIÓN PERSONAL</h3>
                <div className={styles.card}>
                    <div className={styles.cardBody}>
                        <table className={styles.infoTable}>
                            <tbody>
                                <tr>
                                    <th scope="row" className={styles.label}>Nombre</th>
                                    <td className={styles.separator}>:</td>
                                    <td className={styles.value}>{profile.firstName || 'No especificado'}</td>
                                </tr>
                                <tr>
                                    <th scope="row" className={styles.label}>Primer Apellido</th>
                                    <td className={styles.separator}>:</td>
                                    <td className={styles.value}>{profile.lastName1 || 'No especificado'}</td>
                                </tr>
                                <tr>
                                    <th scope="row" className={styles.label}>Segundo Apellido</th>
                                    <td className={styles.separator}>:</td>
                                    <td className={styles.value}>{profile.lastName2 || 'No especificado'}</td>
                                </tr>
                                <tr>
                                    <th scope="row" className={styles.label}>Parentesco</th>
                                    <td className={styles.separator}>:</td>
                                    <td className={styles.value}>{profile.relationship || 'No especificado'}</td>
                                </tr>
                                <tr>
                                    <th scope="row" className={styles.label}>Email</th>
                                    <td className={styles.separator}>:</td>
                                    <td className={styles.value}>{profile.email || 'No especificado'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Información de contacto */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>INFORMACIÓN DE CONTACTO</h3>
                <div className={styles.card}>
                    <div className={styles.cardBody}>
                        <table className={styles.infoTable}>
                            <tbody>
                                <tr>
                                    <th scope="row" className={styles.label}>Ciudad</th>
                                    <td className={styles.separator}>:</td>
                                    <td className={styles.value}>{profile.city || 'No especificado'}</td>
                                </tr>
                                <tr>
                                    <th scope="row" className={styles.label}>País</th>
                                    <td className={styles.separator}>:</td>
                                    <td className={styles.value}>{profile.country || 'No especificado'}</td>
                                </tr>
                                <tr>
                                    <th scope="row" className={styles.label}>Teléfono</th>
                                    <td className={styles.separator}>:</td>
                                    <td className={styles.value}>{profile.phone || 'No especificado'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;
