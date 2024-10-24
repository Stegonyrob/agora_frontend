import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import store from "../../redux/store";
import { IPost } from "./IPost";
import { IPostDTO } from "./IPostDTO";

// Index:

// 1. Get posts - fetchPosts() 200 ok
// 2. Get posts by id - fetchPostById() 200 ok,
// 3. Created Posts - createPost() 200 ok but null
// 4. Delete Posts- deletePost() 200 ok 500
// 5. Update Posts- updatePost() 202 ok
// 6. Archive post archivePost use PATCH
// 7. UnArchive post unarchivePost use PATCH
export default class PostService {
  [x: string]: any;
  private uri: string = import.meta.env.VITE_API_ENDPOINT_POSTS;
  // 1. Get posts - fetchPosts() 200ok
  async fetchPosts(): Promise<IPost[]> {
    console.log("Begin fetchPosts");
    console.log("Fetching posts...");
    try {
      const isAuthenticated = store.getState().login.isLoggedIn;
      console.log("isAuthenticated:", isAuthenticated);
      const token = sessionStorage.getItem("accessToken");
      console.log("token:", token);
      console.log("Headers:", {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      });
      const response: AxiosResponse<IPost[]> = await axios.get<IPost[]>(
        this.uri,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("Response Data:", response.data);
      console.log(
        `Posts fetched successfully. Data: ${JSON.stringify(response.data)}`
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching posts: ${error.message}`);
      throw new Error(`Error fetching posts: ${error.message}`);
    } finally {
      console.log("End fetchPosts");
    }
  }

  // 2. Get posts by id - fetchPostById() 200 ok,
  async fetchPostById(id: number): Promise<IPost> {
    try {
      const response: AxiosResponse<IPost> = await axios.get<IPost>(
        `${this.uri}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching post by id: ${error.message}`);
      throw new Error(`Error fetching post by id: ${error.message}`);
    }
  }
  // 3. Created Posts - createPost() 200 ok but null
  async createPost(newPost: IPostDTO): Promise<IPost> {
    console.log("Creating post...");
    console.log("newPost:", newPost);
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
    };

    try {
      console.log("Sending POST request to:", this.uri);
      console.log("Request body:", newPost);
      console.log("Request headers:", config.headers);
      const response: AxiosResponse<IPost> = await axios.post<IPost>(
        `${this.uri}`,

        newPost,
        config
      );
      console.log(this.uri);
      console.log("Response:", response);
      console.log("Post created successfully.");
      return response.data;
    } catch (error: any) {
      console.error(`Error creating post: ${error.message}`);
      console.error("Error details:", error);
      throw new Error(`Error creating post: ${error.message}`);
    }
  }
  // 4. Delete Posts- deletePost()200 ok
  async deletePost(id: number): Promise<void> {
    console.log(`Attempting to delete post by id: ${id}`);
    console.log(`Deleting post by id: ${id}`);
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
    };

    try {
      console.log(`Sending DELETE request to: ${this.uri}/${id}`);
      console.log(`Request headers:`, config.headers);
      await axios.delete(`${this.uri}/${id}`, config);
      console.log(`Post by id: ${id} deleted successfully.`);
    } catch (error: any) {
      console.error(`Error deleting post: ${error.message}`);
      console.error(`Error details:`, error);
      throw new Error(`Error deleting post: ${error.message}`);
    }
  }
  // 5. Update Posts- updatePost() error 500
  async updatePost(post: IPostDTO, postId: number): Promise<IPost> {
    console.log(`Updating post by id: ${postId}`);
    console.log("Post DTO:", post);
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
    };

    try {
      console.log("Sending PUT request to:", `${this.uri}/${postId}`);
      console.log("Request body:", post);
      console.log("Request headers:", config.headers);
      const response: AxiosResponse = await axios.put(
        `${this.uri}/${postId}`,
        post,
        config
      );
      console.log("Response:", response);
      console.log(`Post by id: ${postId} updated successfully.`);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating post: ${error.message}`);
      console.error("Error details:", error);
      throw new Error(`Error updating post: ${error.message}`);
    }
  }
  // 6. Archive post archivePost use PATCH
  async archivePost(id: number): Promise<void> {
    console.log(`Attempting to archive post by id: ${id}`);
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
    };

    try {
      console.log(`Sending ARCHIVE request to: ${this.uri}/${id}`);
      console.log(`Request headers:`, config.headers);

      // Cambiar a PATCH o PUT según tu API
      await axios.patch(`${this.uri}/${id}`, { archived: true }, config);

      console.log(`Post by id: ${id} archived successfully.`);
    } catch (error: any) {
      console.error(`Error archiving post: ${error.message}`);
      console.error(`Error details:`, error);
      throw new Error(`Error archiving post: ${error.message}`);
    }
  }
  // 7. UnArchive post unarchivePost use PATCH
  async unarchivePost(id: number): Promise<void> {
    console.log(`Attempting to unarchive post by id: ${id}`);
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
    };

    try {
      console.log(`Sending UNARCHIVE request to: ${this.uri}/${id}`);
      console.log(`Request headers:`, config.headers);

      // Cambiar a PATCH o PUT según tu API
      await axios.patch(`${this.uri}/${id}`, { archived: false }, config);

      console.log(`Post by id: ${id} unarchived successfully.`);
    } catch (error: any) {
      console.error(`Error unarchiving post: ${error.message}`);
      console.error(`Error details:`, error);
      throw new Error(`Error unarchiving post: ${error.message}`);
    }
  }
}
