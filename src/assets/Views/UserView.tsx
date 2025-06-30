import React from 'react';

import { IPost } from '../../core/posts/IPost';
import ProfileForm from '../Components/Profile/ProfileForm';
import styles from './scss/Views.module.scss';
interface UserViewProps {
    posts: IPost[];
    onDeletePost: (postId: string) => void;
    onEditPost: (post: IPost) => void;
}

const UserView: React.FC<UserViewProps> = ({ posts }) => {
    return (
        <div className={styles.container}>
            <ProfileForm
                profile={{} as any} // TODO: Replace with a real IProfileDTO object
                onSubmit={async (updatedProfile) => { /* TODO: implement submit logic */ }} // Replace with your submit handler
                onClose={() => { }} // Replace with your close handler
                show={true} // Set to true or false as needed
                userId={0} // TODO: Replace with actual userId of type number
                setLogin={() => { }} // TODO: Replace with actual setLogin function
                setRegister={() => { }} // TODO: Replace with actual setRegister function
                setUserId={() => { }} // TODO: Replace with actual setUserId function
                setUserName={() => { }} // TODO: Replace with actual setUserName function
            // Add other required props here
            />

        </div>
    );
};

export default UserView;
