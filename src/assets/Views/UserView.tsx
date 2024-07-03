import React from 'react';
import { Post } from '../../types/types';
import { CardPostUser } from '../Components/Blog/CardPostUser/CardPostUser';
import ProfileForm from '../Components/Profile/ProfileForm';

interface UserViewProps {
    posts: Post[];
    onDeletePost: (postId: string) => void;
    onEditPost: (post: Post) => void;
}

const UserView: React.FC<UserViewProps> = ({ posts }) => {
    return (
        <div>
            <ProfileForm />
            <CardPostUser children={<CardPostUser children={undefined} postId={''} />} postId="a-valid-post-id" />
        </div>
    );
};

export default UserView;
