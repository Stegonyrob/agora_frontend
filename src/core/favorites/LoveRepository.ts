// ...existing code up to first class definition...
import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";

export class LoveRepository {
  protected uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  async getLovesCount(itemId: number): Promise<number> {
    const response = await axios.get(`${this.uri}/${itemId}/loves/count`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async giveLove(itemId: number, userId?: number): Promise<void> {
    await axios.put(
      `${this.uri}/${itemId}/love${userId ? `?userId=${userId}` : ""}`,
      null,
      { headers: getAuthHeaders() }
    );
  }

  async removeLove(itemId: number, userId: number): Promise<void> {
    await axios.put(
      `${this.uri}/${itemId}/unlove${userId ? `?userId=${userId}` : ""}`,
      null,
      {
        headers: getAuthHeaders(),
      }
    );
  }
}
