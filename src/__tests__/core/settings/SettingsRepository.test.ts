import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as AuthHeaders from "../../../core/auth/AuthHeaders";
import { ISettings } from "../../../core/settings/ISettings";
import { SettingsRepository } from "../../../core/settings/SettingsRepository";

vi.mock("axios");
vi.mock("../../../core/auth/AuthHeaders");

describe("SettingsRepository", () => {
  let repository: SettingsRepository;
  const mockHeaders = { Authorization: "Bearer test-token" };

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
    vi.stubEnv("VITE_API_ENDPOINT_USERS", "http://api.test/users");

    (AuthHeaders.getAuthHeaders as any).mockReturnValue(mockHeaders);
    repository = new SettingsRepository();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("getSettings", () => {
    it("should fetch settings for a user with auth", async () => {
      (axios.get as any).mockResolvedValueOnce({
        status: 200,
        data: mockSettings,
      });

      const result = await repository.getSettings(1);

      expect(result).toEqual(mockSettings);
      expect(axios.get).toHaveBeenCalledWith(
        "http://api.test/users/settings/1",
        {
          headers: mockHeaders,
        }
      );
    });

    it("should throw error if status is not 200", async () => {
      (axios.get as any).mockResolvedValueOnce({
        status: 404,
        data: null,
      });

      await expect(repository.getSettings(1)).rejects.toThrow(
        "No se pudieron cargar los settings"
      );
    });

    it("should throw error on network failure", async () => {
      const error = new Error("Network error");
      (axios.get as any).mockRejectedValueOnce(error);

      await expect(repository.getSettings(1)).rejects.toThrow("Network error");
    });
  });

  describe("saveSettings", () => {
    it("should save settings with status 200", async () => {
      (axios.post as any).mockResolvedValueOnce({
        status: 200,
        data: {},
      });

      await repository.saveSettings(1, mockSettings);

      expect(axios.post).toHaveBeenCalledWith(
        "http://api.test/users/settings/1",
        JSON.stringify(mockSettings),
        {
          headers: {
            ...mockHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    });

    it("should save settings with status 201", async () => {
      (axios.post as any).mockResolvedValueOnce({
        status: 201,
        data: {},
      });

      await expect(
        repository.saveSettings(1, mockSettings)
      ).resolves.not.toThrow();
    });

    it("should throw error if status is not 200 or 201", async () => {
      (axios.post as any).mockResolvedValueOnce({
        status: 400,
        data: {},
      });

      await expect(repository.saveSettings(1, mockSettings)).rejects.toThrow(
        "No se pudieron guardar los settings"
      );
    });

    it("should serialize settings to JSON string", async () => {
      (axios.post as any).mockResolvedValueOnce({
        status: 200,
        data: {},
      });

      await repository.saveSettings(1, mockSettings);

      const callArgs = (axios.post as any).mock.calls[0];
      expect(callArgs[1]).toBe(JSON.stringify(mockSettings));
    });

    it("should include Content-Type header", async () => {
      (axios.post as any).mockResolvedValueOnce({
        status: 200,
        data: {},
      });

      await repository.saveSettings(1, mockSettings);

      const callArgs = (axios.post as any).mock.calls[0];
      expect(callArgs[2].headers["Content-Type"]).toBe("application/json");
    });

    it("should throw error on network failure", async () => {
      const error = new Error("Network error");
      (axios.post as any).mockRejectedValueOnce(error);

      await expect(repository.saveSettings(1, mockSettings)).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("deleteSettings", () => {
    it("should delete settings with status 200", async () => {
      (axios.delete as any).mockResolvedValueOnce({
        status: 200,
        data: {},
      });

      await repository.deleteSettings(1);

      expect(axios.delete).toHaveBeenCalledWith(
        "http://api.test/users/settings/1",
        {
          headers: mockHeaders,
        }
      );
    });

    it("should delete settings with status 204", async () => {
      (axios.delete as any).mockResolvedValueOnce({
        status: 204,
        data: {},
      });

      await expect(repository.deleteSettings(1)).resolves.not.toThrow();
    });

    it("should throw error if status is not 200 or 204", async () => {
      (axios.delete as any).mockResolvedValueOnce({
        status: 403,
        data: {},
      });

      await expect(repository.deleteSettings(1)).rejects.toThrow(
        "No se pudieron borrar los settings"
      );
    });

    it("should throw error on network failure", async () => {
      const error = new Error("Network error");
      (axios.delete as any).mockRejectedValueOnce(error);

      await expect(repository.deleteSettings(1)).rejects.toThrow(
        "Network error"
      );
    });
  });
});
