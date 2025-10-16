import { beforeEach, describe, expect, it, vi } from "vitest";
import BannedService from "../../../core/banned/BannedService";
import ProfileService from "../../../core/profiles/ProfileService";
import IUser from "../../../core/user/IUser";
import IUserDTO from "../../../core/user/IUserDTO";
import { UserManagerService } from "../../../core/user/UserManagerService";
import UserService from "../../../core/user/UserService";

// Mock de los servicios dependientes
vi.mock("../../../core/user/UserService");
vi.mock("../../../core/profiles/ProfileService");
vi.mock("../../../core/banned/BannedService");

describe("UserManagerService", () => {
  let userManagerService: UserManagerService;
  let mockUserService: any;
  let mockProfileService: any;
  let mockBannedService: any;

  const mockUser: IUser = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    acceptedRules: true,
    firstName: "John",
    lastName1: "Doe",
    lastName2: "Smith",
    avatarId: 5,
    avatarUrl: "http://example.com/avatar.jpg",
    avatarDisplayName: "Test Avatar",
    roles: ["USER"],
    banReason: null,
    fullName: "John Doe Smith",
    banned: false,
    admin: false,
  };

  const mockBannedUser: IUser = {
    ...mockUser,
    id: 2,
    username: "banneduser",
    email: "banned@example.com",
    banned: true,
    banReason: "Violation of community guidelines",
    fullName: "Banned User",
  };

  const mockUserDTO: IUserDTO = {
    firstName: "John Updated",
    lastName1: "Doe Updated",
    email: "updated@example.com",
    avatarId: 7,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup de mocks
    mockUserService = {
      getAllUsers: vi.fn(),
      deleteUser: vi.fn(),
    };

    mockProfileService = {
      updateProfileAsAdmin: vi.fn(),
    };

    mockBannedService = {
      banUser: vi.fn(),
      unbanUser: vi.fn(),
    };

    // Configurar los mocks para que los constructores retornen nuestros mocks
    vi.mocked(UserService).mockImplementation(() => mockUserService);
    vi.mocked(ProfileService).mockImplementation(() => mockProfileService);
    vi.mocked(BannedService).mockImplementation(() => mockBannedService);

    userManagerService = new UserManagerService();
  });

  describe("loadUsers", () => {
    it("debería cargar todos los usuarios correctamente", async () => {
      // Arrange
      const mockUsers = [mockUser, mockBannedUser];
      mockUserService.getAllUsers.mockResolvedValue(mockUsers);

      // Act
      const result = await userManagerService.loadUsers();

      // Assert
      expect(mockUserService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it("debería manejar error al cargar usuarios", async () => {
      // Arrange
      mockUserService.getAllUsers.mockRejectedValue(
        new Error("Failed to load users")
      );

      // Act & Assert
      await expect(userManagerService.loadUsers()).rejects.toThrow(
        "Failed to load users"
      );
    });

    it("debería retornar array vacío cuando no hay usuarios", async () => {
      // Arrange
      mockUserService.getAllUsers.mockResolvedValue([]);

      // Act
      const result = await userManagerService.loadUsers();

      // Assert
      expect(result).toEqual([]);
    });

    it("debería incluir información de ban en los usuarios", async () => {
      // Arrange
      const mockUsers = [mockUser, mockBannedUser];
      mockUserService.getAllUsers.mockResolvedValue(mockUsers);

      // Act
      const result = await userManagerService.loadUsers();

      // Assert
      const normalUser = result.find((u) => u.id === 1);
      const bannedUser = result.find((u) => u.id === 2);

      expect(normalUser?.banned).toBe(false);
      expect(normalUser?.banReason).toBeNull();
      expect(bannedUser?.banned).toBe(true);
      expect(bannedUser?.banReason).toBe("Violation of community guidelines");
    });
  });

  describe("updateUser", () => {
    it("debería actualizar usuario correctamente", async () => {
      // Arrange
      mockProfileService.updateProfileAsAdmin.mockResolvedValue(undefined);

      // Act
      await userManagerService.updateUser(1, mockUserDTO);

      // Assert
      expect(mockProfileService.updateProfileAsAdmin).toHaveBeenCalledWith(1, {
        firstName: "John Updated",
        lastName1: "Doe Updated",
        lastName2: "",
        avatarId: 7,
        email: "updated@example.com",
      });
    });

    it("debería manejar campos vacíos con valores por defecto", async () => {
      // Arrange
      const incompleteDTO: IUserDTO = {
        email: "new@example.com",
      };
      mockProfileService.updateProfileAsAdmin.mockResolvedValue(undefined);

      // Act
      await userManagerService.updateUser(1, incompleteDTO);

      // Assert
      expect(mockProfileService.updateProfileAsAdmin).toHaveBeenCalledWith(1, {
        firstName: "",
        lastName1: "",
        lastName2: "",
        avatarId: undefined,
        email: "new@example.com",
      });
    });

    it("debería manejar usuario sin avatar", async () => {
      // Arrange
      const dtoWithoutAvatar: IUserDTO = {
        firstName: "No Avatar",
        email: "noavatar@example.com",
        avatarId: null,
      };
      mockProfileService.updateProfileAsAdmin.mockResolvedValue(undefined);

      // Act
      await userManagerService.updateUser(1, dtoWithoutAvatar);

      // Assert
      expect(mockProfileService.updateProfileAsAdmin).toHaveBeenCalledWith(1, {
        firstName: "No Avatar",
        lastName1: "",
        lastName2: "",
        avatarId: undefined,
        email: "noavatar@example.com",
      });
    });

    it("debería manejar error en actualización de perfil", async () => {
      // Arrange
      mockProfileService.updateProfileAsAdmin.mockRejectedValue(
        new Error("Profile update failed")
      );

      // Act & Assert
      await expect(
        userManagerService.updateUser(1, mockUserDTO)
      ).rejects.toThrow("Profile update failed");
    });

    it("debería manejar usuario no encontrado", async () => {
      // Arrange
      mockProfileService.updateProfileAsAdmin.mockRejectedValue(
        new Error("User not found")
      );

      // Act & Assert
      await expect(
        userManagerService.updateUser(999, mockUserDTO)
      ).rejects.toThrow("User not found");
    });
  });

  describe("deleteUser", () => {
    it("debería eliminar usuario correctamente", async () => {
      // Arrange
      mockUserService.deleteUser.mockResolvedValue(undefined);

      // Act
      await userManagerService.deleteUser(1);

      // Assert
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
    });

    it("debería manejar error al eliminar usuario no existente", async () => {
      // Arrange
      mockUserService.deleteUser.mockRejectedValue(new Error("User not found"));

      // Act & Assert
      await expect(userManagerService.deleteUser(999)).rejects.toThrow(
        "User not found"
      );
    });

    it("debería manejar error de permisos al eliminar", async () => {
      // Arrange
      mockUserService.deleteUser.mockRejectedValue(
        new Error("Insufficient permissions")
      );

      // Act & Assert
      await expect(userManagerService.deleteUser(1)).rejects.toThrow(
        "Insufficient permissions"
      );
    });

    it("debería manejar eliminación con dependencias", async () => {
      // Arrange
      mockUserService.deleteUser.mockRejectedValue(
        new Error("Cannot delete user with existing content")
      );

      // Act & Assert
      await expect(userManagerService.deleteUser(1)).rejects.toThrow(
        "Cannot delete user with existing content"
      );
    });
  });

  describe("banUser", () => {
    it("debería banear usuario correctamente", async () => {
      // Arrange
      const banReason = "Inappropriate behavior";
      mockBannedService.banUser.mockResolvedValue(undefined);

      // Act
      await userManagerService.banUser(1, banReason);

      // Assert
      expect(mockBannedService.banUser).toHaveBeenCalledWith(1, banReason);
    });

    it("debería validar razón de ban requerida", async () => {
      // Arrange
      mockBannedService.banUser.mockRejectedValue(
        new Error("Ban reason is required")
      );

      // Act & Assert
      await expect(userManagerService.banUser(1, "")).rejects.toThrow(
        "Ban reason is required"
      );
    });

    it("debería manejar usuario ya baneado", async () => {
      // Arrange
      mockBannedService.banUser.mockRejectedValue(
        new Error("User is already banned")
      );

      // Act & Assert
      await expect(userManagerService.banUser(1, "Reason")).rejects.toThrow(
        "User is already banned"
      );
    });

    it("debería manejar error al banear usuario no existente", async () => {
      // Arrange
      mockBannedService.banUser.mockRejectedValue(new Error("User not found"));

      // Act & Assert
      await expect(userManagerService.banUser(999, "Reason")).rejects.toThrow(
        "User not found"
      );
    });

    it("debería manejar razones de ban largas", async () => {
      // Arrange
      const longReason = "A".repeat(500); // Razón muy larga
      mockBannedService.banUser.mockResolvedValue(undefined);

      // Act
      await userManagerService.banUser(1, longReason);

      // Assert
      expect(mockBannedService.banUser).toHaveBeenCalledWith(1, longReason);
    });
  });

  describe("unbanUser", () => {
    it("debería desbanear usuario correctamente", async () => {
      // Arrange
      mockBannedService.unbanUser.mockResolvedValue(undefined);

      // Act
      await userManagerService.unbanUser(1);

      // Assert
      expect(mockBannedService.unbanUser).toHaveBeenCalledWith(1);
    });

    it("debería manejar usuario no baneado", async () => {
      // Arrange
      mockBannedService.unbanUser.mockRejectedValue(
        new Error("User is not banned")
      );

      // Act & Assert
      await expect(userManagerService.unbanUser(1)).rejects.toThrow(
        "User is not banned"
      );
    });

    it("debería manejar error al desbanear usuario no existente", async () => {
      // Arrange
      mockBannedService.unbanUser.mockRejectedValue(
        new Error("User not found")
      );

      // Act & Assert
      await expect(userManagerService.unbanUser(999)).rejects.toThrow(
        "User not found"
      );
    });

    it("debería manejar error de permisos en desbaneo", async () => {
      // Arrange
      mockBannedService.unbanUser.mockRejectedValue(
        new Error("Insufficient permissions to unban")
      );

      // Act & Assert
      await expect(userManagerService.unbanUser(1)).rejects.toThrow(
        "Insufficient permissions to unban"
      );
    });
  });

  describe("integración y edge cases", () => {
    it("debería manejar múltiples operaciones en secuencia", async () => {
      // Arrange
      mockUserService.getAllUsers.mockResolvedValue([mockUser]);
      mockProfileService.updateProfileAsAdmin.mockResolvedValue(undefined);
      mockBannedService.banUser.mockResolvedValue(undefined);

      // Act
      const users = await userManagerService.loadUsers();
      await userManagerService.updateUser(1, mockUserDTO);
      await userManagerService.banUser(1, "Test ban");

      // Assert
      expect(users).toEqual([mockUser]);
      expect(mockProfileService.updateProfileAsAdmin).toHaveBeenCalled();
      expect(mockBannedService.banUser).toHaveBeenCalled();
    });

    it("debería manejar usuarios con roles múltiples", async () => {
      // Arrange
      const adminUser: IUser = {
        ...mockUser,
        roles: ["USER", "ADMIN", "MODERATOR"],
        admin: true,
      };
      mockUserService.getAllUsers.mockResolvedValue([adminUser]);

      // Act
      const result = await userManagerService.loadUsers();

      // Assert
      expect(result[0].roles).toHaveLength(3);
      expect(result[0].admin).toBe(true);
    });

    it("debería manejar usuarios sin apellido2", async () => {
      // Arrange
      const userWithoutLastName2: IUser = {
        ...mockUser,
        lastName2: null,
        fullName: "John Doe",
      };
      mockUserService.getAllUsers.mockResolvedValue([userWithoutLastName2]);

      // Act
      const result = await userManagerService.loadUsers();

      // Assert
      expect(result[0].lastName2).toBeNull();
      expect(result[0].fullName).toBe("John Doe");
    });

    it("debería manejar operaciones concurrentes", async () => {
      // Arrange
      mockBannedService.banUser.mockResolvedValue(undefined);
      mockBannedService.unbanUser.mockResolvedValue(undefined);

      // Act
      const promises = [
        userManagerService.banUser(1, "Reason 1"),
        userManagerService.banUser(2, "Reason 2"),
        userManagerService.unbanUser(3),
      ];

      await Promise.all(promises);

      // Assert
      expect(mockBannedService.banUser).toHaveBeenCalledTimes(2);
      expect(mockBannedService.unbanUser).toHaveBeenCalledTimes(1);
    });

    it("debería manejar errores de red", async () => {
      // Arrange
      mockUserService.getAllUsers.mockRejectedValue(
        new Error("Network timeout")
      );

      // Act & Assert
      await expect(userManagerService.loadUsers()).rejects.toThrow(
        "Network timeout"
      );
    });

    it("debería validar IDs de usuario inválidos", async () => {
      // Arrange
      mockUserService.deleteUser.mockRejectedValue(
        new Error("Invalid user ID")
      );

      // Act & Assert
      await expect(userManagerService.deleteUser(-1)).rejects.toThrow(
        "Invalid user ID"
      );
    });
  });
});
