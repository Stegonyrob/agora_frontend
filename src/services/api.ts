import axios from 'axios';
import { Post } from '../types/types';

// Definición de las URIs utilizando variables de entorno
const uri = import.meta.env.VITE_API_ENDPOINT_GENERAL;
const uri2 = import.meta.env.VITE_API_ENDPOINT_POSTS;

// Creación de un objeto para organizar las funciones de API
const api = {
 // Función para obtener posts
 async fetchPosts(): Promise<Post[]> {
    try {
      const response = await axios.get(`${uri2}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts: ", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
 },

 // Función para actualizar un post
 async updatePost(postId: string, postData: any): Promise<Post> {
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
 async createPost(postData: any): Promise<Post> {
    try {
      const response = await axios.post(`${uri2}`, postData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (!response.data) {
        throw new Error('Error al crear el post');
      }
      return response.data;
    } catch (error) {
      console.error('Error al crear el post:', error);
      throw error; // Propagar el error para manejarlo en el componente
    }
 },

 // Función para eliminar un post
 async deletePost(postId: string): Promise<void> {
    try {
      await axios.delete(`${uri2}/${postId}`, { withCredentials: true });
      console.log("Post eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar el post:", error);
      throw error; // Propagar el error para manejarlo en el componente
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

 // Función para cerrar sesión de un usuario
 async logoutUser(): Promise<void> {
    // Aquí puedes implementar la lógica necesaria para el logout, por ejemplo, invalidar el token de sesión
    console.log("Usuario desconectado exitosamente.");
 }
};

export default api;