import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ILegalText } from "../../../core/legals/ILegalText";
import { LegalTextDTO } from "../../../core/legals/LegalTextDTO";
import { LegalTextRepository } from "../../../core/legals/LegalTextRepository";
import { LegalTextService } from "../../../core/legals/LegalTextService";

vi.mock("../../../core/legals/LegalTextRepository");

describe("LegalTextService", () => {
  let legalTextService: LegalTextService;
  let mockRepository: LegalTextRepository;
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
    mockRepository = new LegalTextRepository();
    legalTextService = new LegalTextService(mockRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
    consoleWarnSpy.mockClear();
    consoleLogSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  describe("getLegalTexts", () => {
    it("should get all legal texts by type successfully", async () => {
      const mockTexts: ILegalText[] = [
        mockLegalText,
        { ...mockLegalText, id: 2 },
      ];
      vi.spyOn(mockRepository, "getAllByType").mockResolvedValue(mockTexts);

      const result = await legalTextService.getLegalTexts("privacy-policy");

      expect(result).toEqual(mockTexts);
      expect(mockRepository.getAllByType).toHaveBeenCalledWith(
        "privacy-policy"
      );
    });

    it("should throw error when repository fails", async () => {
      const error = new Error("Repository error");
      vi.spyOn(mockRepository, "getAllByType").mockRejectedValue(error);

      await expect(
        legalTextService.getLegalTexts("privacy-policy")
      ).rejects.toThrow("Repository error");
    });
  });

  describe("getLegalTextByType", () => {
    it("should get legal text by type successfully", async () => {
      vi.spyOn(mockRepository, "getByType").mockResolvedValue(mockLegalText);

      const result = await legalTextService.getLegalTextByType(
        "privacy-policy"
      );

      expect(result).toEqual(mockLegalText);
      expect(mockRepository.getByType).toHaveBeenCalledWith("privacy-policy");
    });

    it("should throw error when text not found", async () => {
      const error = new Error("Text not found");
      vi.spyOn(mockRepository, "getByType").mockRejectedValue(error);

      await expect(
        legalTextService.getLegalTextByType("nonexistent")
      ).rejects.toThrow("Text not found");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("createLegalText", () => {
    it("should throw error as CREATE is disabled", async () => {
      await expect(
        legalTextService.createLegalText(mockLegalTextDTO)
      ).rejects.toThrow(
        "CREATE operation disabled for legal texts. Use UPDATE instead."
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "⚠️ CREATE disabled for legal texts. Use UPDATE instead."
      );
    });
  });

  describe("updateLegalText", () => {
    it("should update legal text successfully", async () => {
      const updatedText = { ...mockLegalText, content: "Updated content" };
      vi.spyOn(mockRepository, "update").mockResolvedValue(updatedText);

      const result = await legalTextService.updateLegalText(
        "privacy-policy",
        mockLegalTextDTO
      );

      expect(result).toEqual(updatedText);
      expect(mockRepository.update).toHaveBeenCalledWith(
        "privacy-policy",
        mockLegalTextDTO
      );
    });

    it("should throw error when update fails", async () => {
      const error = new Error("Update failed");
      vi.spyOn(mockRepository, "update").mockRejectedValue(error);

      await expect(
        legalTextService.updateLegalText("privacy-policy", mockLegalTextDTO)
      ).rejects.toThrow("Update failed");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("deleteLegalText", () => {
    it("should delete legal text successfully", async () => {
      vi.spyOn(mockRepository, "delete").mockResolvedValue(undefined);

      await legalTextService.deleteLegalText(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it("should throw error when deletion fails", async () => {
      const error = new Error("Deletion failed");
      vi.spyOn(mockRepository, "delete").mockRejectedValue(error);

      await expect(legalTextService.deleteLegalText(1)).rejects.toThrow(
        "Deletion failed"
      );
    });
  });
});
