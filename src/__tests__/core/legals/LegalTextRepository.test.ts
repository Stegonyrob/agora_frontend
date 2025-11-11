import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as AuthHeaders from "../../../core/auth/AuthHeaders";
import { ILegalText } from "../../../core/legals/ILegalText";
import { LegalTextDTO } from "../../../core/legals/LegalTextDTO";
import { LegalTextRepository } from "../../../core/legals/LegalTextRepository";

vi.mock("axios");
vi.mock("../../../core/auth/AuthHeaders");

describe("LegalTextRepository", () => {
  let repository: LegalTextRepository;
  const mockUri = "http://localhost:8080/api/v1/legal-texts";
  const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  const mockLegalText: ILegalText = {
    id: 1,
    type: "privacy-policy",
    title: "Privacy Policy",
    content: "This is the privacy policy content",
    updatedAt: "2024-01-15T10:00:00Z",
  };

  const mockLegalTextDTO: LegalTextDTO = {
    type: "privacy-policy",
    title: "Privacy Policy",
    content: "This is the privacy policy content",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_API_ENDPOINT_LEGAL", mockUri);
    vi.spyOn(AuthHeaders, "getAuthHeaders").mockReturnValue({
      Authorization: "Bearer token",
    });
    repository = new LegalTextRepository();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
    consoleWarnSpy.mockClear();
    consoleLogSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  describe("getAllByType", () => {
    it("should fetch all legal texts by type successfully", async () => {
      const mockTexts: ILegalText[] = [
        mockLegalText,
        { ...mockLegalText, id: 2 },
      ];
      vi.mocked(axios.get).mockResolvedValue({ data: mockTexts });

      const result = await repository.getAllByType("privacy-policy");

      expect(result).toEqual(mockTexts);
      expect(axios.get).toHaveBeenCalledWith(`${mockUri}/privacy-policy`, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should throw error when request fails", async () => {
      const error = new Error("Network error");
      vi.mocked(axios.get).mockRejectedValue(error);

      await expect(repository.getAllByType("privacy-policy")).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("getByType", () => {
    it("should fetch legal text by type successfully", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockLegalText });

      const result = await repository.getByType("privacy-policy");

      expect(result).toEqual(mockLegalText);
      expect(axios.get).toHaveBeenCalledWith(`${mockUri}/privacy-policy`, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should throw error when text not found", async () => {
      const error = new Error("Text not found");
      vi.mocked(axios.get).mockRejectedValue(error);

      await expect(repository.getByType("nonexistent")).rejects.toThrow(
        "Text not found"
      );
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("should throw error as CREATE is disabled", async () => {
      await expect(repository.create(mockLegalTextDTO)).rejects.toThrow(
        "CREATE operation disabled for legal texts. Use UPDATE instead."
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "⚠️ CREATE disabled for legal texts. Use UPDATE instead."
      );
    });
  });

  describe("update", () => {
    it("should update legal text successfully", async () => {
      const updatedText = { ...mockLegalText, content: "Updated content" };
      vi.mocked(axios.put).mockResolvedValue({
        data: updatedText,
        status: 200,
      });

      const result = await repository.update(
        "privacy-policy",
        mockLegalTextDTO
      );

      expect(result).toEqual(updatedText);
      expect(axios.put).toHaveBeenCalledWith(
        `${mockUri}/privacy-policy`,
        mockLegalTextDTO,
        {
          headers: { Authorization: "Bearer token" },
        }
      );
    });

    it("should throw error when update fails", async () => {
      const error = {
        response: {
          status: 400,
          data: "Bad request",
        },
      };
      vi.mocked(axios.put).mockRejectedValue(error);

      await expect(
        repository.update("privacy-policy", mockLegalTextDTO)
      ).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete legal text successfully", async () => {
      vi.mocked(axios.delete).mockResolvedValue({ data: undefined });

      await repository.delete(1);

      expect(axios.delete).toHaveBeenCalledWith(`${mockUri}/1`, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should throw error when deletion fails", async () => {
      const error = new Error("Deletion failed");
      vi.mocked(axios.delete).mockRejectedValue(error);

      await expect(repository.delete(1)).rejects.toThrow("Deletion failed");
    });
  });
});
