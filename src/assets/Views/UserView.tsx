// UserView.tsx
import React from 'react';
import { Post } from '../Components/Foro/types';

interface UserViewProps {
 posts: Post[];
 onDeletePost: (postId: string) => void;
 onEditPost: (post: Post) => void;
}

const UserView: React.FC<UserViewProps> = ({ posts, onDeletePost, onEditPost }) => {
 // Implementación de UserView
 return null; // Temporary return statement
};

export default UserView;
