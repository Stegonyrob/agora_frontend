import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as authHeaders from "../../../core/auth/AuthHeaders";
import IProfile from "../../../core/profiles/IProfile";
import IProfileDTO from "../../../core/profiles/IProfileDTO";
import { ProfileRepository } from "../../../core/profiles/ProfileRepository";

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

describe("ProfileRepository", () => {
  let profileRepository: ProfileRepository;

  const mockProfile: IProfile = {
    id: 1,
    firstName: "John",
    lastName1: "Doe",
    lastName2: "Smith",
    relationship: "single",
    email: "john.doe@example.com",
    avatar: "http://example.com/avatar.jpg",
    avatar_id: 5,
    avatarId: 5,
    city: "Madrid",
    country: "Spain",
    phone: "+34666777888",
    password: "password123",
    confirmPassword: "password123",
  };

  const mockProfileDTO: IProfileDTO = {
    firstName: "John Updated",
    lastName1: "Doe Updated",
    email: "john.updated@example.com",
    city: "Barcelona",
    avatar_id: 7,
  };

  const mockHeaders = { Authorization: "Bearer mock_token" };

  beforeEach(() => {
    vi.clearAllMocks();
    profileRepository = new ProfileRepository();

    // Setup de mocks por defecto
    vi.mocked(authHeaders.getAuthHeaders).mockReturnValue(mockHeaders);
  });

  describe("getById", () => {
    it("debería obtener perfil por ID correctamente", async () => {
      // Arrange
      const mockResponse = { data: mockProfile };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await profileRepository.getById(1);

      // Assert
      expect(axios.get).toHaveBeenCalledWith(expect.stringMatching(/\/1$/), {
        headers: mockHeaders,
      });
      expect(result).toEqual(mockProfile);
    });

    it("debería manejar perfil no encontrado", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Profile not found"));

      // Act & Assert
      await expect(profileRepository.getById(999)).rejects.toThrow(
        "Profile not found"
      );
    });

    it("debería mapear avatarId a avatar_id", async () => {
      // Arrange
      const profileWithAvatarId = {
        ...mockProfile,
        avatarId: 10,
        avatar_id: undefined,
      };
      const mockResponse = { data: profileWithAvatarId };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await profileRepository.getById(1);

      // Assert
      expect(result.avatar_id).toBe(10);
      expect(result.avatarId).toBe(10);
    });
  });

  describe("getByDTO", () => {
    it("debería obtener perfil por DTO correctamente", async () => {
      // Arrange
      const mockDTO = { searchField: "email", searchValue: "john@example.com" };
      const mockResponse = { data: mockProfile };
      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      // Act
      const result = await profileRepository.getByDTO(1, mockDTO);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/\/1$/),
        mockDTO,
        { headers: mockHeaders }
      );
      expect(result).toEqual(mockProfile);
    });

    it("debería manejar error en búsqueda por DTO", async () => {
      // Arrange
      const mockDTO = { invalid: "data" };
      vi.mocked(axios.post).mockRejectedValue(
        new Error("Invalid search criteria")
      );

      // Act & Assert
      await expect(profileRepository.getByDTO(1, mockDTO)).rejects.toThrow(
        "Invalid search criteria"
      );
    });
  });

  describe("update", () => {
    it("debería actualizar perfil correctamente", async () => {
      // Arrange
      const updatedProfile = { ...mockProfile, ...mockProfileDTO };
      const mockResponse = { data: updatedProfile };
      vi.mocked(axios.put).mockResolvedValue(mockResponse);

      // Act
      const result = await profileRepository.update(1, mockProfileDTO);

      // Assert
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringMatching(/\/1$/),
        mockProfileDTO,
        { headers: mockHeaders }
      );
      expect(result.firstName).toBe("John Updated");
      expect(result.email).toBe("john.updated@example.com");
    });

    it("debería manejar error 500 del backend (perfil no existe)", async () => {
      // Arrange
      const error500 = { response: { status: 500 } };
      vi.mocked(axios.put).mockRejectedValue(error500);

      // Act & Assert
      await expect(
        profileRepository.update(999, mockProfileDTO)
      ).rejects.toEqual(error500);
    });

    it("debería manejar error de validación", async () => {
      // Arrange
      const validationError = new Error(
        "Validation failed: invalid email format"
      );
      vi.mocked(axios.put).mockRejectedValue(validationError);

      // Act & Assert
      await expect(profileRepository.update(1, mockProfileDTO)).rejects.toThrow(
        "Validation failed: invalid email format"
      );
    });

    it("debería registrar logs correctamente", async () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const mockResponse = { data: mockProfile };
      vi.mocked(axios.put).mockResolvedValue(mockResponse);

      // Act
      await profileRepository.update(1, mockProfileDTO);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        "[ProfileRepository.update] Endpoint:",
        expect.any(String)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("delete", () => {
    it("debería eliminar perfil correctamente", async () => {
      // Arrange
      vi.mocked(axios.delete).mockResolvedValue({});

      // Act
      await profileRepository.delete(1);

      // Assert
      expect(axios.delete).toHaveBeenCalledWith(expect.stringMatching(/\/1$/), {
        headers: mockHeaders,
      });
    });

    it("debería manejar error al eliminar perfil no existente", async () => {
      // Arrange
      vi.mocked(axios.delete).mockRejectedValue(new Error("Profile not found"));

      // Act & Assert
      await expect(profileRepository.delete(999)).rejects.toThrow(
        "Profile not found"
      );
    });

    it("debería manejar permisos insuficientes", async () => {
      // Arrange
      const unauthorizedError = { response: { status: 403 } };
      vi.mocked(axios.delete).mockRejectedValue(unauthorizedError);

      // Act & Assert
      await expect(profileRepository.delete(1)).rejects.toEqual(
        unauthorizedError
      );
    });
  });

  describe("updateMyProfile", () => {
    it("debería actualizar mi propio perfil correctamente", async () => {
      // Arrange
      const updatedProfile = { ...mockProfile, ...mockProfileDTO };
      const mockResponse = { data: updatedProfile };
      vi.mocked(axios.put).mockResolvedValue(mockResponse);

      // Act
      const result = await profileRepository.updateMyProfile(mockProfileDTO);

      // Assert
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining("/me"),
        mockProfileDTO,
        { headers: mockHeaders }
      );
      expect(result).toEqual(updatedProfile);
    });

    it("debería manejar error en actualización propia", async () => {
      // Arrange
      vi.mocked(axios.put).mockRejectedValue(new Error("Update failed"));

      // Act & Assert
      await expect(
        profileRepository.updateMyProfile(mockProfileDTO)
      ).rejects.toThrow("Update failed");
    });
  });

  describe("deleteMyProfile", () => {
    it("debería eliminar mi cuenta correctamente (GDPR)", async () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      vi.mocked(axios.delete).mockResolvedValue({});

      // Act
      await profileRepository.deleteMyProfile();

      // Assert
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/me"),
        { headers: mockHeaders }
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Self-deletion (GDPR)")
      );

      consoleSpy.mockRestore();
    });

    it("debería manejar error en auto-eliminación", async () => {
      // Arrange
      vi.mocked(axios.delete).mockRejectedValue(new Error("Deletion failed"));

      // Act & Assert
      await expect(profileRepository.deleteMyProfile()).rejects.toThrow(
        "Deletion failed"
      );
    });
  });

  describe("favoritos", () => {
    it("debería obtener favoritos correctamente", async () => {
      // Arrange
      const mockFavorites = [
        { id: 1, type: "event" },
        { id: 2, type: "post" },
      ];
      const mockResponse = { data: mockFavorites };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await profileRepository.getFavorites(1);

      // Assert
      expect(axios.get).toHaveBeenCalledWith(expect.stringMatching(/\/1$/), {
        headers: mockHeaders,
      });
      expect(result).toEqual(mockFavorites);
    });

    it("debería toggle favorito correctamente", async () => {
      // Arrange
      const toggleData = { eventId: 5, action: "add" };
      const mockResponse = { data: { success: true } };
      vi.mocked(axios.put).mockResolvedValue(mockResponse);

      // Act
      const result = await profileRepository.toggleFavorite(1, toggleData);

      // Assert
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringMatching(/\/1$/),
        toggleData,
        { headers: mockHeaders }
      );
      expect(result).toEqual({ success: true });
    });

    it("debería obtener favorito específico", async () => {
      // Arrange
      const specificData = { eventId: 5 };
      const mockResponse = { data: { id: 5, isFavorite: true } };
      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      // Act
      const result = await profileRepository.getFavoriteSpecific(
        1,
        specificData
      );

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/\/1$/),
        specificData,
        { headers: mockHeaders }
      );
      expect(result).toEqual({ id: 5, isFavorite: true });
    });

    it("debería eliminar favorito correctamente", async () => {
      // Arrange
      vi.mocked(axios.delete).mockResolvedValue({});

      // Act
      await profileRepository.removeFavorite(5);

      // Assert
      expect(axios.delete).toHaveBeenCalledWith(expect.stringMatching(/\/5$/), {
        headers: mockHeaders,
      });
    });
  });

  describe("métodos deprecated", () => {
    it("debería lanzar error en getAll (deprecated)", async () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Act & Assert
      await expect(profileRepository.getAll()).rejects.toThrow(
        "Bulk profile listing is no longer supported. Use getById() for specific profiles."
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("ProfileRepository.getAll() is deprecated")
      );

      consoleSpy.mockRestore();
    });

    it("debería lanzar error en create (deprecated)", async () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Act & Assert
      await expect(profileRepository.create(mockProfileDTO)).rejects.toThrow(
        "Profile creation is handled by registration endpoint"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("ProfileRepository.create() is deprecated")
      );

      consoleSpy.mockRestore();
    });

    it("debería redireccionar updateAsAdmin a update", async () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const mockResponse = { data: mockProfile };
      vi.mocked(axios.put).mockResolvedValue(mockResponse);

      // Act
      const result = await profileRepository.updateAsAdmin(1, mockProfileDTO);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "ProfileRepository.updateAsAdmin() is deprecated"
        )
      );
      expect(result).toEqual(mockProfile);

      consoleSpy.mockRestore();
    });
  });

  describe("edge cases", () => {
    it("debería manejar campos opcionales", async () => {
      // Arrange
      const profileWithOptionals = {
        ...mockProfile,
        lastName2: "", // Campo opcional vacío
        avatar_id: null, // Avatar no seleccionado
        avatarId: null, // También null en camelCase
        phone: "", // Teléfono opcional
      };
      const mockResponse = { data: profileWithOptionals };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await profileRepository.getById(1);

      // Assert
      expect(result.lastName2).toBe("");
      expect(result.avatar_id).toBeNull();
      expect(result.phone).toBe("");
    });

    it("debería manejar respuesta sin avatarId", async () => {
      // Arrange
      const profileWithoutAvatar = {
        ...mockProfile,
        avatarId: undefined,
        avatar_id: undefined,
      };
      const mockResponse = { data: profileWithoutAvatar };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await profileRepository.getById(1);

      // Assert
      expect(result.avatarId).toBeUndefined();
      expect(result.avatar_id).toBeUndefined();
    });

    it("debería manejar errores de red", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Network timeout"));

      // Act & Assert
      await expect(profileRepository.getById(1)).rejects.toThrow(
        "Network timeout"
      );
    });

    it("debería manejar IDs de perfil inválidos", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Invalid profile ID"));

      // Act & Assert
      await expect(profileRepository.getById(-1)).rejects.toThrow(
        "Invalid profile ID"
      );
    });
  });
});
