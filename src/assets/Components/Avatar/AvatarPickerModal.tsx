import type { IAvatar } from "@/core/avatars";
import { useAvatars } from "@/hooks/useAvatars";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./AvatarPickerModal.module.scss";

interface AvatarPickerModalProps {
    currentAvatar?: string;
    onSelect: (avatar: IAvatar) => void;
    onUpload?: (avatar: IAvatar) => void;
    userId?: number; // Necesario para subir avatares personalizados
}

const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
    currentAvatar,
    onSelect,
    onUpload,
    userId = 0
}) => {
    const {
        avatars,
        defaultAvatar,
        isLoaded,
        isUploading,
        uploadError,
        getAvatarImageUrl,
        handleUploadAvatar,
        handleClearError
    } = useAvatars();

    const [activeIndex, setActiveIndex] = useState(0);
    const [currentAvatarData, setCurrentAvatarData] = useState<IAvatar | null>(null);
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>("");
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filtrar solo avatares del sistema (predefinidos)
    const systemAvatars = avatars.filter(avatar => !avatar.isCustom);

    // Inicializar avatar actual
    useEffect(() => {
        console.log('🚀 AvatarPickerModal - useEffect inicialización:', {
            isLoaded,
            systemAvatarsLength: systemAvatars.length,
            defaultAvatar
        });

        if (isLoaded && systemAvatars.length > 0) {
            const initialAvatar = systemAvatars[0];

            setCurrentAvatarData(initialAvatar);
            updateAvatarUrl(initialAvatar);
        } else if (defaultAvatar) {

            setCurrentAvatarData(defaultAvatar);
            updateAvatarUrl(defaultAvatar);
        } else {

        }
    }, [isLoaded, systemAvatars.length, defaultAvatar]);

    const updateAvatarUrl = async (avatar: IAvatar) => {
        try {
            setIsLoadingImage(true);
            const url = await getAvatarImageUrl(avatar);
            setCurrentAvatarUrl(url);
        } catch (error) {
            console.error('Error getting avatar URL:', error);
            setCurrentAvatarUrl('/images/avatarGeneric.png');
        } finally {
            setIsLoadingImage(false);
        }
    };

    const showNext = () => {

        if (systemAvatars.length === 0) {

            return;
        }

        const nextIndex = activeIndex + 1 >= systemAvatars.length ? 0 : activeIndex + 1;
        const nextAvatar = systemAvatars[nextIndex];


        setActiveIndex(nextIndex);
        setCurrentAvatarData(nextAvatar);
        updateAvatarUrl(nextAvatar);
        onSelect(nextAvatar);
    };

    const showPrevious = () => {

        if (systemAvatars.length === 0) {

            return;
        }

        const prevIndex = activeIndex - 1 < 0 ? systemAvatars.length - 1 : activeIndex - 1;
        const prevAvatar = systemAvatars[prevIndex];


        setActiveIndex(prevIndex);
        setCurrentAvatarData(prevAvatar);
        updateAvatarUrl(prevAvatar);
        onSelect(prevAvatar);
    };

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) {

            return;
        }

        const file = files[0];


        try {
            handleClearError();


            const uploadedAvatar = await handleUploadAvatar(file, userId);


            if (uploadedAvatar) {
                if (onUpload) {

                    onUpload(uploadedAvatar);
                }

                onSelect(uploadedAvatar);
            } else {
                console.error('❌ AvatarPickerModal - uploadedAvatar es undefined');
                throw new Error('El avatar subido es undefined');
            }
        } catch (error) {
            console.error('❌ AvatarPickerModal - Error uploading avatar:', error);
        } finally {

        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    if (!isLoaded) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Cargando avatares...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.avatarSelector}>
                {/* Flecha izquierda */}
                <button
                    className={`${styles.navArrow} ${styles.avatarNavButton}`}
                    onClick={showPrevious}
                    aria-label="Avatar anterior"
                    type="button"
                    disabled={systemAvatars.length <= 1}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>

                {/* Avatar central */}
                <div className={`${styles.avatarContainer} ${uploadError ? styles['avatarContainer--error'] : ''}`}>
                    <div className={styles.avatar}>
                        <img
                            src={currentAvatar || currentAvatarUrl || '/images/avatarGeneric.png'}
                            alt="Avatar seleccionado"
                            className={`${styles.avatarImg} ${isLoadingImage ? styles['avatarImg--loading'] : ''}`}
                            onLoad={() => setIsLoadingImage(false)}
                            onError={(e) => {
                                e.currentTarget.src = "/images/avatarGeneric.png";
                            }}
                        />
                        {(isLoadingImage || isUploading) && <div className={styles.loadingSpinner} />}
                    </div>

                    {/* Indicador del nombre del avatar */}
                    <div className={styles.avatarName}>
                        {currentAvatarData?.name || 'Avatar'}
                    </div>
                </div>

                {/* Flecha derecha */}
                <button
                    className={`${styles.navArrow} ${styles.avatarNavButton}`}
                    onClick={showNext}
                    aria-label="Siguiente avatar"
                    type="button"
                    disabled={systemAvatars.length <= 1}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                    </svg>
                </button>
            </div>

            {/* Botón de upload elegante */}
            <button
                className={`${styles.uploadButton} ${styles.avatarUploadButton}`}
                onClick={handleUploadClick}
                aria-label="Subir imagen personalizada"
                type="button"
                disabled={isUploading || userId === 0}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={styles.uploadIcon}>
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    <path d="M12,12L16,16H13V19H11V16H8L12,12Z" />
                </svg>
                <span>{isUploading ? 'Subiendo...' : 'Sube tu imagen aquí'}</span>
            </button>

            {/* Mostrar errores si los hay */}
            {uploadError && (
                <div className={styles.errorMessage}>
                    {uploadError}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className={styles.hiddenInput}
                disabled={isUploading}
            />
        </div>
    );
};

export default AvatarPickerModal;
