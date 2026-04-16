import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BannedRepository } from "../../../core/banned/BannedRepository";
import BannedService from "../../../core/banned/BannedService";
import IBanned from "../../../core/banned/IBanned";

vi.mock("../../../core/banned/BannedRepository");

describe("BannedService", () => {
  let bannedService: BannedService;
  let mockRepository: BannedRepository;

  const mockBanned: IBanned = {
    id: 1,
    userId: 100,
    reason: "Violation of community guidelines",
    bannedAt: new Date("2024-01-15T10:00:00Z"),
    bannedBy: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = new BannedRepository();
    bannedService = new BannedService(mockRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getAllBanned", () => {
    it("should get all banned users successfully", async () => {
      const mockBannedList: IBanned[] = [
        mockBanned,
        { ...mockBanned, id: 2, userId: 101 },
      ];
      vi.spyOn(mockRepository, "getAll").mockResolvedValue(mockBannedList);

      const result = await bannedService.getAllBanned();

      expect(result).toEqual(mockBannedList);
      expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    });

    it("should throw error when repository fails", async () => {
      const error = new Error("Repository error");
      vi.spyOn(mockRepository, "getAll").mockRejectedValue(error);

      await expect(bannedService.getAllBanned()).rejects.toThrow(
        "Repository error"
      );
    });
  });

  describe("getBannedByUserId", () => {
    it("should get banned record by user id successfully", async () => {
      vi.spyOn(mockRepository, "getByUserId").mockResolvedValue(mockBanned);

      const result = await bannedService.getBannedByUserId(100);

      expect(result).toEqual(mockBanned);
      expect(mockRepository.getByUserId).toHaveBeenCalledWith(100);
    });

    it("should return null when user is not banned", async () => {
      vi.spyOn(mockRepository, "getByUserId").mockResolvedValue(null);

      const result = await bannedService.getBannedByUserId(200);

      expect(result).toBeNull();
    });

    it("should throw error when repository fails", async () => {
      const error = new Error("Repository error");
      vi.spyOn(mockRepository, "getByUserId").mockRejectedValue(error);

      await expect(bannedService.getBannedByUserId(100)).rejects.toThrow(
        "Repository error"
      );
    });
  });

  describe("banUser", () => {
    it("should ban user successfully", async () => {
      vi.spyOn(mockRepository, "create").mockResolvedValue(mockBanned);

      const result = await bannedService.banUser(
        100,
        "Violation of community guidelines"
      );

      expect(result).toEqual(mockBanned);
      expect(mockRepository.create).toHaveBeenCalledWith({
        userId: 100,
        reason: "Violation of community guidelines",
      });
    });

    it("should throw error when ban fails", async () => {
      const error = new Error("Ban failed");
      vi.spyOn(mockRepository, "create").mockRejectedValue(error);

      await expect(bannedService.banUser(100, "Test reason")).rejects.toThrow(
        "Ban failed"
      );
    });
  });

  describe("updateBan", () => {
    it("should update ban reason successfully", async () => {
      const updatedBanned = { ...mockBanned, reason: "Updated reason" };
      vi.spyOn(mockRepository, "update").mockResolvedValue(updatedBanned);

      const result = await bannedService.updateBan(1, "Updated reason");

      expect(result).toEqual(updatedBanned);
      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        userId: 0,
        reason: "Updated reason",
      });
    });

    it("should throw error when update fails", async () => {
      const error = new Error("Update failed");
      vi.spyOn(mockRepository, "update").mockRejectedValue(error);

      await expect(bannedService.updateBan(1, "New reason")).rejects.toThrow(
        "Update failed"
      );
    });
  });

  describe("unbanUser", () => {
    it("should unban user successfully", async () => {
      vi.spyOn(mockRepository, "delete").mockResolvedValue(undefined);

      await bannedService.unbanUser(100);

      expect(mockRepository.delete).toHaveBeenCalledWith(100);
    });

    it("should throw error when unban fails", async () => {
      const error = new Error("Unban failed");
      vi.spyOn(mockRepository, "delete").mockRejectedValue(error);

      await expect(bannedService.unbanUser(100)).rejects.toThrow(
        "Unban failed"
      );
    });
  });
});
