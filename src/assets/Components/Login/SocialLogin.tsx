import React, { useEffect } from 'react';
import styles from './SocialLogin.module.scss';

interface SocialLoginProps {
    onGoogleLogin: (token: string) => Promise<void>;
    // onFacebookLogin: (token: string) => Promise<void>; // COMMENTED OUT FOR PRODUCTION
    isLoading?: boolean;
}

declare global {
    interface Window {
        google: any;
        FB: any;
        fbAsyncInit: () => void;
    }
}

const SocialLogin: React.FC<SocialLoginProps> = ({
    onGoogleLogin,
    // onFacebookLogin, // COMMENTED OUT FOR PRODUCTION
    isLoading = false
}) => {

    useEffect(() => {
        // Configure Google OAuth2 settings
        // Google SDK should be loaded in index.html

        // FACEBOOK CONFIGURATION COMMENTED OUT FOR PRODUCTION
        // Configure Facebook SDK with environment variable
        // const configFacebook = () => {
        //     if (window.FB) {
        //         window.FB.init({
        //             appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        //             cookie: true,
        //             xfbml: true,
        //             version: 'v18.0'
        //         });
        //     }
        // };

        // if (window.FB) {
        //     configFacebook();
        // } else {
        //     // Wait for FB SDK to load
        //     window.fbAsyncInit = configFacebook;
        // }
    }, []);

    // GOOGLE LOGIN HANDLER - READY FOR PRODUCTION
    const handleGoogleLogin = () => {
        if (!window.google) {
            alert('Google SDK no está cargado. Por favor, recarga la página.');
            return;
        }

        window.google.accounts.oauth2.initTokenClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            scope: 'email profile',
            callback: (response: any) => {
                if (response.access_token) {
                    onGoogleLogin(response.access_token);
                }
            },
        }).requestAccessToken();
    };

    // FACEBOOK LOGIN HANDLER - COMMENTED OUT FOR PRODUCTION
    // const handleFacebookLogin = () => {
    //     if (!window.FB) {
    //         alert('Facebook SDK no está cargado. Por favor, recarga la página.');
    //         return;
    //     }

    //     window.FB.login((response: any) => {
    //         if (response.authResponse) {
    //             onFacebookLogin(response.authResponse.accessToken);
    //         }
    //     }, { scope: 'email' });
    // };

    return (
        <div className={styles.socialLoginContainer}>
            <div className={styles.divider}>
                <span>O continúa con</span>
            </div>

            <div className={styles.socialButtons}>
                {/* GOOGLE LOGIN BUTTON - READY FOR PRODUCTION */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className={`${styles.socialButton} ${styles.googleButton}`}
                >
                    <svg className={styles.socialIcon} viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {isLoading ? 'Conectando...' : 'Continuar con Google'}
                </button>

                {/* FACEBOOK LOGIN BUTTON - COMMENTED OUT FOR PRODUCTION */}
                {/* 
                <button
                    type="button"
                    onClick={handleFacebookLogin}
                    disabled={isLoading}
                    className={`${styles.socialButton} ${styles.facebookButton}`}
                >
                    <svg className={styles.socialIcon} viewBox="0 0 24 24">
                        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    {isLoading ? 'Conectando...' : 'Continuar con Facebook'}
                </button>
                */}
            </div>
        </div>
    );
};

export default SocialLogin;
