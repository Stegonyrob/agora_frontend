import axios, { AxiosRequestConfig } from "axios";

export default class EventFavoriteService {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_EVENTS;

  // 0. Get Config - getConfig()
  private async getConfig(): Promise<AxiosRequestConfig> {
    return {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  // 1. Get favorites count for Event
  async getFavoritesCount(eventId: number): Promise<number> {
    console.log(`Fetching favorites count for event ID: ${eventId}`);
    const config = await this.getConfig();
    try {
      const response = await axios.get(
        `${this.uri}/${eventId}/favorites/count`,
        config
      );
      console.log(`Favorites count for event ID ${eventId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching favorites count for event ID ${eventId}:`,
        error
      );
      throw error;
    }
  }

  // 2. Add favorite (like)
  async giveLike(eventId: number): Promise<void> {
    const config = await this.getConfig();
    await axios.post(`${this.uri}/${eventId}/favorite`, {}, config);
  }

  // 3. Remove favorite (unlike)
  async removeLike(eventId: number): Promise<void> {
    const config = await this.getConfig();
    await axios.post(`${this.uri}/${eventId}/unfavorite`, {}, config);
  }
}
