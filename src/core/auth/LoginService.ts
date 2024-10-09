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

      const { accessToken, refreshToken, userId } = response.data;
      const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
      const userRole = tokenPayload.role;
      console.log(userRole);
      return { accessToken, refreshToken, userId, role: userRole };
    } catch (error) {
      //revisar por wque lelga undefine cuandos e extrae del token
      throw new Error("Error with API calling: " + error);
    }
  }
}
