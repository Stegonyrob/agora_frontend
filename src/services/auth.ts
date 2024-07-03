import axios from "axios";
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
    const { accessToken, refreshToken, userId, role } = response.data;
    return { accessToken, refreshToken, userId, role };
  } catch (error) {
    throw new Error("Authentication failed");
  }
};

const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("authToken");
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
