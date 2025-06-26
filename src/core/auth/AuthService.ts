import axios from "axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  accessToken: string;
  refreshToken: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

export interface SocialLoginResponse {
  userId: number;
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    provider: "google" | "facebook";
  };
}

export class AuthService {
  private baseUrl = import.meta.env.VITE_API_ENDPOINT_LOGIN || "/api/v1/auth";

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await axios.post(this.baseUrl, {
      useremail: credentials.email,
      password: credentials.password,
    });
    const data = response.data;

    // Almacenar tokens en sessionStorage
    this.storeTokens(data);

    return data;
  }

  async loginWithGoogle(googleToken: string): Promise<SocialLoginResponse> {
    const response = await axios.post(`${this.baseUrl}/google`, {
      token: googleToken,
    });
    const data = response.data;

    // Almacenar tokens en sessionStorage
    this.storeTokens(data);

    return data;
  }

  async loginWithFacebook(facebookToken: string): Promise<SocialLoginResponse> {
    const response = await axios.post(`${this.baseUrl}/facebook`, {
      token: facebookToken,
    });
    const data = response.data;

    // Almacenar tokens en sessionStorage
    this.storeTokens(data);

    return data;
  }

  private storeTokens(data: LoginResponse | SocialLoginResponse) {
    sessionStorage.setItem("userId", String(data.userId));
    sessionStorage.setItem("accessToken", data.accessToken);
    sessionStorage.setItem("refreshToken", data.refreshToken);

    if (data.user) {
      sessionStorage.setItem("user", JSON.stringify(data.user));
    }
  }

  logout() {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("rulesAccepted");
    sessionStorage.removeItem("rulesAcceptedDate");
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem("accessToken");
  }

  getCurrentUser() {
    const userStr = sessionStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
}
