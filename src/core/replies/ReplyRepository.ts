import axios from "axios";
import { IReply } from "./IReply";

export class ReplyRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_REPLIES
  async getAll(): Promise<IReply[]> {
    try {
      const response = await axios.get(`${this.uri}/all`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get replies");
    }
  }

  async getByPostId(postId: number): Promise<IReply[]> {
    try {
      const response = await axios.get(`${this.uri}/post/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get replies by post ID");
    }
  }

  async create(reply: IReply): Promise<IReply> {
    try {
      const response = await axios.post(`${this.uri}/create`, reply);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create reply");
    }
  }

  async update(reply: IReply): Promise<IReply> {
    try {
      const response = await axios.put(`${this.uri}/update`, reply);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update reply");
    }
  }

  async delete(replyId: number): Promise<void> {
    try {
      await axios.delete(`${this.uri}/delete/${replyId}`);
    } catch (error) {
      throw new Error("Failed to delete reply");
    }
  }
}