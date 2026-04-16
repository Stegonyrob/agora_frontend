import { beforeEach, describe, expect, it, vi } from "vitest";
import { ISettings } from "../../../core/settings/ISettings";
import { SettingsRepository } from "../../../core/settings/SettingsRepository";
import { SettingsService } from "../../../core/settings/SettingsService";

vi.mock("../../../core/settings/SettingsRepository");

describe("SettingsService", () => {
  let service: SettingsService;
  let mockRepository: any;

  const mockSettings: ISettings = {
    fontSize: 16,
    highContrast: false,
    animations: true,
    daltonic: false,
    showPersonalInfo: true,
    twoFA: false,
    socialLinks: ["https://twitter.com/user"],
    userId: 1,
  };

  beforeEach(() => {
    mockRepository = {
      getSettings: vi.fn(),
      saveSettings: vi.fn(),
      deleteSettings: vi.fn(),
    };

    (SettingsRepository as any).mockImplementation(() => mockRepository);
    service = new SettingsService();
    vi.clearAllMocks();
  });

  describe("getSettings", () => {
    it("should get settings for a user", async () => {
      mockRepository.getSettings.mockResolvedValueOnce(mockSettings);

      const result = await service.getSettings(1);

      expect(result).toEqual(mockSettings);
      expect(mockRepository.getSettings).toHaveBeenCalledWith(1);
    });

    it("should throw error if repository fails", async () => {
      const error = new Error("Failed to load settings");
      mockRepository.getSettings.mockRejectedValueOnce(error);

      await expect(service.getSettings(1)).rejects.toThrow(
        "Failed to load settings"
      );
    });
  });

  describe("saveSettings", () => {
    it("should save settings for a user", async () => {
      mockRepository.saveSettings.mockResolvedValueOnce(undefined);

      await service.saveSettings(1, mockSettings);

      expect(mockRepository.saveSettings).toHaveBeenCalledWith(1, mockSettings);
    });

    it("should update specific settings", async () => {
      const updatedSettings: ISettings = {
        ...mockSettings,
        fontSize: 18,
        highContrast: true,
      };
      mockRepository.saveSettings.mockResolvedValueOnce(undefined);

      await service.saveSettings(1, updatedSettings);

      expect(mockRepository.saveSettings).toHaveBeenCalledWith(
        1,
        updatedSettings
      );
      expect(mockRepository.saveSettings).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          fontSize: 18,
          highContrast: true,
        })
      );
    });

    it("should throw error if repository fails", async () => {
      const error = new Error("Failed to save settings");
      mockRepository.saveSettings.mockRejectedValueOnce(error);

      await expect(service.saveSettings(1, mockSettings)).rejects.toThrow(
        "Failed to save settings"
      );
    });
  });

  describe("deleteSettings", () => {
    it("should delete settings for a user", async () => {
      mockRepository.deleteSettings.mockResolvedValueOnce(undefined);

      await service.deleteSettings(1);

      expect(mockRepository.deleteSettings).toHaveBeenCalledWith(1);
    });

    it("should throw error if repository fails", async () => {
      const error = new Error("Failed to delete settings");
      mockRepository.deleteSettings.mockRejectedValueOnce(error);

      await expect(service.deleteSettings(1)).rejects.toThrow(
        "Failed to delete settings"
      );
    });
  });
});
