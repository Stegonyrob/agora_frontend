import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import store from "../../redux/store";
import IProfile from "./IProfile";
import IProfileDTO from "./IProfileDTO";

// Index:
// 0. Get Authenticated Config - getAuthenticatedConfig()
// 1.  Get All Profile User - Allows users to register a profile
// 2. Get Profile byId - getProfileById()
// 3. Update Profile - updateProfile()
// 4. Delete Profile - deleteProfile()
// 5.
// 6. Update Profile byEmail - updateProfileByEmail()
// 7. Get post Profile for profile - getFavoriteProfile()
// 8. Add post Profile for profile - addFavoriteProfile()
// 9. Delete post Profile for profile - deleteFavoriteProfile()
// 10. Update post Profile for profile - upDateFavoriteComment()

// Environment Variables for API Endpoints
//api/v1/any/users'
export default class ProfileService {
  // 1. Get All Profile User - Allows users to register a profile

  private uri: string = import.meta.env.VITE_API_ENDPOINT_USERS;

  // 0. Get Authenticated Config - getAuthenticatedConfig()
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

  // 1.  Get All Profile User - Allows users to register a profile
  public async fetchProfiles(): Promise<IProfile[]> {
    console.log("Begin getAllProfiles");
    try {
      const config = await this.getAuthenticatedConfig();
      const response = await axios.get(`${this.uri}/profile`, config);

      console.log("Response Data:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching all profiles: ${error.message}`);
      throw new Error(`Error fetching all profiles: ${error.message}`);
    } finally {
      console.log("End getAllProfiles");
    }
  }

  // 2. Get Profile byId - getProfileById()
  async fetchProfileById(id: number): Promise<IProfile> {
    const userId = id;
    const config = await this.getAuthenticatedConfig();
    const response = await axios.get(`${this.uri}/profile/${userId}`, config);

    console.log("Response Data:", response.data);
    console.log(
      `Profile fetched successfully. Data: ${JSON.stringify(response.data)}`
    );
    return response.data;
  }

  // 3. Create Profile - Allows users to create a profile
  async createProfile(profileDTO: IProfileDTO): Promise<IProfile> {
    const config = await this.getAuthenticatedConfig();
    const response = await axios.post(
      `${this.uri}/profile`,
      profileDTO,
      config
    );
    return response.data;
  }

  // 4. Delete Profile - Allows users to delete their own profile or admins to delete any profile
  async deleteProfile(id: number): Promise<void> {
    try {
      const config = await this.getAuthenticatedConfig();
      const response: AxiosResponse<void> = await axios.delete<void>(
        `${this.uri}/profile/${id}`,
        config
      );

      if (response.status !== 204) {
        console.error(`Unexpected response status: ${response.status}`);
        throw new Error("Failed to delete profile");
      }

      console.log(`Profile with id ${id} deleted successfully.`);
    } catch (error: any) {
      console.error(`Error deleting profile: ${error.message}`);
      throw new Error(`Error deleting profile: ${error.message}`);
    }
  }

  // 6. Update Profile
  async updateProfile(id: number, Profile: IProfileDTO): Promise<IProfile> {
    const config = await this.getAuthenticatedConfig();
    const response: AxiosResponse<IProfile> = await axios.put<IProfile>(
      `${this.uri}/profile/${id}`,
      Profile,
      config
    );
    console.log("Response Data:", response.data);
    console.log(
      `Profile updated successfully. Data: ${JSON.stringify(response.data)}`
    );
    return response.data;
  }

  // 7. Get favorite Post for profile - getFavoriteProfile()
  async getPostFavoriteProfile(): Promise<any> {
    const config = await this.getAuthenticatedConfig();

    const userId = sessionStorage.getItem("userId");
    const response = await axios.get(
      `${this.uri}/profile/favorite/${userId}`,
      config
    );
    return response.data;
  }

  // 8. Add favorite Post for profile - addFavoriteProfile()
  async addPostFavoriteProfile(): Promise<any> {
    const config = await this.getAuthenticatedConfig();
    const userId = sessionStorage.getItem("userId");
    const response = await axios.post(
      `${this.uri}/profile/favorite/${userId}`,
      config
    );
    return response.data;
  }

  // 9. Delete favorite Post for profile - deleteFavoriteProfile()
  async deletePostFavoriteProfile(): Promise<any> {
    const config = await this.getAuthenticatedConfig();
    const userId = sessionStorage.getItem("userId");
    const response = await axios.delete(
      `${this.uri}/profile/favorite/${userId}`,
      config
    );
    return response.data;
  }

  // 10. Update favorite Post for profile - upDateFavoriteComment()
  async updatePostFavoriteProfile(): Promise<any> {
    const config = await this.getAuthenticatedConfig();
    const userId = sessionStorage.getItem("userId");
    const response = await axios.put(
      `${this.uri}/profile/favorite/${userId}`,
      config
    );
    return response.data;
  }
}
