import React from 'react';

import { IPost } from '../../core/posts/IPost';
import ProfileForm from '../Components/Profile/ProfileForm';
import styles from './scss/Views.module.scss';
interface ProfileProps {
    posts: IPost[];
    onDeletePost: (postId: string) => void;
    onEditPost: (post: IPost) => void;
}

const ProfileView: React.FC<ProfileProps> = ({ posts }) => {
    return (
        <div className={styles.container}>
            <ProfileForm />

        </div>
    );
};

export default ProfileView;
