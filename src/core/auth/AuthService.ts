// authService.ts
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/login";

const authenticateUser = async (
  username: string,
  password: string
): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${BASE_URL}`,
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          // Note: Basic auth requires encoding the username and password in the format "username:password"
          // 'Authorization': 'Basic ' + btoa(username + ':' + password),
        },
      }
    );
    const token = response.data.token;
    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { authenticateUser };
