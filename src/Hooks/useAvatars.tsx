import type { IAvatar } from '@/core/avatars';
import { AvatarService } from '@/core/avatars';
import {
    clearUploadError,
    fetchAvatarsForSelector,
    fetchDefaultAvatar,
    selectAvatar,
    uploadCustomAvatar
} from '@/core/avatars/avatarStore';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useAvatars = () => {
    const dispatch = useDispatch();
    const avatarService = new AvatarService();

    const {
        avatars,
        defaultAvatar,
        selectedAvatar,
        isLoaded,
        isUploading,
        uploadError
    } = useSelector((state: RootState) => state.avatars);

    // Cargar avatares al montar el hook
    useEffect(() => {
        if (!isLoaded) {
            dispatch(fetchAvatarsForSelector() as any);
            dispatch(fetchDefaultAvatar() as any);
        }
    }, [dispatch, isLoaded]);

    // Función para obtener la URL de imagen de un avatar
    const getAvatarImageUrl = async (avatar: IAvatar): Promise<string> => {
        const url = await avatarService.getAvatarImageUrl(avatar);
        return url;
    };

    // Función para seleccionar un avatar
    const handleSelectAvatar = (avatar: IAvatar) => {
        dispatch(selectAvatar(avatar));
    };

    // Función para subir un avatar personalizado
    const handleUploadAvatar = async (file: File | null, userId: number): Promise<IAvatar | null> => {
        if (!file) {
            return null;
        }

        const validation = avatarService.validateAvatarFile(file);

        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        try {
            const action = uploadCustomAvatar({ file, userId });
            const result = await dispatch(action as any);

            if (result.type.endsWith('fulfilled')) {
                return result.payload;
            } else if (result.type.endsWith('rejected')) {
                throw new Error(result.error?.message || 'Error uploading avatar');
            }

            return result.payload;
        } catch (error) {
            throw error;
        }
    };

    // Función para limpiar errores
    const handleClearError = () => {
        dispatch(clearUploadError());
    };

    // Función para obtener un avatar aleatorio por defecto
    const getRandomAvatar = (): IAvatar | null => {
        if (avatars.length === 0) {
            return defaultAvatar;
        }
        const systemAvatars = avatars.filter(a => !a.isCustom);
        if (systemAvatars.length === 0) {
            return defaultAvatar;
        }

        const randomIndex = Math.floor(Math.random() * systemAvatars.length);
        const randomAvatar = systemAvatars[randomIndex];
        return randomAvatar;
    };

    const handleUpdateUserAvatar = (avatarId: number) => {
        // Esta funcionalidad ahora se maneja desde ProfileForm
    };

    return {
        avatars,
        defaultAvatar,
        selectedAvatar,
        isLoaded,
        isUploading,
        uploadError,
        getAvatarImageUrl,
        handleSelectAvatar,
        handleUploadAvatar,
        handleClearError,
        getRandomAvatar,
        handleUpdateUserAvatar,
    };
};
