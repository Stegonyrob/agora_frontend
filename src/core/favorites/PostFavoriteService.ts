import axios, { AxiosRequestConfig } from "axios";

// Index:
// 0. Get Authenticated Config - getAuthenticatedConfig()

// 1. Get favorite Post for profile - getFavorite()
// 2. Add favorite Post for profile - giveLike()
// 3. Delete favorite Post for profile - removeLike()

// Environment Variables for API Endpoints
//api/v1/any/users'

export default class PostFavoriteService {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_FAVORITE;

  // 0. Get Authenticated Config - getAuthenticatedConfig()
  private async getAuthenticatedConfig(): Promise<AxiosRequestConfig> {
    const token = sessionStorage.getItem("accessToken");
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
  }

  // 1. Get favorite Post for profile - getFavorite()
  async getFavorite(postId: number): Promise<any> {
    const config = await this.getAuthenticatedConfig();
    const response = await axios.get(`${this.uri}/${postId}`, config);
    return response.data;
  }

  // 2. Add favorite Post for profile - giveLike()
  async giveLike(postId: number, profileId: number): Promise<any> {
    const config = await this.getAuthenticatedConfig();
    const favoriteDTO = { postId, profileId };
    const response = await axios.post(
      `${this.uri}/${postId}`,
      favoriteDTO,
      config
    );
    return response.data;
  }

  // 3. Delete favorite Post for profile - removeLike()
  async removeLike(postId: number, profileId: number): Promise<any> {
    const config = await this.getAuthenticatedConfig();
    const response = await axios.delete(`${this.uri}/${postId}`, config);
    return response.data;
  }
}
