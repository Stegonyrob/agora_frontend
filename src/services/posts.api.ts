import axios from "axios";
import { PostDTO } from "../dto/post.dto";
import { RootState, useAppSelector } from "../redux/store";
import { Post } from "../types/types";
import { getUserRole } from "./users.api";
// Environment Variables for API Endpoints

const uri2 = import.meta.env.VITE_API_ENDPOINT_USERS_POSTS;
const uri3 = import.meta.env.VITE_API_ENDPOINT_ADMIN_POSTS;

interface PostData {
  title: string;
  message: string;
  creationDate?: string;
}

const apiPost = {
  // Fetch Posts - Retrieves posts visible to both users and admins
  async fetchPosts(getToken: (state: RootState) => any): Promise<Post[]> {
    const token = useAppSelector(getToken);

    if (!token) {
      throw new Error("No token available");
    }

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
  // Create Post - Allows only admins to create posts
  // posts.api.ts
  async createPost(
    postData: PostData,
    role: string,
    isAuthenticated: boolean
  ): Promise<Post> {
    if (!isAuthenticated) {
      throw new Error("Only admin can create posts");
    }

    const userRole = useAppSelector((state) => state.auth.role);
    if (userRole !== "ADMIN") {
      throw new Error("Only admin can create posts");
    }

    const postDTO = new PostDTO(
      postData.title,
      postData.message,
      postData.creationDate
    );

    try {
      const response = await axios.post(`${uri3}`, postDTO, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(uri3);

      if (!response || !response.data) {
        throw new Error("Error creating post");
      }

      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
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

  // Delete Post - Allows only admins to delete posts
  async deletePost(postId: string): Promise<void> {
    const userRole = useAppSelector((state) => state.auth.role);

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
