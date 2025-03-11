import axios, { AxiosRequestConfig } from "axios";
import store from "../../redux/store";

// Index:
// 0. Get Authenticated Config - getAuthenticatedConfig()

// 1. Get favorite Post for profile - getFavoritePost()
// 2. Add favorite Post for profile - giveLike()
// 3. Delete favorite Post for profile - removeLike()

// Environment Variables for API Endpoints
//api/v1/any/users'
export default class FavoriteService {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_FAVORITE;

  private async getAuthenticatedConfig(): Promise<AxiosRequestConfig> {
    const isAuthenticated = store.getState().login.isLoggedIn;
    console.log("isAuthenticated:", isAuthenticated);
    const token = sessionStorage.getItem("accessToken");
    console.log("token:", token);
    const userId = sessionStorage.getItem("userId");
    console.log("Headers:", {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    });

    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
  }

  // 1. Get favorite Post for profile - getFavoritePost()
  async getFavoritePost(postId: number): Promise<any> {
    const config = await this.getAuthenticatedConfig();
    const userId = sessionStorage.getItem("userId");
    const response = await axios.get(`${this.uri}`, config);
    return response.data;
  }
  VITE_API_ENDPOINT_FAVORITE = "http://localhost:8080/api/v1/any/favorites";
  // 2. Add favorite Post for profile - giveLike() http://localhost:8080/api/v1/any/favorites/2
  async giveLike(postId: number, profileId: number): Promise<any> {
    console.log("Begin giveLike");
    const config = await this.getAuthenticatedConfig();
    console.log("Config:", config);
    const favoriteDTO = {
      postId: postId,
      profileId: profileId,
    };
    console.log("favoriteDTO:", favoriteDTO);
    const response = await axios.post(
      `${this.uri}/${postId}`,
      favoriteDTO,
      config
    );
    console.log("Response Data:", response.data);
    console.log("End giveLike");
    return response.data;
  }

  // 3. Delete favorite Post for profile - removeLike()
  async removeLike(postId: number, userId: number): Promise<any> {
    const config = await this.getAuthenticatedConfig();
    const response = await axios.delete(`${this.uri}/${postId}`, config);
    return response.data;
  }
}
