import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";

export class FavoriteRepository {
  private uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  async getFavoritesCount(itemId: number): Promise<number> {
    const response = await axios.get(`${this.uri}/${itemId}/favorites/count`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async giveLike(itemId: number): Promise<void> {
    await axios.put(`${this.uri}/${itemId}/favorite`, null, {
      headers: getAuthHeaders(),
    });
  }

  async removeLike(itemId: number): Promise<void> {
    await axios.put(`${this.uri}/${itemId}/unfavorite`, null, {
      headers: getAuthHeaders(),
    });
  }
}
