import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthentication } from '../redux/authSlice';
import { login } from '../services/auth';

interface AuthState {
    isAuthenticated: boolean;
    user: {
        userId: string | null;
        role: string | null;
    } | null;
    accessToken: string;
    refreshToken: string;
    role: string | null;
    userId: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    accessToken: '',
    refreshToken: '',
    role: null,
    userId: null,
};

const useAuth = () => {
    const [authState, setAuthState] = useState(initialState);
    const dispatch = useDispatch();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (authToken && refreshToken) {
            const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
            const userRole = tokenPayload.role;
            const userId = tokenPayload.userId;

            dispatch(setAuthentication({
                isAuthenticated: true,
                user: {
                    userId,
                    role: userRole,
                },
                role: userRole,
                accessToken: authToken,
                userId: userId,

            }));

            setAuthState({
                isAuthenticated: true,
                user: {
                    userId,
                    role: userRole,
                },
                accessToken: authToken,
                refreshToken: refreshToken,
                role: userRole,
                userId,

            });
        }
    }, []);

    const loginHandler = async (username: string, password: string) => {
        try {
            const { accessToken, refreshToken, userId, role } = await login(username, password);
            localStorage.setItem('authToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            const updatedAuthState = {
                isAuthenticated: true,
                user: { userId: userId.toString(), role },
                accessToken,
                refreshToken,
                role,
                userId: userId.toString(),
            };

            dispatch(setAuthentication(updatedAuthState));
            setAuthState(updatedAuthState);

            return { accessToken, refreshToken, userId, role };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');

        const logoutState = {
            isAuthenticated: false,
            user: null,
            accessToken: '',
            refreshToken: '',
            role: '',
            userId: null,
        };

        dispatch(setAuthentication(logoutState));
        setAuthState(logoutState);
    };

    return {
        ...authState,
        login: loginHandler,
        logout: logoutHandler,
    };
};

export default useAuth;