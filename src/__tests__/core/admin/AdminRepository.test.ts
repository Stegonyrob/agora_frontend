import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminRepository } from "../../../core/admin/AdminRepository";
import { IAdmin } from "../../../core/admin/IAdmin";
import { IAdminDTO } from "../../../core/admin/IAdminDTO";
import * as authHeaders from "../../../core/auth/AuthHeaders";
import * as normalizeApiResponse from "../../../core/normalization/normalizeApiResponse";

// Mock de axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock de dependencias
vi.mock("../../../core/auth/AuthHeaders", () => ({
  getAuthHeaders: vi.fn(),
}));

vi.mock("../../../core/normalization/normalizeApiResponse", () => ({
  normalizeArray: vi.fn(),
  normalizeItem: vi.fn(),
}));

describe("AdminRepository", () => {
  let adminRepository: AdminRepository;

  const mockAdmin: IAdmin = {
    id: 1,
    userId: 101,
    username: "admin1",
    email: "admin@example.com",
    phone: "+34666777888",
    roles: ["ADMIN", "USER"],
    admin: true,
    active: true,
    displayName: "Admin User",
    firstName: "Admin",
    lastName1: "User",
    lastName2: "Smith",
    relationship: "single",
    city: "Madrid",
    country: "Spain",
    avatarId: 5,
    avatarUrl: "http://example.com/avatar.jpg",
    avatarDisplayName: "Admin Avatar",
    fullName: "Admin User Smith",
    fullNameWithUsername: "Admin User Smith (admin1)",
    acceptedRules: true,
    banReason: null,
    banned: false,
  };

  const mockAdminDTO: IAdminDTO = {
    username: "newadmin",
    email: "newadmin@example.com",
    password: "securePassword123",
    confirmPassword: "securePassword123",
    phone: "+34777888999",
    firstName: "New",
    lastName1: "Admin",
    lastName2: "User",
    city: "Barcelona",
    country: "Spain",
    relationship: "married",
    avatarId: 7,
  };

  const mockHeaders = { Authorization: "Bearer admin_token" };

  beforeEach(() => {
    vi.clearAllMocks();
    adminRepository = new AdminRepository();

    // Setup de mocks por defecto
    vi.mocked(authHeaders.getAuthHeaders).mockReturnValue(mockHeaders);
    vi.mocked(normalizeApiResponse.normalizeArray).mockImplementation(
      (data) => data || []
    );
    vi.mocked(normalizeApiResponse.normalizeItem).mockImplementation(
      (data) => data
    );
  });

  describe("getAll", () => {
    it("debería obtener todos los administradores correctamente", async () => {
      // Arrange
      const mockResponse = { data: [mockAdmin] };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await adminRepository.getAll();

      // Assert
      expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
        headers: mockHeaders,
      });
      expect(normalizeApiResponse.normalizeArray).toHaveBeenCalledWith([
        mockAdmin,
      ]);
      expect(normalizeApiResponse.normalizeItem).toHaveBeenCalledWith(
        mockAdmin
      );
      expect(result).toEqual([mockAdmin]);
    });

    it("debería manejar error al obtener administradores", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Unauthorized"));

      // Act & Assert
      await expect(adminRepository.getAll()).rejects.toThrow("Unauthorized");
    });

    it("debería retornar array vacío cuando no hay admins", async () => {
      // Arrange
      const mockResponse = { data: [] };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await adminRepository.getAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("debería obtener administrador por ID correctamente", async () => {
      // Arrange
      const mockResponse = { data: mockAdmin };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await adminRepository.getById(1);

      // Assert
      expect(axios.get).toHaveBeenCalledWith(expect.stringMatching(/\/1$/), {
        headers: mockHeaders,
      });
      expect(normalizeApiResponse.normalizeItem).toHaveBeenCalledWith(
        mockAdmin
      );
      expect(result).toEqual(mockAdmin);
    });

    it("debería manejar administrador no encontrado", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Admin not found"));

      // Act & Assert
      await expect(adminRepository.getById(999)).rejects.toThrow(
        "Admin not found"
      );
    });

    it("debería validar ID de administrador válido", async () => {
      // Arrange
      const mockResponse = { data: mockAdmin };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await adminRepository.getById(1);

      // Assert
      expect(result.id).toBe(1);
      expect(result.admin).toBe(true);
      expect(result.roles).toContain("ADMIN");
    });
  });

  describe("create", () => {
    it("debería crear administrador correctamente", async () => {
      // Arrange
      const createdAdmin = { ...mockAdmin, ...mockAdminDTO, id: 2 };
      const mockResponse = { data: createdAdmin };
      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      // Act
      const result = await adminRepository.create(mockAdminDTO);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/create"),
        mockAdminDTO,
        { headers: mockHeaders }
      );
      expect(normalizeApiResponse.normalizeItem).toHaveBeenCalledWith(
        createdAdmin
      );
      expect(result).toEqual(createdAdmin);
    });

    it("debería validar campos requeridos antes de crear", async () => {
      // Arrange
      const validationError = new Error(
        "Validation error: Username is required"
      );
      vi.mocked(axios.post).mockRejectedValue(validationError);

      // Act & Assert
      await expect(adminRepository.create(mockAdminDTO)).rejects.toThrow(
        "Validation error: Username is required"
      );
    });

    it("debería validar formato de email", async () => {
      // Arrange
      const invalidEmailDTO = { ...mockAdminDTO, email: "invalid-email" };
      const emailError = new Error("Invalid email format");
      vi.mocked(axios.post).mockRejectedValue(emailError);

      // Act & Assert
      await expect(adminRepository.create(invalidEmailDTO)).rejects.toThrow(
        "Invalid email format"
      );
    });

    it("debería validar confirmación de contraseña", async () => {
      // Arrange
      const mismatchPasswordDTO = {
        ...mockAdminDTO,
        confirmPassword: "differentPassword",
      };
      const passwordError = new Error("Password confirmation does not match");
      vi.mocked(axios.post).mockRejectedValue(passwordError);

      // Act & Assert
      await expect(adminRepository.create(mismatchPasswordDTO)).rejects.toThrow(
        "Password confirmation does not match"
      );
    });

    it("debería manejar error de duplicación de username", async () => {
      // Arrange
      const duplicateError = new Error("Username already exists");
      vi.mocked(axios.post).mockRejectedValue(duplicateError);

      // Act & Assert
      await expect(adminRepository.create(mockAdminDTO)).rejects.toThrow(
        "Username already exists"
      );
    });
  });

  describe("update", () => {
    it("debería actualizar administrador correctamente", async () => {
      // Arrange
      const updateData = { firstName: "Updated", email: "updated@example.com" };
      const updatedAdmin = { ...mockAdmin, ...updateData };
      const mockResponse = { data: updatedAdmin };
      vi.mocked(axios.put).mockResolvedValue(mockResponse);

      // Act
      const result = await adminRepository.update(1, updateData);

      // Assert
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringMatching(/\/1$/),
        updateData,
        { headers: mockHeaders }
      );
      expect(result.firstName).toBe("Updated");
      expect(result.email).toBe("updated@example.com");
    });

    it("debería validar email actualizado", async () => {
      // Arrange
      const invalidUpdate = { email: "invalid-email-format" };
      const validationError = new Error("Invalid email format");
      vi.mocked(axios.put).mockRejectedValue(validationError);

      // Act & Assert
      await expect(adminRepository.update(1, invalidUpdate)).rejects.toThrow(
        "Invalid email format"
      );
    });

    it("debería permitir actualizaciones parciales", async () => {
      // Arrange
      const partialUpdate = { phone: "+34888999000" };
      const partiallyUpdatedAdmin = { ...mockAdmin, phone: "+34888999000" };
      const mockResponse = { data: partiallyUpdatedAdmin };
      vi.mocked(axios.put).mockResolvedValue(mockResponse);

      // Act
      const result = await adminRepository.update(1, partialUpdate);

      // Assert
      expect(result.phone).toBe("+34888999000");
      expect(result.email).toBe(mockAdmin.email); // No cambió
    });

    it("debería manejar administrador no encontrado en actualización", async () => {
      // Arrange
      vi.mocked(axios.put).mockRejectedValue(new Error("Admin not found"));

      // Act & Assert
      await expect(adminRepository.update(999, {})).rejects.toThrow(
        "Admin not found"
      );
    });
  });

  describe("delete", () => {
    it("debería eliminar administrador correctamente", async () => {
      // Arrange
      const mockResponse = { data: undefined };
      vi.mocked(axios.delete).mockResolvedValue(mockResponse);

      // Act
      await adminRepository.delete(1);

      // Assert
      expect(axios.delete).toHaveBeenCalledWith(expect.stringMatching(/\/1$/), {
        headers: mockHeaders,
      });
    });

    it("debería manejar error al eliminar admin no existente", async () => {
      // Arrange
      vi.mocked(axios.delete).mockRejectedValue(new Error("Admin not found"));

      // Act & Assert
      await expect(adminRepository.delete(999)).rejects.toThrow(
        "Admin not found"
      );
    });

    it("debería prevenir eliminación del último admin", async () => {
      // Arrange
      const lastAdminError = new Error("Cannot delete the last administrator");
      vi.mocked(axios.delete).mockRejectedValue(lastAdminError);

      // Act & Assert
      await expect(adminRepository.delete(1)).rejects.toThrow(
        "Cannot delete the last administrator"
      );
    });

    it("debería manejar permisos insuficientes para eliminar", async () => {
      // Arrange
      const unauthorizedError = { response: { status: 403 } };
      vi.mocked(axios.delete).mockRejectedValue(unauthorizedError);

      // Act & Assert
      await expect(adminRepository.delete(1)).rejects.toEqual(
        unauthorizedError
      );
    });
  });

  describe("demoteToUser", () => {
    it("debería degradar admin a usuario correctamente", async () => {
      // Arrange
      const mockResponse = { data: undefined };
      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      // Act
      await adminRepository.demoteToUser(1);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/demote/1"),
        {},
        { headers: mockHeaders }
      );
    });

    it("debería manejar error en degradación", async () => {
      // Arrange
      vi.mocked(axios.post).mockRejectedValue(new Error("Demotion failed"));

      // Act & Assert
      await expect(adminRepository.demoteToUser(1)).rejects.toThrow(
        "Demotion failed"
      );
    });

    it("debería prevenir autodegradación del último admin", async () => {
      // Arrange
      const lastAdminError = new Error("Cannot demote the last administrator");
      vi.mocked(axios.post).mockRejectedValue(lastAdminError);

      // Act & Assert
      await expect(adminRepository.demoteToUser(1)).rejects.toThrow(
        "Cannot demote the last administrator"
      );
    });
  });

  describe("TOTP/2FA functionality", () => {
    describe("getTotpSecret", () => {
      it("debería obtener secreto TOTP para admin", async () => {
        // Arrange
        const mockSecret = "JBSWY3DPEHPK3PXP";
        const mockResponse = { data: mockSecret };
        vi.mocked(axios.get).mockResolvedValue(mockResponse);

        // Act
        const result = await adminRepository.getTotpSecret(1);

        // Assert
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining("/1/2fa-secret"),
          { headers: mockHeaders }
        );
        expect(result).toBe(mockSecret);
      });

      it("debería manejar error al generar secreto TOTP", async () => {
        // Arrange
        vi.mocked(axios.get).mockRejectedValue(
          new Error("Failed to generate TOTP secret")
        );

        // Act & Assert
        await expect(adminRepository.getTotpSecret(1)).rejects.toThrow(
          "Failed to generate TOTP secret"
        );
      });
    });

    describe("validateTotp", () => {
      it("debería validar código TOTP correctamente", async () => {
        // Arrange
        const mockResponse = { data: true };
        vi.mocked(axios.post).mockResolvedValue(mockResponse);

        // Act
        const result = await adminRepository.validateTotp(1, "123456");

        // Assert
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining("/1/2fa-validate"),
          "123456",
          {
            headers: {
              ...mockHeaders,
              "Content-Type": "application/json",
            },
          }
        );
        expect(result).toBe(true);
      });

      it("debería retornar false para código TOTP inválido", async () => {
        // Arrange
        const mockResponse = { data: false };
        vi.mocked(axios.post).mockResolvedValue(mockResponse);

        // Act
        const result = await adminRepository.validateTotp(1, "000000");

        // Assert
        expect(result).toBe(false);
      });

      it("debería manejar error en validación TOTP", async () => {
        // Arrange
        vi.mocked(axios.post).mockRejectedValue(
          new Error("TOTP validation failed")
        );

        // Act & Assert
        await expect(adminRepository.validateTotp(1, "123456")).rejects.toThrow(
          "TOTP validation failed"
        );
      });
    });
  });

  describe("edge cases", () => {
    it("debería manejar administrador con roles múltiples", async () => {
      // Arrange
      const adminWithMultipleRoles = {
        ...mockAdmin,
        roles: ["ADMIN", "USER", "MODERATOR", "SUPER_ADMIN"],
      };
      const mockResponse = { data: adminWithMultipleRoles };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await adminRepository.getById(1);

      // Assert
      expect(result.roles).toHaveLength(4);
      expect(result.roles).toContain("SUPER_ADMIN");
    });

    it("debería manejar administrador sin avatar", async () => {
      // Arrange
      const adminWithoutAvatar = {
        ...mockAdmin,
        avatarId: null,
        avatarUrl: null,
        avatarDisplayName: null,
      };
      const mockResponse = { data: adminWithoutAvatar };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await adminRepository.getById(1);

      // Assert
      expect(result.avatarId).toBeNull();
      expect(result.avatarUrl).toBeNull();
      expect(result.avatarDisplayName).toBeNull();
    });

    it("debería manejar administrador baneado", async () => {
      // Arrange
      const bannedAdmin = {
        ...mockAdmin,
        banned: true,
        banReason: "Violation of terms",
        active: false,
      };
      const mockResponse = { data: bannedAdmin };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await adminRepository.getById(1);

      // Assert
      expect(result.banned).toBe(true);
      expect(result.banReason).toBe("Violation of terms");
      expect(result.active).toBe(false);
    });

    it("debería manejar errores de red", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Network timeout"));

      // Act & Assert
      await expect(adminRepository.getAll()).rejects.toThrow("Network timeout");
    });

    it("debería manejar respuesta malformada", async () => {
      // Arrange
      const malformedResponse = { data: null };
      vi.mocked(axios.get).mockResolvedValue(malformedResponse);
      vi.mocked(normalizeApiResponse.normalizeArray).mockReturnValue([]);

      // Act
      const result = await adminRepository.getAll();

      // Assert
      expect(result).toEqual([]);
    });

    it("debería manejar IDs de admin inválidos", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Invalid admin ID"));

      // Act & Assert
      await expect(adminRepository.getById(-1)).rejects.toThrow(
        "Invalid admin ID"
      );
    });
  });
});
