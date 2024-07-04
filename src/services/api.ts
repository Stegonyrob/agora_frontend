import axios from "axios";
import { Post } from "../types/types";
// Index:
// 1. Fetch Posts - fetchPosts()
// 2. Update Post - updatePost()
// 3. Create Post - createPost()
// 4. Delete Post - deletePost()
// 5. Register User - registerUser()
// 6. Get Users - getUsers()
// 7. Update User - updateUser()
// 8. Profile User - profileUser()
// 9. Get Profiles - getProfiles()
// 10. Update Profile - updateProfile()
// 11. Delete User - deleteUser()
// 12. Fetch Replies - fetchReplies()
// 13. Create Reply - createReply()
// 14. Update Reply - updateReply()
// 15. Delete Reply - deleteReply()
// 16. Fecht Images - fetchImages()

// Environment Variables for API Endpoints
const uri = import.meta.env.VITE_API_ENDPOINT_GENERAL;
const uri2 = import.meta.env.VITE_API_ENDPOINT_POSTS;
const uri3 = import.meta.env.VITE_API_ENDPOINT_POSTS_ADMIN;
const uri4 = import.meta.env.VITE_API_ENDPOINT_REPLIES;
const uri5 = import.meta.env.VITE_API_ENDPOINT_IMAGES;

const api = {
  // 1. Fetch Posts - Retrieves posts visible to both users and admins
  async fetchPosts(): Promise<Post[]> {
    const token = localStorage.getItem("authToken");
    console.log(token);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log(config);
    try {
      const response = await axios.get(`${uri2}`, config);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts: ", error);
      throw error;
    }
  },

  // 2. Update Post - Allows only admins to edit posts
  async updatePost(postId: string, postData: string): Promise<Post> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can update posts");
    }
    try {
      const response = await axios.put(`${uri3}/${postId}`, postData, {
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
  // 3. Create Post - Allows only admins to create posts
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
      const response = await axios.post(`${uri3}/store`, post, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // 4. Delete Post - Allows only admins to delete posts
  async deletePost(postId: string): Promise<void> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can delete posts");
    }
    try {
      await axios.delete(`${uri3}/${postId}`, {
        withCredentials: true,
      });
      console.log("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  // 5. Register User - Allows all users to register
  async registerUser(userData: any): Promise<any> {
    try {
      const response = await axios.post(`${uri}/users/register`, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (!response.data) {
        throw new Error("Error registering user");
      }
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  // 6. Get Users - Allows admins to fetch all users for moderation purposes
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

  // 7. Update User - Allows users to update their own profile or admins to update any user
  async updateUser(userId: string, userData: any): Promise<any> {
    const userRole = await getUserRole();
    if (userRole !== "admin" && userId !== userData.id) {
      throw new Error("Only admin or self can update user");
    }
    try {
      const response = await axios.put(`${uri}/users/${userId}`, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (!response.data) {
        throw new Error("Error updating user");
      }
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // 8. Profile User - Allows users to register a profile
  async profileUser(userData: {
    avatar: string;
    firstName: string;
    lastName1: string;
    lastName2: string;
    relationship: string;
    email: string;
    city: string;
    userId: string;
  }): Promise<any> {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(`${uri}/users/${userId}`, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (!response.data) {
        throw new Error("Error registering user");
      }
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  // 9. Get Profiles - Allows admins to fetch all profiles for moderation
  async getProfiles(userId: string): Promise<any> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can fetch profiles");
    }
    try {
      const response = await axios.get(`${uri}/users/profile`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching profiles: ", error);
      throw error;
    }
  },

  // 10. Update Profile - Allows users to update their own profile or admins to update any profile
  async updateProfile(profileId: string, userData: any): Promise<any> {
    const userRole = await getUserRole();
    if (userRole !== "admin" && profileId !== userData.id) {
      throw new Error("Only admin or self can update profile");
    }
    try {
      const response = await axios.put(`${uri}/users/${profileId}`, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (!response.data) {
        throw new Error("Error updating profile");
      }
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // 11. Delete User - Allows users to delete themselves or admins to delete any user
  async deleteUser(userId: string, userData: any): Promise<void> {
    const userRole = await getUserRole();
    if (userRole !== "admin" && userId !== userData.id) {
      throw new Error("Only admin or self can delete user");
    }
    try {
      await await axios(`${uri}/users/${userId}`, {
        withCredentials: true,
      });
      await axios.delete(`${uri}/users/profile/${userId}`, {
        withCredentials: true,
      });
      console.log("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // 12. Fetch Replies - Allows admins to fetch replies by post ID
  async fetchReplies(postId: string): Promise<any[]> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can fetch replies");
    }
    try {
      const response = await axios.get(`${uri4}/${postId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching replies: ", error);
      throw error;
    }
  },

  // 13. Create Reply - Allows admins and users to create replies
  async createReply(postId: string, replyData: any): Promise<any> {
    const userRole = await getUserRole();
    if (userRole !== "admin" && userRole !== "user") {
      throw new Error("Only admin or user can create replies");
    }
    try {
      const response = await axios.post(`${uri4}/${postId}`, replyData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating reply:", error);
      throw error;
    }
  },

  // 14. Update Reply - Allows owners or admins to update replies
  async updateReply(replyId: string, replyData: any): Promise<any> {
    const userRole = await getUserRole();
    if (userRole !== "admin" && userRole !== "user") {
      throw new Error("Only admin or user can update replies");
    }
    try {
      const response = await axios.put(`${uri4}/${replyId}`, replyData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating reply:", error);
      throw error;
    }
  },

  // 15. Delete Reply - Allows creators or admins to delete replies
  async deleteReply(replyId: string): Promise<void> {
    const userRole = await getUserRole();
    if (userRole !== "admin" && userRole !== "user") {
      throw new Error("Only admin or user can delete replies");
    }
    try {
      await axios.delete(`${uri4}/${replyId}`, {
        withCredentials: true,
      });
      console.log("Reply deleted successfully.");
    } catch (error) {
      console.error("Error deleting reply:", error);
      throw error;
    }
  },
  // 16. Fetch Images - Allows admins to fetch images by post ID
  async fetchImages(postId: string): Promise<any[]> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can fetch images");
    }
    try {
      const response = await axios.get(`${uri5}/getAsResource/${postId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching images: ", error);
      throw error;
    }
  },

  // 17. Upload Images - Allows users to upload images for their profiles
  async uploadImages(postId: string, imageData: FormData): Promise<any> {
    const userRole = await getUserRole();
    if (userRole !== "admin" && userRole !== "user") {
      throw new Error("Only admin or user can upload images");
    }
    try {
      const response = await axios.post(
        `${uri5}/uploadImages/${postId}`,
        imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  },

  // 18. Delete Images - Allows users to delete their own images or admins to delete any image
  async deleteImages(filename: string): Promise<void> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can delete images");
    }
    try {
      await axios.delete(`${uri5}/${filename}`, {
        withCredentials: true,
      });
      console.log("Image deleted successfully.");
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  },
};
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
