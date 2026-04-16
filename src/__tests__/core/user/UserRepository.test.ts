import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAuthHeaders } from "../../../core/auth/AuthHeaders";
import IUser from "../../../core/user/IUser";
import IUserDTO from "../../../core/user/IUserDTO";
import { UserRepository } from "../../../core/user/UserRepository";

vi.mock("axios");
vi.mock("../../../core/auth/AuthHeaders");

describe("UserRepository", () => {
  let repository: UserRepository;
  const mockAuthHeaders = { Authorization: "Bearer test-token" };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubEnv("VITE_API_ENDPOINT_USERS", "http://api.test/any/users");
    (getAuthHeaders as any).mockReturnValue(mockAuthHeaders);
    repository = new UserRepository();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("getAll", () => {
    it("should fetch all users successfully", async () => {
      const mockUsers: IUser[] = [
        {
          id: 1,
          username: "user1",
          email: "user1@test.com",
          roles: ["USER"],
          acceptedRules: true,
          firstName: null,
          lastName1: null,
          lastName2: null,
          avatarId: null,
          avatarUrl: null,
          avatarDisplayName: null,
          banReason: null,
          fullName: "user1",
          banned: false,
          admin: false,
        },
        {
          id: 2,
          username: "user2",
          email: "user2@test.com",
          roles: ["ADMIN"],
          acceptedRules: true,
          firstName: null,
          lastName1: null,
          lastName2: null,
          avatarId: null,
          avatarUrl: null,
          avatarDisplayName: null,
          banReason: null,
          fullName: "user2",
          banned: false,
          admin: true,
        },
      ];

      (axios.get as any).mockResolvedValue({ data: mockUsers });

      const result = await repository.getAll();

      expect(axios.get).toHaveBeenCalledWith("http://api.test/any/users", {
        headers: mockAuthHeaders,
      });
      expect(result).toEqual(mockUsers);
    });

    it("should handle axios error in getAll", async () => {
      const mockError = new Error("Network error");
      (axios.get as any).mockRejectedValue(mockError);

      await expect(repository.getAll()).rejects.toThrow("Network error");
      expect(axios.get).toHaveBeenCalledWith("http://api.test/any/users", {
        headers: mockAuthHeaders,
      });
    });

    it("should log when data is array", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const mockUsers = [{ id: 1, username: "test" }];
      (axios.get as any).mockResolvedValue({ data: mockUsers });

      await repository.getAll();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("UserRepository.getAll"),
        "object",
        true
      );
      consoleSpy.mockRestore();
    });
  });

  describe("getById", () => {
    it("should fetch user by id successfully", async () => {
      const mockUser: IUser = {
        id: 1,
        username: "testuser",
        email: "test@test.com",
        roles: ["USER"],
        acceptedRules: true,
        firstName: null,
        lastName1: null,
        lastName2: null,
        avatarId: null,
        avatarUrl: null,
        avatarDisplayName: null,
        banReason: null,
        fullName: "testuser",
        banned: false,
        admin: false,
      };

      (axios.get as any).mockResolvedValue({ data: mockUser });

      const result = await repository.getById(1);

      expect(axios.get).toHaveBeenCalledWith("http://api.test/any/users/1", {
        headers: mockAuthHeaders,
      });
      expect(result).toEqual(mockUser);
    });

    it("should handle error when user not found", async () => {
      (axios.get as any).mockRejectedValue(new Error("User not found"));

      await expect(repository.getById(999)).rejects.toThrow("User not found");
    });
  });

  describe("create", () => {
    it("should create user successfully", async () => {
      const newUser: IUserDTO = {
        username: "newuser",
        email: "new@test.com",
        roles: ["USER"],
      };

      const createdUser: IUser = {
        id: 3,
        username: "newuser",
        email: "new@test.com",
        roles: ["USER"],
        acceptedRules: false,
        firstName: null,
        lastName1: null,
        lastName2: null,
        avatarId: null,
        avatarUrl: null,
        avatarDisplayName: null,
        banReason: null,
        fullName: "newuser",
        banned: false,
        admin: false,
      };

      (axios.post as any).mockResolvedValue({ data: createdUser });

      const result = await repository.create(newUser);

      expect(axios.post).toHaveBeenCalledWith(
        "http://api.test/admin/users",
        newUser,
        { headers: mockAuthHeaders }
      );
      expect(result).toEqual(createdUser);
    });

    it("should handle validation error in create", async () => {
      const newUser: IUserDTO = {
        username: "",
        email: "invalid",
      };

      const mockError = {
        isAxiosError: true,
        response: {
          data: { message: "Validation error" },
          status: 400,
        },
      };

      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);
      (axios.post as any).mockRejectedValue(mockError);

      await expect(repository.create(newUser)).rejects.toEqual(mockError);
    });

    it("should log error details when create fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const mockError = {
        isAxiosError: true,
        response: {
          data: { error: "Email already exists" },
          status: 409,
        },
      };

      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);
      (axios.post as any).mockRejectedValue(mockError);

      await expect(
        repository.create({ username: "test" } as IUserDTO)
      ).rejects.toEqual(mockError);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("UserRepository.create - Error en POST"),
        mockError
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("update", () => {
    it("should update user successfully", async () => {
      const updateData: IUserDTO = {
        username: "updateduser",
        email: "updated@test.com",
        roles: ["ADMIN"],
      };

      const updatedUser: IUser = {
        id: 1,
        username: "updateduser",
        email: "updated@test.com",
        roles: ["ADMIN"],
        acceptedRules: true,
        firstName: null,
        lastName1: null,
        lastName2: null,
        avatarId: null,
        avatarUrl: null,
        avatarDisplayName: null,
        banReason: null,
        fullName: "updateduser",
        banned: false,
        admin: true,
      };

      (axios.put as any).mockResolvedValue({ data: updatedUser });

      const result = await repository.update(1, updateData);

      expect(axios.put).toHaveBeenCalledWith(
        "http://api.test/admin/users/1",
        updateData,
        { headers: mockAuthHeaders }
      );
      expect(result).toEqual(updatedUser);
    });

    it("should handle 404 error in update", async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          data: { message: "User not found" },
          status: 404,
        },
      };

      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);
      (axios.put as any).mockRejectedValue(mockError);

      await expect(repository.update(999, {} as IUserDTO)).rejects.toEqual(
        mockError
      );
    });

    it("should log error details when update fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const mockError = {
        isAxiosError: true,
        response: {
          data: { error: "Unauthorized" },
          status: 401,
        },
      };

      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);
      (axios.put as any).mockRejectedValue(mockError);

      await expect(repository.update(1, {} as IUserDTO)).rejects.toEqual(
        mockError
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("UserRepository.update - Status"),
        401
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("delete", () => {
    it("should delete user successfully", async () => {
      (axios.delete as any).mockResolvedValue({});

      await repository.delete(1);

      expect(axios.delete).toHaveBeenCalledWith(
        "http://api.test/admin/users/1",
        { headers: mockAuthHeaders }
      );
    });

    it("should handle 404 error in delete", async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          data: { message: "User not found" },
          status: 404,
        },
      };

      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);
      (axios.delete as any).mockRejectedValue(mockError);

      await expect(repository.delete(999)).rejects.toEqual(mockError);
    });

    it("should log headers and error details on delete failure", async () => {
      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const mockError = {
        isAxiosError: true,
        response: {
          data: { error: "Forbidden" },
          status: 403,
          headers: { "content-type": "application/json" },
        },
      };

      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);
      (axios.delete as any).mockRejectedValue(mockError);

      await expect(repository.delete(1)).rejects.toEqual(mockError);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("UserRepository.delete - Headers enviados"),
        mockAuthHeaders
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("UserRepository.delete - Headers de respuesta"),
        mockError.response.headers
      );

      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("getByUsername", () => {
    it("should fetch user by username successfully", async () => {
      const mockUser: IUser = {
        id: 1,
        username: "testuser",
        email: "test@test.com",
        roles: ["USER"],
        acceptedRules: true,
        firstName: null,
        lastName1: null,
        lastName2: null,
        avatarId: null,
        avatarUrl: null,
        avatarDisplayName: null,
        banReason: null,
        fullName: "testuser",
        banned: false,
        admin: false,
      };

      (axios.get as any).mockResolvedValue({ data: mockUser });

      const result = await repository.getByUsername("testuser");

      expect(axios.get).toHaveBeenCalledWith(
        "http://api.test/any/users/username/testuser",
        { headers: mockAuthHeaders }
      );
      expect(result).toEqual(mockUser);
    });

    it("should return null when user not found (404)", async () => {
      const mockError = {
        isAxiosError: true,
        response: { status: 404 },
      };

      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);
      (axios.get as any).mockRejectedValue(mockError);

      const result = await repository.getByUsername("nonexistent");

      expect(result).toBeNull();
    });

    it("should throw error for non-404 errors", async () => {
      const mockError = {
        isAxiosError: true,
        response: { status: 500 },
      };

      vi.spyOn(axios, "isAxiosError").mockReturnValue(true);
      (axios.get as any).mockRejectedValue(mockError);

      await expect(repository.getByUsername("test")).rejects.toEqual(mockError);
    });

    it("should throw error for network errors", async () => {
      const networkError = new Error("Network error");

      (axios.get as any).mockRejectedValue(networkError);

      await expect(repository.getByUsername("test")).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("URI configuration", () => {
    it("should correctly set uri from environment variable", () => {
      expect(repository.uri).toBe("http://api.test/any/users");
    });

    it("should correctly set adminUri by replacing /any/ with /admin/", () => {
      expect(repository.adminUri).toBe("http://api.test/admin/users");
    });
  });
});
