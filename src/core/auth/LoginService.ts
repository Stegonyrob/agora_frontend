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
      return { accessToken, refreshToken, userId, roles: userRole };
    } catch (error) {
      throw new Error("Error with API calling: " + error);
    }
  }
}

// import axios from "axios";
// import { setCredentials } from "../redux/authSlice";
// import store from "../redux/store";

// const uri = import.meta.env.VITE_API_ENDPOINT_LOGIN;
// const uri2 = import.meta.env.VITE_API_ENDPOINT_LOGOUT;

// interface AuthResponse {
//   [x: string]: any;
//   accessToken: string;
//   refreshToken: string;
//   userId: number;
//   role: string;
// }

// const login = async (
//   username: string,
//   password: string
// ): Promise<AuthResponse> => {
//   try {
//     const response = await axios.post(`${uri}`, {
//       username,
//       password,
//     });

//     const { accessToken, refreshToken, userId } = response.data;

//     const { user, role } = response.data;
//     store.dispatch(
//       setCredentials({
//         isAuthenticated: true,
//         user,
//         role,
//         accessToken: "",
//         userId: undefined,
//         refreshToken: "",
//         error: undefined,
//         success: false,
//         isLoggedIn: true,
//         loading: false,
//       })
//     );

//     const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));

//     const userRole = tokenPayload.role;
//     const token = localStorage.getItem("authToken");

//     return { accessToken, refreshToken, userId, role: userRole };
//   } catch (error) {
//     throw new Error("Authentication failed");
//   }
// };
// const logout = async (): Promise<void> => {
//   try {
//     const token = localStorage.getItem("authToken");
//     console.log("Logout token:", token);
//     if (token) {
//       const response = await axios.post(
//         `${uri2}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         // Token was successfully invalidated, remove it from local storage
//         localStorage.removeItem("authToken");
//       } else {
//       }
//     } else {
//     }
//   } catch (error) {}
// };

// export { login, logout };
