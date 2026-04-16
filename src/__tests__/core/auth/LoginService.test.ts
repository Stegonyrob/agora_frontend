import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as AuthHeaders from "../../../core/auth/AuthHeaders";
import { ILoginDTO } from "../../../core/auth/ILoginDTO";
import LoginService from "../../../core/auth/LoginService";

vi.mock("axios");
vi.mock("../../../core/auth/AuthHeaders");

describe("LoginService", () => {
  let loginService: LoginService;
  const mockUri = "http://localhost:8080/api/v1/login";
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  const mockLoginDTO: ILoginDTO = {
    username: "testuser",
    password: "password123",
    rememberMe: true,
  };

  const mockTokenResponse = {
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiVVNFUiIsInVzZXJJZCI6MTIzfQ.signature",
    refreshToken: "refresh-token-123",
    userId: 123,
    username: "testuser",
    useremail: "test@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_API_ENDPOINT_LOGIN", mockUri);
    vi.spyOn(AuthHeaders, "getAuthHeaders").mockReturnValue({
      Authorization: "Bearer token",
    });
    loginService = new LoginService();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
    consoleErrorSpy.mockClear();
  });

  describe("login", () => {
    it("should login successfully and return token data", async () => {
      vi.mocked(axios.post).mockResolvedValue({ data: mockTokenResponse });

      const result = await loginService.login(mockLoginDTO);

      expect(result).toEqual({
        userId: 123,
        role: "USER",
        accessToken: mockTokenResponse.accessToken,
        refreshToken: mockTokenResponse.refreshToken,
        userName: "testuser",
        useremail: "test@example.com",
        isLoggedIn: true,
      });

      expect(axios.post).toHaveBeenCalledWith(mockUri, mockLoginDTO, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
      });
    });

    it("should decode JWT token and extract role", async () => {
      const adminTokenResponse = {
        ...mockTokenResponse,
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4iLCJ1c2VySWQiOjF9.signature",
      };
      vi.mocked(axios.post).mockResolvedValue({ data: adminTokenResponse });

      const result = await loginService.login(mockLoginDTO);

      expect(result.role).toBe("ADMIN");
    });

    it("should handle login with rememberMe option", async () => {
      const loginWithRememberMe: ILoginDTO = {
        ...mockLoginDTO,
        rememberMe: true,
      };
      vi.mocked(axios.post).mockResolvedValue({ data: mockTokenResponse });

      await loginService.login(loginWithRememberMe);

      expect(axios.post).toHaveBeenCalledWith(
        mockUri,
        expect.objectContaining({ rememberMe: true }),
        expect.any(Object)
      );
    });

    it("should throw error when credentials are invalid", async () => {
      const error = { response: { status: 401, data: "Unauthorized" } };
      vi.mocked(axios.post).mockRejectedValue(error);

      await expect(loginService.login(mockLoginDTO)).rejects.toThrow(
        "Error with API calling:"
      );
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("should throw error when network fails", async () => {
      const error = new Error("Network error");
      vi.mocked(axios.post).mockRejectedValue(error);

      await expect(loginService.login(mockLoginDTO)).rejects.toThrow(
        "Error with API calling:"
      );
    });

    it("should handle missing useremail in response", async () => {
      const responseWithoutEmail = {
        ...mockTokenResponse,
        useremail: undefined,
      };
      vi.mocked(axios.post).mockResolvedValue({ data: responseWithoutEmail });

      const result = await loginService.login(mockLoginDTO);

      expect(result.useremail).toBeUndefined();
    });

    it("should include Content-Type header in request", async () => {
      vi.mocked(axios.post).mockResolvedValue({ data: mockTokenResponse });

      await loginService.login(mockLoginDTO);

      expect(axios.post).toHaveBeenCalledWith(
        mockUri,
        mockLoginDTO,
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });
  });
});
