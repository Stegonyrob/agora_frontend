import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import {
  normalizeArray,
  normalizeItem,
} from "../normalization/normalizeApiResponse";
import { CommentDTO } from "./CommentDTO";
import { IComment } from "./IComment";

export class CommentRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_COMMENTS;

  async getByPostId(postId: number): Promise<IComment[]> {
    const res = await axios.get(`${this.uri}/post/${postId}/with-replies`, {
      headers: getAuthHeaders(),
    });
    // Normalizar comentarios y replies
    return normalizeArray(res.data.content).map((c) => normalizeItem(c));
  }

  async create(comment: CommentDTO): Promise<IComment> {
    const res = await axios.post(`${this.uri}/create`, comment, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async update(id: number, comment: CommentDTO): Promise<IComment> {
    const res = await axios.put(`${this.uri}/${id}`, comment, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async delete(commentId: number): Promise<void> {
    await axios.delete(`${this.uri}/${commentId}`, {
      headers: getAuthHeaders(),
    });
  }
}
