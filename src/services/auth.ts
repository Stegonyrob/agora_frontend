import axios from "axios";
import { setAuthentication } from "../redux/authSlice";

const uri = import.meta.env.VITE_API_ENDPOINT_LOGIN;
const uri2 = import.meta.env.VITE_API_ENDPOINT_LOGOUT;
interface AuthResponse {
  [x: string]: any;
  accessToken: string;
  refreshToken: string;
  userId: number;
  role: string;
}

const login = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${uri}`, {
      username,
      password,
    });
    const { accessToken, refreshToken, userId } = response.data;
    console.log(accessToken, refreshToken, userId);
    const { user, role } = response.data;
    setAuthentication({ isAuthenticated: true, user, role });
    // Acceder al rol del usuario desde el token
    const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
    const userRole = tokenPayload.role;

    console.log(`El usuario tiene el rol de ${userRole}`);

    return { accessToken, refreshToken, userId, role: userRole };
  } catch (error) {
    throw new Error("Authentication failed");
  }
};

const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("authToken");
    console.log(token);
    if (token) {
      await axios.post(
        `${uri2}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("authToken");
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

export { login, logout };
