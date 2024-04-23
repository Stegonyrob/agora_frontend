import React, { useState } from 'react';
import { Post } from '../../../types/types';

interface PostFormProps {
 post?: Post | null;
 onSubmit: (post: Post) => void;
}

function createPost(title: string, message: string, id?: string, creation_date?: string, postname?: string, user_id?: string): Post {
 return {
    id: id || "default-id",
    title: title,
    message: message,
    creation_date: creation_date || "default-date",
    postname: postname || "default-postname",
    user_id: user_id || "default-user-id",
 };
}

const PostForm: React.FC<PostFormProps> = ({ post, onSubmit }) => {
 const [title, setTitle] = useState(post ? post.title : '');
 const [message, setMessage] = useState(post ? post.message : '');
 const [status, setStatus] = useState('typing');

 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newPost = createPost(title, message, post?.id, post?.creation_date, post?.postname, post?.user_id);
    onSubmit(newPost);
    setStatus('success'); // Update status after submission
 };

 if (status === 'success') {
    return <h1>Post creado satisfactoriamente</h1>
 }

 return (
    <form onSubmit={handleSubmit}>
      <label>
        Título:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Mensaje:
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
      </label>
      <button type="submit">{post ? 'Actualizar Post' : 'Crear Post'}</button>
    </form>
 );
};

export default PostForm;