import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import IRegisterDTO from "../../../core/register/IRegisterDTO";
import { RegisterService } from "../../../core/register/RegisterService";

vi.mock("axios");

describe("RegisterService", () => {
  let service: RegisterService;
  const mockApiUrl = "http://api.test/register";

  beforeEach(() => {
    vi.stubEnv("VITE_API_ENDPOINT_REGISTER", mockApiUrl);
    service = new RegisterService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("register", () => {
    it("should register user successfully with valid data", async () => {
      const mockRegisterData: IRegisterDTO = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        rulesAccepted: true,
      };

      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      };

      (axios.post as any).mockResolvedValueOnce({
        status: 201,
        statusText: "Created",
        headers: {},
        data: mockUser,
      });

      const result = await service.register(mockRegisterData);

      expect(result).toEqual(mockUser);
      expect(axios.post).toHaveBeenCalledWith(mockApiUrl, mockRegisterData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    it("should throw error when rulesAccepted is false", async () => {
      const mockRegisterData: IRegisterDTO = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        rulesAccepted: false,
      };

      await expect(service.register(mockRegisterData)).rejects.toThrow(
        "Debes aceptar las reglas de la comunidad para poder registrarte."
      );

      expect(axios.post).not.toHaveBeenCalled();
    });

    it("should throw error when rulesAccepted is undefined", async () => {
      const mockRegisterData: any = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      await expect(service.register(mockRegisterData)).rejects.toThrow(
        "Debes aceptar las reglas de la comunidad para poder registrarte."
      );

      expect(axios.post).not.toHaveBeenCalled();
    });

    it("should handle axios error response", async () => {
      const mockRegisterData: IRegisterDTO = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        rulesAccepted: true,
      };

      const mockError = {
        response: {
          status: 400,
          statusText: "Bad Request",
          data: { message: "Email already exists" },
          headers: {},
        },
        config: {},
        isAxiosError: true,
      };

      (axios.post as any).mockRejectedValueOnce(mockError);
      (axios.isAxiosError as any).mockReturnValueOnce(true);

      await expect(service.register(mockRegisterData)).rejects.toEqual(
        mockError
      );
    });

    it("should handle network errors", async () => {
      const mockRegisterData: IRegisterDTO = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        rulesAccepted: true,
      };

      const networkError = new Error("Network error");
      (axios.post as any).mockRejectedValueOnce(networkError);

      await expect(service.register(mockRegisterData)).rejects.toThrow(
        "Network error"
      );
    });

    it("should send correct headers", async () => {
      const mockRegisterData: IRegisterDTO = {
        username: "newuser",
        email: "newuser@example.com",
        password: "securepass123",
        rulesAccepted: true,
      };

      (axios.post as any).mockResolvedValueOnce({
        status: 201,
        data: { id: 2, username: "newuser" },
      });

      await service.register(mockRegisterData);

      const callArgs = (axios.post as any).mock.calls[0];
      expect(callArgs[2].headers["Content-Type"]).toBe("application/json");
    });

    it("should return user data from response", async () => {
      const mockRegisterData: IRegisterDTO = {
        username: "anotheruser",
        email: "another@example.com",
        password: "pass123",
        rulesAccepted: true,
      };

      const expectedUser = {
        id: 3,
        username: "anotheruser",
        email: "another@example.com",
        role: "USER",
      };

      (axios.post as any).mockResolvedValueOnce({
        status: 201,
        data: expectedUser,
      });

      const result = await service.register(mockRegisterData);

      expect(result).toEqual(expectedUser);
      expect(result.username).toBe("anotheruser");
      expect(result.email).toBe("another@example.com");
    });
  });
});
