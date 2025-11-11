import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as AuthHeaders from "../../../core/auth/AuthHeaders";
import * as normalizeApiResponse from "../../../core/normalization/normalizeApiResponse";
import { IReply } from "../../../core/replies/IReply";
import { IReplyDTO } from "../../../core/replies/IReplyDTO";
import { ReplyRepository } from "../../../core/replies/ReplyRepository";

vi.mock("axios");
vi.mock("../../../core/auth/AuthHeaders");
vi.mock("../../../core/normalization/normalizeApiResponse");

describe("ReplyRepository", () => {
  let repository: ReplyRepository;
  const mockUri = "http://localhost:8080/api/v1/replies";
  const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  const mockReply: IReply = {
    id: 1,
    commentId: 10,
    userId: 100,
    message: "Test reply message",
    creation_date: "2024-01-15T10:00:00Z",
    user: {
      id: 100,
      username: "testuser",
      email: "test@example.com",
      roles: ["USER"],
      avatarId: 1,
      firstName: "Test",
      lastName1: "User",
      lastName2: null,
      avatarUrl: null,
      avatarDisplayName: null,
      acceptedRules: true,
      banReason: null,
      fullName: "Test User",
      banned: false,
      admin: false,
    },
  };

  const mockReplyDTO: IReplyDTO = {
    commentId: 10,
    userId: 100,
    message: "Test reply message",
    tags: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_API_ENDPOINT_REPLIES", mockUri);
    vi.spyOn(AuthHeaders, "getAuthHeaders").mockReturnValue({
      Authorization: "Bearer token",
    });
    vi.spyOn(normalizeApiResponse, "normalizeArray").mockImplementation(
      (data) => data as unknown[]
    );
    vi.spyOn(normalizeApiResponse, "normalizeItem").mockImplementation(
      (item) => item
    );
    repository = new ReplyRepository();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
    consoleLogSpy.mockClear();
  });

  describe("getAll", () => {
    it("should fetch all replies successfully", async () => {
      const mockReplies = [mockReply, { ...mockReply, id: 2 }];
      vi.mocked(axios.get).mockResolvedValue({ data: mockReplies });

      const result = await repository.getAll();

      expect(result).toEqual(mockReplies);
      expect(axios.get).toHaveBeenCalledWith(`${mockUri}/all`, {
        headers: { Authorization: "Bearer token" },
      });
      expect(normalizeApiResponse.normalizeArray).toHaveBeenCalledWith(
        mockReplies
      );
      expect(normalizeApiResponse.normalizeItem).toHaveBeenCalledTimes(2);
    });

    it("should throw error when request fails", async () => {
      const error = new Error("Network error");
      vi.mocked(axios.get).mockRejectedValue(error);

      await expect(repository.getAll()).rejects.toThrow("Network error");
    });
  });

  describe("getByCommentId", () => {
    it("should fetch replies by comment id successfully", async () => {
      const mockReplies = [mockReply, { ...mockReply, id: 2 }];
      vi.mocked(axios.get).mockResolvedValue({ data: mockReplies });

      const result = await repository.getByCommentId(10);

      expect(result).toEqual(mockReplies);
      expect(axios.get).toHaveBeenCalledWith(`${mockUri}/comment/10`, {
        headers: { Authorization: "Bearer token" },
      });
      expect(normalizeApiResponse.normalizeArray).toHaveBeenCalledWith(
        mockReplies
      );
    });

    it("should return empty array when no replies found", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: [] });

      const result = await repository.getByCommentId(999);

      expect(result).toEqual([]);
    });

    it("should throw error when request fails", async () => {
      const error = new Error("Network error");
      vi.mocked(axios.get).mockRejectedValue(error);

      await expect(repository.getByCommentId(10)).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("create", () => {
    it("should create reply successfully", async () => {
      vi.mocked(axios.post).mockResolvedValue({ data: mockReply });

      const result = await repository.create(mockReplyDTO);

      expect(result).toEqual(mockReply);
      expect(axios.post).toHaveBeenCalledWith(
        `${mockUri}/create`,
        mockReplyDTO,
        {
          headers: {
            Authorization: "Bearer token",
            "Content-Type": "application/json",
          },
        }
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "ReplyRepository.create: payload:",
        mockReplyDTO
      );
    });

    it("should throw error when creation fails", async () => {
      const error = new Error("Creation failed");
      vi.mocked(axios.post).mockRejectedValue(error);

      await expect(repository.create(mockReplyDTO)).rejects.toThrow(
        "Creation failed"
      );
    });
  });

  describe("update", () => {
    it("should update reply successfully", async () => {
      const updatedReply = { ...mockReply, message: "Updated message" };
      vi.mocked(axios.put).mockResolvedValue({ data: updatedReply });

      const result = await repository.update(1, mockReplyDTO);

      expect(result).toEqual(updatedReply);
      expect(axios.put).toHaveBeenCalledWith(`${mockUri}/1`, mockReplyDTO, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should throw error when update fails", async () => {
      const error = new Error("Update failed");
      vi.mocked(axios.put).mockRejectedValue(error);

      await expect(repository.update(1, mockReplyDTO)).rejects.toThrow(
        "Update failed"
      );
    });
  });

  describe("delete", () => {
    it("should delete reply successfully", async () => {
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
