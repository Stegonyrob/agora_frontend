import axios, { AxiosRequestConfig } from "axios";

export default class PostFavoriteService {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_POSTS;

  private async getAuthenticatedConfig(): Promise<AxiosRequestConfig> {
    const token = sessionStorage.getItem("accessToken");
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
  }

  async getFavoritesCount(postId: number): Promise<number> {
    const config = await this.getAuthenticatedConfig();
    const response = await axios.get(
      `${this.uri}/${postId}/favorites/count`,
      config
    );
    return response.data;
  }

  async giveLike(postId: number): Promise<void> {
    const config = await this.getAuthenticatedConfig();
    await axios.put(`${this.uri}/${postId}/favorite`, null, config);
  }

  async removeLike(postId: number): Promise<void> {
    const config = await this.getAuthenticatedConfig();
    await axios.put(`${this.uri}/${postId}/unfavorite`, null, config);
  }
}
