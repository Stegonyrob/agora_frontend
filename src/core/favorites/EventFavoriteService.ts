import axios, { AxiosRequestConfig } from "axios";

export default class EventFavoriteService {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_EVENTS;

  private async getAuthenticatedConfig(): Promise<AxiosRequestConfig> {
    const token = sessionStorage.getItem("accessToken");
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
  }

  async getFavoritesCount(eventId: number): Promise<number> {
    const config = await this.getAuthenticatedConfig();
    const response = await axios.get(
      `${this.uri}/${eventId}/favorites/count`,
      config
    );
    return response.data;
  }

  async giveLike(eventId: number): Promise<void> {
    const config = await this.getAuthenticatedConfig();
    await axios.put(`${this.uri}/${eventId}/favorite`, null, config);
  }

  async removeLike(eventId: number): Promise<void> {
    const config = await this.getAuthenticatedConfig();
    await axios.put(`${this.uri}/${eventId}/unfavorite`, null, config);
  }
}
