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
        console.log('🔍 useAvatars - Estado inicial:', { isLoaded, avatarsLength: avatars.length });
        if (!isLoaded) {
            console.log('📡 useAvatars - Cargando avatares...');
            dispatch(fetchAvatarsForSelector() as any);
            dispatch(fetchDefaultAvatar() as any);
        }
    }, [dispatch, isLoaded]);

    // Función para obtener la URL de imagen de un avatar
    const getAvatarImageUrl = async (avatar: IAvatar): Promise<string> => {
        console.log('🖼️ getAvatarImageUrl - Avatar:', avatar);
        const url = await avatarService.getAvatarImageUrl(avatar);
        console.log('🖼️ getAvatarImageUrl - URL generada:', url);
        return url;
    };

    // Función para seleccionar un avatar
    const handleSelectAvatar = (avatar: IAvatar) => {
        dispatch(selectAvatar(avatar));
    };

    // Función para subir un avatar personalizado
    const handleUploadAvatar = async (file: File, userId: number) => {
        const validation = avatarService.validateAvatarFile(file);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        const result = await dispatch(uploadCustomAvatar({ file, userId }) as any);
        return result.payload;
    };

    // Función para limpiar errores
    const handleClearError = () => {
        dispatch(clearUploadError());
    };

    // Función para obtener un avatar aleatorio por defecto
    const getRandomAvatar = (): IAvatar | null => {
        console.log('🎲 getRandomAvatar - Avatares disponibles:', avatars.length);
        if (avatars.length === 0) {
            console.log('🎲 getRandomAvatar - No hay avatares, usando defaultAvatar:', defaultAvatar);
            return defaultAvatar;
        }
        const systemAvatars = avatars.filter(a => !a.isCustom);
        console.log('🎲 getRandomAvatar - Avatares del sistema:', systemAvatars.length);
        if (systemAvatars.length === 0) {
            console.log('🎲 getRandomAvatar - No hay avatares del sistema, usando defaultAvatar:', defaultAvatar);
            return defaultAvatar;
        }

        const randomIndex = Math.floor(Math.random() * systemAvatars.length);
        const randomAvatar = systemAvatars[randomIndex];
        console.log('🎲 getRandomAvatar - Avatar aleatorio seleccionado:', randomAvatar);
        return randomAvatar;
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
    };
};
