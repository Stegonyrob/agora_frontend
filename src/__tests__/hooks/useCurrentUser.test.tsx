import { configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import sessionReducer from '../../core/auth/sessionStore';
import { useCurrentUser } from '../../hooks/useCurrentUser';

describe('useCurrentUser', () => {

    it('should return user session data when logged in', () => {
        const preloadedState = {
            session: {
                userId: 123,
                role: 'ROLE_ADMIN',
                userName: 'TestUser',
                isLoggedIn: true,
                useremail: 'test@example.com',
                accessToken: 'token',
                refreshToken: 'refresh',
                viewAsUser: false,
            }
        };
        const store = configureStore({
            reducer: { session: sessionReducer },
            preloadedState,
        });
        const { result } = renderHook(() => useCurrentUser(), {
            wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
        });
        expect(result.current.userId).toBe(123);
        expect(result.current.userName).toBe('TestUser');
        expect(result.current.userRole).toBe('ROLE_ADMIN');
        expect(result.current.isLoggedIn).toBe(true);
        expect(result.current.isAdmin).toBe(true);
        expect(result.current.isUser).toBe(false);
    });

    // Si el hook depende de endpoints, asegúrate de que usen variables de entorno y mockéalos aquí.
});
