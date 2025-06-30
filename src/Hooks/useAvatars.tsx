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
    const handleUploadAvatar = async (file: File | null, userId: number): Promise<IAvatar | null> => {
        console.log('📤 useAvatars - handleUploadAvatar iniciado:', { file: file?.name, userId });

        if (!file) {
            console.error('❌ useAvatars - Archivo nulo, no se puede subir');
            return null;
        }

        console.log('🔍 useAvatars - Archivo:', file);

        const validation = avatarService.validateAvatarFile(file);
        console.log('🔍 useAvatars - Validación:', validation);

        if (!validation.isValid) {
            console.error('❌ useAvatars - Validación fallida:', validation.error);
            throw new Error(validation.error);
        }

        console.log('✅ useAvatars - Archivo validado, enviando a Redux...');

        try {
            const action = uploadCustomAvatar({ file, userId });
            console.log('🔍 useAvatars - Acción a dispatch:', action);

            const result = await dispatch(action as any);
            console.log('🔍 useAvatars - Resultado de Redux:', result);

            if (result.type.endsWith('fulfilled')) {
                console.log('✅ useAvatars - Upload exitoso:', result.payload);
                return result.payload;
            } else if (result.type.endsWith('rejected')) {
                console.error('❌ useAvatars - Upload rechazado:', result.error);
                throw new Error(result.error?.message || 'Error uploading avatar');
            }

            return result.payload;
        } catch (error) {
            console.error('❌ useAvatars - Error en dispatch:', error);
            throw error;
        }
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

    const handleUpdateUserAvatar = (avatarId: number) => {
        console.log('🔄 useAvatars - Actualizando avatar del usuario:', avatarId);
        // Esta funcionalidad ahora se maneja desde ProfileForm
        console.log('ℹ️ useAvatars - La actualización del avatar se maneja en ProfileForm');
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
