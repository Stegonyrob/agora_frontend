import axios from "axios";
import { Post } from "../types/types";
import { getUserRole } from "./users.api";

// Interface for Post Data
interface PostData {
  title: string;
  message: string;
  creationDate?: string;
}

// DTO Class for Post Data
class PostDTO implements PostData {
  title: string;
  message: string;
  creationDate?: string;

  constructor(title: string, message: string, creationDate?: string) {
    this.title = title;
    this.message = message;
    this.creationDate = creationDate;
  }
}

// Environment Variables for API Endpoints
const uri = import.meta.env.VITE_API_ENDPOINT_GENERAL;
const uri2 = import.meta.env.VITE_API_ENDPOINT_POSTS;
const uri3 = import.meta.env.VITE_API_ENDPOINT_POSTS_ADMIN;
const uri4 = import.meta.env.VITE_API_ENDPOINT_REPLIES;
const uri5 = import.meta.env.VITE_API_ENDPOINT_IMAGES;

const apiPost = {
  // Fetch Posts - Retrieves posts visible to both users and admins
  async fetchPosts(): Promise<Post[]> {
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(`${uri2}`, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts: ", error);
      throw error;
    }
  },

  // Update Post - Allows only admins to edit posts
  async updatePost(postId: string, postData: PostData): Promise<Post> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can update posts");
    }

    const postDTO = new PostDTO(
      postData.title,
      postData.message,
      postData.creationDate
    );

    try {
      const response = await axios.put(`${uri3}/${postId}`, postDTO, {
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

  // Create Post - Allows only admins to create posts
  async createPost(postData: PostData): Promise<Post> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can create posts");
    }

    const postDTO = new PostDTO(
      postData.title,
      postData.message,
      postData.creationDate
    );

    try {
      const response = await axios.post(`${uri3}/store`, postDTO, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // Delete Post - Allows only admins to delete posts
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
};

export default apiPost;
