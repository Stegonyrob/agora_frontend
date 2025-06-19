import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import { IPost } from "./IPost";
import { IPostDTO } from "./IPostDTO";

export default class PostRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_POSTS;

  // Todos los métodos requieren autenticación

  // Lectura (user y admin)
  async getAll(): Promise<IPost[]> {
    const response = await axios.get(this.uri, { headers: getAuthHeaders() });
    return response.data;
  }

  async getById(id: number): Promise<IPost> {
    const response = await axios.get(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  // CRUD (solo admin, pero el backend debe validar el rol)
  async create(post: IPostDTO): Promise<IPost> {
    const response = await axios.post(this.uri, post, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async update(postId: number, post: IPostDTO): Promise<IPost> {
    const response = await axios.put(`${this.uri}/${postId}`, post, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async delete(postId: number): Promise<void> {
    await axios.delete(`${this.uri}/${postId}`, { headers: getAuthHeaders() });
  }

  async archive(postId: number, archive: boolean): Promise<void> {
    await axios.patch(
      `${this.uri}/${postId}/archive?archive=${archive}`,
      null,
      { headers: getAuthHeaders() }
    );
  }
}
