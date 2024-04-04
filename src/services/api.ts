import axios from 'axios';
import { Post } from '../types/types';



const baseURL = 'http://localhost:8080/api/v1'; 
const api = axios.create({
  baseURL,
});




export async function fetchPosts(): Promise<Post[]> {
 try {
    const response = await axios.get("http://localhost:8080/api/v1/posts");
    return response.data;
 } catch (error) {
    console.error("Error fetching posts: ", error);
    throw error; // Propagar el error para manejarlo en el componente
 }
}





export const logoutUser = async () => {
  // Realiza cualquier lógica necesaria para el logout
};

// Funciones para el registro de usuarios
export const registerUser = async (userData: any) => {
  return api.post('/users', userData);
};

// Operaciones CRUD para usuarios
export const getUsers = async () => {
  return api.get('/users');
};

export const createUser = async (userData: any) => {
  return api.post('/users', userData);
};

export const updateUser = async (userId: any, userData: any) => {
  return api.put(`/users/${userId}`, userData);
};

export const deleteUser = async (userId: any) => {
  return api.delete(`/users/${userId}`);
};
