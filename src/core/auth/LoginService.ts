import axios, { type AxiosRequestConfig } from "axios";
import type { ILoginDTO } from "./ILoginDTO";
import type { ITokenDTO } from "./ITokenDTO";

export default class LoginService {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_LOGIN;

  async post(loginDTO: ILoginDTO): Promise<ITokenDTO> {
    let config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(this.uri, loginDTO, config);
      const status = response.status;
      console.log(status);
      console.log(response.data);

      const { accessToken, refreshToken } = response.data;
      const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));

      return {
        userId: response.data.userId,
        role: tokenPayload.role,
        accessToken: accessToken,
        refreshToken: refreshToken,
        userName: response.data.username,
      };
    } catch (error) {
      throw new Error("Error with API calling: " + error);
    }
  }
}
