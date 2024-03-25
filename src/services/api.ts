import axios from 'axios';



const baseURL = 'http://localhost:8080/api/v1'; // Reemplaza con la URL base de tu API

const api = axios.create({
  baseURL,
});



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
