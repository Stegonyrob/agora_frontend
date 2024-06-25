import axios from "axios";
import { Post } from "../types/types";

// Definición de las URIs utilizando variables de entorno
const uri = import.meta.env.VITE_API_ENDPOINT_GENERAL;
const uri2 = import.meta.env.VITE_API_ENDPOINT_POSTS;
const uri3 = import.meta.env.VITE_API_ENDPOINT_REPLIES;

const api = {
  //Crud Post
  // Función para obtener posts los post podran ser vistos por user y admin
  async fetchPosts(): Promise<Post[]> {
    // No role restriction for fetching posts
    try {
      const response = await axios.get(`${uri2}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts: ", error);
      throw error;
    }
  },

  // Función para editar un nuevo post solo lo puede editar el admin
  async updatePost(postId: string, postData: string): Promise<Post> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can update posts");
    }
    try {
      const response = await axios.put(`${uri2}/${postId}`, postData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (!response.data) {
        throw new Error("Error al actualizar el post");
      }
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el post:", error);
      throw error;
    }
  },

  // Función para crear un nuevo post solo el admin puede crear post
  async createPost(post: {
    title: string;
    message: string;
    creationDate?: string;
  }): Promise<Post> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can create posts");
    }
    try {
      const response = await axios.post(
        `${uri2}/store`,
        {
          title: post.title,
          message: post.message,
          creationDate: post.creationDate || new Date().toISOString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear el post:", error);
      throw error;
    }
  },

  // Función para eliminar un post solo el admin puede borrar post
  async deletePost(postId: string): Promise<void> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can delete posts");
    }
    try {
      await axios.delete(`${uri2}/${postId}`, { withCredentials: true });
      console.log("Post eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar el post:", error);
      throw error;
    }
  },

  //Usuarios Crud
  // Función para registrar un nuevo usuario todos se pueden registrar
  async registerUser(userData: any): Promise<any> {
    // No role restriction for registering users
    try {
      const response = await axios.post(`${uri}/users/register`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (!response.data) {
        throw new Error("Error al registrar el usuario");
      }
      return response.data;
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      throw error;
    }
  },

  // Función para obtener usuarios el admin puede obtener todos los usuarios para poder moderar
  async getUsers(): Promise<any> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can fetch users");
    }
    try {
      const response = await axios.get(`${uri}/users`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users: ", error);
      throw error;
    }
  },

  // Función para actualizar un usuario el usuario puede actualizar su perfil
  async updateUser(userId: string, userData: any): Promise<any> {
    const userRole = await getUserRole();
    if (userRole !== "admin" && userId !== userData.id) {
      throw new Error("Only admin or self can update user");
    }
    try {
      const response = await axios.put(`${uri}/users/${userId}`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (!response.data) {
        throw new Error("Error al actualizar el usuario");
      }
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  },

  //Función para eliminar un usuario el usuario y el admin pueden eliminar usuarios peroe l usuario solo se puede eliminar asi mismo

  async deleteUser(userId: string, userData: any): Promise<void> {
    const userRole = await getUserRole();
    if (userRole !== "admin" && userId !== userData.id) {
      throw new Error("Only admin or self can delete user");
    }
    try {
      await axios.delete(`${uri}/users/${userId}`, { withCredentials: true });
      console.log("Usuario eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  },

  //Crud replies
  // Función para obtener respuestas el admin puede traer post por id
  async fetchReplies(postId: string): Promise<any[]> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can fetch replies");
    }
    try {
      const response = await axios.get(`${uri3}/${postId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching replies: ", error);
      throw error;
    }
  },

  // Función para crear una nueva respuesta el admin y el usario pueden crear respuestas
  async createReply(postId: string, replyData: any): Promise<any> {
    const userRole = await getUserRole();
    if (userRole !== "admin" && userRole !== "user") {
      throw new Error("Only admin or user can create replies");
    }
    try {
      const response = await axios.post(`${uri3}/${postId}`, replyData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating reply:", error);
      throw error;
    }
  },

  // Función para actualizar una respuesta el usuario dueño de esa respuesta puede editarla
  async updateReply(replyId: string, replyData: any): Promise<any> {
    const userRole = await getUserRole();
    if (userRole !== "admin" && userRole !== "user") {
      throw new Error("Only admin or user can update replies");
    }
    try {
      const response = await axios.put(`${uri3}/${replyId}`, replyData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating reply:", error);
      throw error;
    }
  },

  // Función para eliminar una respuesta el usuario creaddor de la respuesta y el admin pueden borrar la respuesta
  async deleteReply(replyId: string): Promise<void> {
    const userRole = await getUserRole();
    if (userRole !== "admin" && userRole !== "user") {
      throw new Error("Only admin or user can delete replies");
    }
    try {
      await axios.delete(`${uri3}/${replyId}`, { withCredentials: true });
      console.log("Reply deleted successfully.");
    } catch (error) {
      console.error("Error deleting reply:", error);
      throw error;
    }
  },
};
//Role
async function getUserRole(): Promise<string> {
  // Implement a function to get the user's role from the token or database
  // For example:
  const token = localStorage.getItem("authToken");
  const response = await axios.get(`${uri}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.role;
}

export default api;
