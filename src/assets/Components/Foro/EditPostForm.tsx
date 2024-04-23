import React, { useState } from 'react';
import { Post } from '../../../types/types';

interface PostFormProps {
 post?: Post | null;
 onSubmit: (post: Post) => void;
}

function EditPostForm({ post, onSubmit }: PostFormProps) {
 const [title, setTitle] = useState(post?.title || '');
 const [message, setMessage] = useState(post?.message || '');

 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newPost = {
      id: post?.id || "default-id",
      title: title,
      message: message,
      creation_date: post?.creation_date || "default-date",
      postname: post?.postname || "default-postname",
      user_id: post?.user_id || "default-user-id",
    };
    onSubmit(newPost);
 };

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
}

export default EditPostForm;