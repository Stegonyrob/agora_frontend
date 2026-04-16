import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AuthService,
  LoginCredentials,
  LoginResponse,
} from "../../core/auth/AuthService";

// Mock de axios
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock de sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
});

describe("AuthService", () => {
  let authService: AuthService;

  const mockCredentials: LoginCredentials = {
    email: "test@example.com",
    password: "testPassword123",
  };

  const mockLoginResponse: LoginResponse = {
    userId: 1,
    accessToken: "mock_access_token_12345",
    refreshToken: "mock_refresh_token_67890",
    user: {
      id: 1,
      username: "testuser",
      email: "test@example.com",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService();
  });

  describe("login", () => {
    it("debería autenticar usuario correctamente", async () => {
      // Arrange
      const mockResponse = { data: mockLoginResponse };
      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      // Act
      const result = await authService.login(mockCredentials);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        useremail: mockCredentials.email,
        password: mockCredentials.password,
      });
      expect(result).toEqual(mockLoginResponse);
    });

    it("debería manejar credenciales inválidas", async () => {
      // Arrange
      vi.mocked(axios.post).mockRejectedValue(new Error("Invalid credentials"));

      // Act & Assert
      await expect(authService.login(mockCredentials)).rejects.toThrow(
        "Invalid credentials"
      );
    });
  });

  describe("logout", () => {
    it("debería limpiar sessionStorage correctamente", () => {
      // Act
      authService.logout();

      // Assert
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("userId");
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("accessToken");
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(
        "refreshToken"
      );
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("user");
    });
  });

  describe("isAuthenticated", () => {
    it("debería retornar true cuando hay accessToken", () => {
      // Arrange
      mockSessionStorage.getItem.mockReturnValue("valid_token");

      // Act
      const result = authService.isAuthenticated();

      // Assert
      expect(result).toBe(true);
    });

    it("debería retornar false cuando no hay accessToken", () => {
      // Arrange
      mockSessionStorage.getItem.mockReturnValue(null);

      // Act
      const result = authService.isAuthenticated();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("getCurrentUser", () => {
    it("debería retornar usuario cuando existe", () => {
      // Arrange
      const userData = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      };
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(userData));

      // Act
      const result = authService.getCurrentUser();

      // Assert
      expect(result).toEqual(userData);
    });

    it("debería retornar null cuando no hay usuario", () => {
      // Arrange
      mockSessionStorage.getItem.mockReturnValue(null);

      // Act
      const result = authService.getCurrentUser();

      // Assert
      expect(result).toBeNull();
    });
  });
});
