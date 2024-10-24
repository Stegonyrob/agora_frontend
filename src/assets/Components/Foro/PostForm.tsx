import React, { useState } from 'react';
import { Post } from './types';

interface PostFormProps {
  post?: Post | null;
  onSubmit: (post: Post) => void; // Asegúrate de que `onSubmit` espere un objeto `Post` completo
 }
 

// Función de ayuda para construir objetos `Post`
function createPost(title: string, message: string, id?: string, creation_date?: string, postname?: string, user_id?: string): Post {
 return {
    id: id || "default-id", // Proporciona un valor predeterminado para `id`
    title: title,
    message: message,
    creation_date: creation_date || "default-date", // Proporciona un valor predeterminado para `creation_date`
    postname: postname || "default-postname", // Proporciona un valor predeterminado para `postname`
    user_id: user_id || "default-user-id", // Proporciona un valor predeterminado para `user_id`
 };
}

interface PostFormProps {
 post?: Post | null;
 onSubmit: (post: Post) => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onSubmit }) => {
 const [title, setTitle] = useState(post ? post.title : '');
 const [message, setMessage] = useState(post ? post.message : '');

 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Utiliza `createPost` para construir el objeto `newPost` con los valores actuales y valores predeterminados para las propiedades opcionales
    const newPost = createPost(title, message, post?.id, post?.creation_date, post?.postname, post?.user_id);
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
};

export default PostForm;
