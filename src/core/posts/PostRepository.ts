import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import {
  normalizeArray,
  normalizeItem,
} from "../normalization/normalizeApiResponse";
import { IPost } from "./IPost";
import { IPostDTO } from "./IPostDTO";

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // página actual
  size: number;
}

export default class PostRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_POSTS;
  // Obtener todos los posts paginados
  async getAll(page = 0, size = 10): Promise<Page<IPost>> {
    const url = `${this.uri}?page=${page}&size=${size}`;
    const response = await axios.get(url, {
      headers: getAuthHeaders(),
    });
    // Debug: mostrar la respuesta cruda del backend antes de normalizar

    // Normalizar los posts en la página
    return {
      ...response.data,
      content: normalizeArray(response.data.content).map((p) =>
        normalizeItem(p)
      ),
    };
  }

  // Obtener un post por ID
  async getById(id: number): Promise<IPost> {
    const response = await axios.get(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return normalizeItem(response.data);
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
