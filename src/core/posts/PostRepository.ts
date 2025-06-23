import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import { IPost } from "./IPost";
import { IPostDTO } from "./IPostDTO";

export default class PostRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_POSTS;

  // Obtener todos los posts (array)
  async getAll(): Promise<IPost[]> {
    const response = await axios.get(this.uri, { headers: getAuthHeaders() });
    return response.data;
  }

  // Obtener un post por ID
  async getById(id: number): Promise<IPost> {
    const response = await axios.get(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  // Crear un post (solo admin)
  async create(post: IPostDTO): Promise<IPost> {
    const response = await axios.post(this.uri, post, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  // Actualizar un post (solo admin)
  async update(postId: number, post: IPostDTO): Promise<IPost> {
    const response = await axios.put(`${this.uri}/${postId}`, post, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  // Eliminar un post (solo admin)
  async delete(postId: number): Promise<void> {
    await axios.delete(`${this.uri}/${postId}`, { headers: getAuthHeaders() });
  }

  // Archivar/desarchivar un post (solo admin)
  async archive(postId: number, archive: boolean): Promise<void> {
    await axios.patch(
      `${this.uri}/${postId}/archive?archive=${archive}`,
      null,
      { headers: getAuthHeaders() }
    );
  }
}
