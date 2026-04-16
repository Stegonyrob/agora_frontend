import axios, { AxiosError } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as AuthHeaders from "../../../core/auth/AuthHeaders";
import { BannedRepository } from "../../../core/banned/BannedRepository";
import IBanned from "../../../core/banned/IBanned";
import IBannedDTO from "../../../core/banned/IBannedDTO";

vi.mock("axios");
vi.mock("../../../core/auth/AuthHeaders");

describe("BannedRepository", () => {
  let repository: BannedRepository;
  const mockUri = "http://localhost:8080/api/v1/banned";
  const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  const mockBanned: IBanned = {
    id: 1,
    userId: 100,
    reason: "Violation of community guidelines",
    bannedAt: new Date("2024-01-15T10:00:00Z"),
    bannedBy: 1,
  };

  const mockBannedDTO: IBannedDTO = {
    userId: 100,
    reason: "Violation of community guidelines",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_API_ENDPOINT_BANNED", mockUri);
    vi.spyOn(AuthHeaders, "getAuthHeaders").mockReturnValue({
      Authorization: "Bearer token",
    });
    repository = new BannedRepository();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
    consoleLogSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  describe("getAll", () => {
    it("should fetch all banned users successfully", async () => {
      const mockBannedList: IBanned[] = [
        mockBanned,
        { ...mockBanned, id: 2, userId: 101 },
      ];
      vi.mocked(axios.get).mockResolvedValue({ data: mockBannedList });

      const result = await repository.getAll();

      expect(result).toEqual(mockBannedList);
      expect(axios.get).toHaveBeenCalledWith(mockUri, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should throw error when request fails", async () => {
      const error = new Error("Network error");
      vi.mocked(axios.get).mockRejectedValue(error);

      await expect(repository.getAll()).rejects.toThrow("Network error");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("getByUserId", () => {
    it("should fetch banned record by user id successfully", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockBanned });

      const result = await repository.getByUserId(100);

      expect(result).toEqual(mockBanned);
      expect(axios.get).toHaveBeenCalledWith(`${mockUri}/user/100`, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should return null when user is not banned (404 error)", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
      } as AxiosError;

      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      vi.mocked(axios.get).mockRejectedValue(axiosError);

      const result = await repository.getByUserId(200);

      expect(result).toBeNull();
    });

    it("should throw error when request fails with non-404 error", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 500 },
      } as AxiosError;

      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      vi.mocked(axios.get).mockRejectedValue(axiosError);

      await expect(repository.getByUserId(100)).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("should create banned record successfully", async () => {
      vi.mocked(axios.post).mockResolvedValue({ data: mockBanned });

      const result = await repository.create(mockBannedDTO);

      expect(result).toEqual(mockBanned);
      expect(axios.post).toHaveBeenCalledWith(
        `${mockUri}/user/100`,
        { reason: mockBannedDTO.reason },
        { headers: { Authorization: "Bearer token" } }
      );
    });

    it("should throw error when creation fails", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 400, data: "Bad request" },
      } as AxiosError;

      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      vi.mocked(axios.post).mockRejectedValue(axiosError);

      await expect(repository.create(mockBannedDTO)).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update banned record successfully", async () => {
      const updatedBanned = { ...mockBanned, reason: "Updated reason" };
      vi.mocked(axios.put).mockResolvedValue({ data: updatedBanned });

      const result = await repository.update(1, mockBannedDTO);

      expect(result).toEqual(updatedBanned);
      expect(axios.put).toHaveBeenCalledWith(`${mockUri}/1`, mockBannedDTO, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should throw error when update fails", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404, data: "Not found" },
      } as AxiosError;

      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      vi.mocked(axios.put).mockRejectedValue(axiosError);

      await expect(repository.update(1, mockBannedDTO)).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete banned record successfully", async () => {
      vi.mocked(axios.delete).mockResolvedValue({ data: undefined });

      await repository.delete(100);

      expect(axios.delete).toHaveBeenCalledWith(`${mockUri}/user/100`, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should throw error when deletion fails", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 500, data: "Server error" },
      } as AxiosError;

      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      vi.mocked(axios.delete).mockRejectedValue(axiosError);

      await expect(repository.delete(100)).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
