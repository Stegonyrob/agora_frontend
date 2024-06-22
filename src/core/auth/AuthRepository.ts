import axios from "axios";
interface AuthResponse {
  data: {
    token: string;
    userId: string;
    role: string;
  };
}
const BASE_URL = "http://localhost:8080/api/v1/login";

const authenticateUser = async (
  username: string,
  password: string
): Promise<string | null> => {
  const credentials = `${username}:${password}`;
  const encodedCredentials = btoa(credentials);

  try {
    const { data } = await axios.post(
      BASE_URL,
      {},
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
        responseType: "json",
      }
    );

    return data?.token ?? null;
  } catch {
    return null;
  }
};

export { authenticateUser };
