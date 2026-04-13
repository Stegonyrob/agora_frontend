import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import IBanned from "./IBanned";
import IBannedDTO from "./IBannedDTO";

export class BannedRepository {
  // Usar el endpoint correcto para admin/banned
  private readonly uri: string = import.meta.env.VITE_API_ENDPOINT_BANNED;

  async getAll(): Promise<IBanned[]> {
    const res = await axios.get(this.uri, { headers: getAuthHeaders() });
    return res.data;
  }

  async getByUserId(userId: number): Promise<IBanned | null> {
    const endpoint = `${this.uri}/user/${userId}`;
    try {
      const res = await axios.get(endpoint, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async create(bannedData: IBannedDTO): Promise<IBanned> {
    const userId = bannedData.userId;
    const endpoint = `${this.uri}/user/${userId}`;
    const payload = { reason: bannedData.reason };
    const res = await axios.post(endpoint, payload, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async update(id: number, bannedData: IBannedDTO): Promise<IBanned> {
    const res = await axios.put(`${this.uri}/${id}`, bannedData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async delete(userId: number): Promise<void> {
    const endpoint = `${this.uri}/user/${userId}`;
    await axios.delete(endpoint, { headers: getAuthHeaders() });
  }
}
