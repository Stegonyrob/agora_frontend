import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import { IReply } from "./IReply";
import { IReplyDTO } from "./IReplyDTO";

export class ReplyRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_REPLIES;

  async getAll(): Promise<IReply[]> {
    const response = await axios.get(`${this.uri}/all`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async getByPostId(postId: number): Promise<IReply[]> {
    const response = await axios.get(`${this.uri}/post/${postId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async create(reply: IReplyDTO): Promise<IReply> {
    const response = await axios.post(`${this.uri}/create`, reply, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async update(reply: IReplyDTO): Promise<IReply> {
    if (!reply.replyId) throw new Error("replyId is required for update");
    const response = await axios.put(`${this.uri}/${reply.replyId}`, reply, {
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
