import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import IProfile from "../../core/profiles/IProfile";
import IProfileDTO from "../../core/profiles/IProfileDTO";
import { ProfileRepository } from "../../core/profiles/ProfileRepository";
import ProfileService from "../../core/profiles/ProfileService";

// Mock del ProfileRepository
vi.mock("../../core/profiles/ProfileRepository");

describe("ProfileService", () => {
  let profileService: ProfileService;
  let mockRepository: Mocked<ProfileRepository>;

  // Mock data usando la interfaz real
  const mockProfile: IProfile = {
    id: 1,
    firstName: "Test",
    lastName1: "User",
    lastName2: "Last",
    relationship: "friend",
    email: "test@example.com",
    avatar: "avatar1.jpg",
    avatar_id: 1,
    avatarId: 1,
    city: "Madrid",
    country: "Spain",
    phone: "+34123456789",
    password: "hashedPassword123",
    confirmPassword: "hashedPassword123",
  };

  const mockProfileDTO: IProfileDTO = {
    firstName: "Test",
    lastName1: "User",
    lastName2: "Last",
    relationship: "friend",
    email: "test@example.com",
    avatar: "avatar1.jpg",
    avatar_id: 1,
    city: "Madrid",
    country: "Spain",
    phone: "+34123456789",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = vi.mocked(new ProfileRepository());
    profileService = new ProfileService(mockRepository);
  });

  describe("getProfileById", () => {
    it("debería obtener perfil por ID correctamente", async () => {
      // Arrange
      mockRepository.getById.mockResolvedValue(mockProfile);

      // Act
      const result = await profileService.getProfileById(1, false);

      // Assert
      expect(mockRepository.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProfile);
    });

    it("debería manejar perfil no encontrado", async () => {
      // Arrange
      mockRepository.getById.mockRejectedValue(new Error("Profile not found"));

      // Act & Assert
      await expect(profileService.getProfileById(999, false)).rejects.toThrow(
        "Profile not found"
      );
    });
  });

  describe("updateProfile", () => {
    it("debería actualizar perfil válido correctamente", async () => {
      // Arrange
      const updatedProfile = { ...mockProfile, city: "Barcelona" };
      mockRepository.update.mockResolvedValue(updatedProfile);

      // Act
      const result = await profileService.updateProfile(1, mockProfileDTO);

      // Assert
      expect(mockRepository.update).toHaveBeenCalledWith(1, mockProfileDTO);
      expect(result).toEqual(updatedProfile);
    });

    it("debería manejar error 500 del backend (perfil no existe)", async () => {
      // Arrange
      mockRepository.update.mockRejectedValue(
        new Error("Internal Server Error")
      );

      // Act & Assert
      await expect(
        profileService.updateProfile(999, mockProfileDTO)
      ).rejects.toThrow("Internal Server Error");
    });
  });

  describe("deleteProfile", () => {
    it("debería eliminar perfil correctamente", async () => {
      // Arrange
      mockRepository.delete.mockResolvedValue();

      // Act
      await profileService.deleteProfile(1);

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe("edge cases", () => {
    it("debería manejar campos opcionales", async () => {
      // Arrange
      const minimalDTO: IProfileDTO = {
        firstName: "User",
        lastName1: "Test",
        email: "user@test.com",
      };
      const updatedProfile = { ...mockProfile, ...minimalDTO };
      mockRepository.update.mockResolvedValue(updatedProfile);

      // Act
      const result = await profileService.updateProfile(1, minimalDTO);

      // Assert
      expect(result.firstName).toBe("User");
      expect(result.email).toBe("user@test.com");
    });
  });
});
