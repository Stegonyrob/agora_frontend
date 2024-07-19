import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IPost } from "./IPost";
import { IPostDTO } from "./IPostDTO";

export default class PostService {
  [x: string]: any;
  private userUri: string = import.meta.env.VITE_APP_API_USERS_POSTS;
  private adminUri: string = import.meta.env.VITE_APP_API_ADMIN_POSTS;

  async fetchPosts(): Promise<IPost[]> {
    const { data } = await axios.get<IPost[]>(this.userUri);
    return data;
  }

  async fetchPostById(id: number): Promise<IPost> {
    try {
      const response: AxiosResponse = await axios.get(`${this.userUri}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error fetching post by id: ${error.message}`);
    }
  }

  async createPost(newPost: IPostDTO, roles: string): Promise<IPost> {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
    };

    try {
      const response: AxiosResponse = await axios.post(
        this.adminUri,
        newPost,
        config
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Error creating post: ${error.message}`);
    }
  }

  async deletePost(id: number): Promise<void> {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
    };

    try {
      await axios.delete(`${this.adminUri}/${id}`, config);
    } catch (error: any) {
      throw new Error(`Error deleting post: ${error.message}`);
    }
  }

  async updatePost(post: IPostDTO, id: number): Promise<IPost> {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
    };

    try {
      const response: AxiosResponse = await axios.put(
        `${this.adminUri}/${id}`,
        post,
        config
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Error updating post: ${error.message}`);
    }
  }
}
