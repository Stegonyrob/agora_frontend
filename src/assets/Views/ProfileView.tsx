import React from 'react';

import ProfileForm from '@/assets/Components/Profile/ProfileForm';
import { IPost } from '@/core/posts/IPost';

import IProfileDTO from '@/core/profiles/IProfileDTO';
import styles from './scss/Views.module.scss';
interface ProfileProps {
    posts: IPost[];
    onDeletePost?: (postId: string) => void;
    onEditPost?: (post: IPost) => void;
}


const ProfileView: React.FC<ProfileProps> = ({ posts }) => {
    console.log('ProfileView: Initial render');
    const [login, setLogin] = React.useState<boolean>(false);
    const [register, setRegister] = React.useState<boolean>(false);
    const [userId, setUserId] = React.useState<number>(0);
    const [userName, setUserName] = React.useState<string>('');

    React.useEffect(() => {
        if (!posts) {
            console.warn('ProfileView: posts prop is null or undefined');
        } else {
            console.log('ProfileView: posts prop has been updated', posts);
        }
    }, [posts]);

    console.log('ProfileView: Current state:', { login, register, userId, userName });

    const handleSubmit = (profileDTO: IProfileDTO) => {
        console.log('ProfileView: handleSubmit called with profileDTO:', profileDTO);
        try {
            if (!profileDTO) {
                throw new Error('ProfileView: profileDTO is null or undefined');
            }
            console.log('ProfileView: onSubmit profileDTO:', profileDTO);
        } catch (error) {
            console.error('ProfileView handleSubmit error:', error);
        }
    };

    return (
        <div className={styles.container}>
            <ProfileForm
                userId={userId}
                setLogin={setLogin}
                setRegister={setRegister}
                setUserId={setUserId}
                setUserName={setUserName}
                onSubmit={handleSubmit}
                profileDTO={undefined}
            />

        </div>
    );
};

export default ProfileView;
