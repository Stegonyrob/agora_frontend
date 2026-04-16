import { configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import avatarsReducer from '../../core/avatars/avatarStore';
import { useAvatars } from '../../hooks/useAvatars';

describe('useAvatars', () => {

    it('should return a list of avatars', () => {
        // Estado inicial simulado para el slice avatars
        const preloadedState = {
            avatars: {
                avatars: [{ id: 1, name: 'Test', isCustom: false, isDefault: false }],
                defaultAvatar: { id: 99, name: 'Default', isCustom: false, isDefault: true },
                selectedAvatar: null,
                isLoaded: true,
                isUploading: false,
                uploadError: null,
            }
        };
        const store = configureStore({
            reducer: { avatars: avatarsReducer },
            preloadedState,
        });
        const { result } = renderHook(() => useAvatars(), {
            wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
        });
        expect(Array.isArray(result.current.avatars)).toBe(true);
        expect(result.current.avatars.length).toBeGreaterThan(0);
        expect(result.current.defaultAvatar).toEqual({ id: 99, name: 'Default', isCustom: false, isDefault: true });
    });

    // Este hook no expone endpoints ni claves directamente, solo datos de Redux y funciones.
    // Si en el futuro se expone información sensible, agregar aquí el test correspondiente.
});
