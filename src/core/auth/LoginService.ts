import axios, { AxiosRequestConfig } from "axios";
import { getAuthHeaders } from "./AuthHeaders";
import type { ILoginDTO } from "./ILoginDTO";
import type { ITokenDTO } from "./ITokenDTO";

export default class LoginService {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_LOGIN;

  async login(loginDTO: ILoginDTO): Promise<ITokenDTO> {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    };

    try {
      const response = await axios.post(this.uri, loginDTO, config);
      const { accessToken, refreshToken, userId, username, useremail } =
        response.data;
      const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));

      return {
        userId,
        role: tokenPayload.role,
        accessToken,
        refreshToken,
        userName: username,
        useremail,
        isLoggedIn: true,
      };
    } catch (error) {
      console.error(" LoginService: Error en login:", error);
      throw new Error("Error with API calling: " + error);
    }
  }
}
