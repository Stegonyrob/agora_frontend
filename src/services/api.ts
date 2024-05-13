import axios from 'axios';
import { Post } from '../types/types';

// Definición de las URIs utilizando variables de entorno
const uri = import.meta.env.VITE_API_ENDPOINT_GENERAL;
const uri2 = import.meta.env.VITE_API_ENDPOINT_POSTS;
const uri3 = import.meta.env.VITE_API_ENDPOINT_REPLIES

const api = {
 // Función para obtener posts
 async fetchPosts(): Promise<Post[]> {
    try {
      const response = await axios.get(`${uri2}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts: ", error);
      throw error; 
    }
 },
 // Función para editar un nuevo post
 async updatePost(postId: string, postData: string,): Promise<Post> {
    try {
      const response = await axios.put(`${uri2}/${postId}`, postData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (!response.data) {
        throw new Error('Error al actualizar el post');
      }
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el post:', error);
      throw error; // Propagar el error para manejarlo en el componente
    }
 },

 // Función para crear un nuevo post
 async createPost(post: { title: string; message: string; creationDate?: string }): Promise<Post> {
  try {
    const response = await axios.post(`${uri2}/store`, {
      title: post.title,
      message: post.message,
      creationDate: post.creationDate || new Date().toISOString(),
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el post:', error);
    throw error;
  }
},


 // Función para eliminar un post
 async deletePost(postId: string): Promise<void> {
    try {
      await axios.delete(`${uri2}/${postId}`, { withCredentials: true });
      console.log("Post eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar el post:", error);
      throw error; 
    }
 },

 // Función para registrar un nuevo usuario
 async registerUser(userData: any): Promise<any> {
    try {
      const response = await axios.post(`${uri}/users`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (!response.data) {
        throw new Error('Error al registrar el usuario');
      }
      return response.data;
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      throw error; // Propagar el error para manejarlo en el componente
    }
 },

 // Función para obtener usuarios
 async getUsers(): Promise<any> {
    try {
      const response = await axios.get(`${uri}/users`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error fetching users: ", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
 },

 // Función para crear un nuevo usuario
 async createUser(userData: any): Promise<any> {
    return this.registerUser(userData);
 },

 // Función para actualizar un usuario
 async updateUser(userId: string, userData: any): Promise<any> {
    try {
      const response = await axios.put(`${uri}/users/${userId}`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (!response.data) {
        throw new Error('Error al actualizar el usuario');
      }
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error; // Propagar el error para manejarlo en el componente
    }
 },

 // Función para eliminar un usuario
 async deleteUser(userId: string): Promise<void> {
    try {
      await axios.delete(`${uri}/users/${userId}`, { withCredentials: true });
      console.log("Usuario eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
 },
 async fetchReplies(postId: string): Promise<any[]> {
  try {
    const response = await axios.get(`${uri3}/${postId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
},

// Función para crear una nueva respuesta
async createReply(postId: string, replyData: any): Promise<any> {
  try {
    const response = await axios.post(`${uri3}/${postId}`, replyData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating reply:', error);
    throw error;
  }
},

// Función para actualizar una respuesta
async updateReply(replyId: string, replyData: any): Promise<any> {
  try {
    const response = await axios.put(`${uri3}/${replyId}`, replyData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating reply:', error);
    throw error;
  }
},

// Función para eliminar una respuesta
async deleteReply(replyId: string): Promise<void> {
  try {
    await axios.delete(`${uri3}/${replyId}`, { withCredentials: true });
    console.log("Reply deleted successfully.");
  } catch (error) {
    console.error("Error deleting reply:", error);
    throw error;
  }
},



 // Función para cerrar sesión de un usuario
 async logoutUser(): Promise<void> {
    // Aquí puedes implementar la lógica necesaria para el logout, por ejemplo, invalidar el token de sesión
    console.log("Usuario desconectado exitosamente.");
 }

};

export default api;