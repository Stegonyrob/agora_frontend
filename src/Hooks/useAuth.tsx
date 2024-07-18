import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import { RootState } from '../redux/store';
import { login } from '../services/auth';

interface AuthState {
    isAuthenticated: boolean;
    user: {
        userId: number | null;
        role: string | undefined;
    } | null;
    accessToken: string;
    refreshToken: string;
    role: string | undefined;
    userId: number | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    accessToken: '',
    refreshToken: '',
    role: '',
    userId: null,
};

const useAuth = () => {
    const [authState, setAuthState] = useState(initialState);
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (authToken && refreshToken) {
            const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
            const userRole = tokenPayload.role;
            const userId = tokenPayload.userId;

            dispatch(setCredentials({
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

            const updatedAuthState: Partial<AuthState> = {
                isAuthenticated: true,
                user: { userId: userId, role },
                accessToken,
                refreshToken,
                role: role || "",
                userId: userId,
            };

            dispatch(setCredentials(updatedAuthState as AuthState));
            setAuthState(updatedAuthState as AuthState);

            return { accessToken, refreshToken, userId, role };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');

        const logoutState: AuthState = {
            isAuthenticated: false,
            user: null,
            accessToken: '',
            refreshToken: '',
            role: '',
            userId: null,
        };

        dispatch(setCredentials(logoutState));
        setAuthState(logoutState);
    };

    return {
        ...auth,
        login: loginHandler,
        logout: logoutHandler,
    };
};

export default useAuth;