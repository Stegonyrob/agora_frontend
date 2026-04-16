import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import {
  normalizeArray,
  normalizeItem,
} from "../normalization/normalizeApiResponse";
import { IReply } from "./IReply";
import { IReplyDTO } from "./IReplyDTO";

export class ReplyRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_REPLIES;

  async getAll(): Promise<IReply[]> {
    const response = await axios.get(`${this.uri}/all`, {
      headers: getAuthHeaders(),
    });
    return normalizeArray(response.data).map((r) => normalizeItem(r));
  }

  async getByCommentId(commentId: number): Promise<IReply[]> {
    const response = await axios.get(`${this.uri}/comment/${commentId}`, {
      headers: getAuthHeaders(),
    });
    return normalizeArray(response.data).map((r) => normalizeItem(r));
  }

  async create(reply: IReplyDTO): Promise<IReply> {
    console.log("ReplyRepository.create: payload:", reply); // <-- Añade esto
    const response = await axios.post(`${this.uri}/create`, reply, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  async update(replyId: number, reply: IReplyDTO): Promise<IReply> {
    const response = await axios.put(`${this.uri}/${replyId}`, reply, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async delete(replyId: number): Promise<void> {
    await axios.delete(`${this.uri}/${replyId}`, {
      headers: getAuthHeaders(),
    });
  }
}
