import React, { useState } from 'react';
import { Post } from '../../../types/types';
import CustomInput from '../Generals/Input/CustomInput';
// Import the CSS module into a variable named styles
import styles from './EditPostForm.module.scss';

interface PostFormProps {
 post?: Post | null;
 onSubmit: (post: Post) => void;
}

function editPostForm({ post, onSubmit }: PostFormProps) {
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
    <form className={styles.editPostForm} onSubmit={handleSubmit}>
      <label>
        Título:
        <CustomInput
 type="text"
 modelValue={title}
 placeholder="Enter text"
 required={true}
 onChange={(e) => setTitle(e.target.value)}
 icon={false}
/>
      </label>
      <label>
        Mensaje:
        <textarea
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </label>
      <button type="submit">{post ? 'Actualizar Post' : 'Crear Post'}</button>
    </form>
 );
}

export default editPostForm;