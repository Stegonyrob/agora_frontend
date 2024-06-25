// auth.ts
import axios from "axios";

interface AuthResponse {
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
    const response = await axios.post("http://localhost:8080/api/v1/login", {
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
        "http://localhost:8080/api/v1/logout",
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
