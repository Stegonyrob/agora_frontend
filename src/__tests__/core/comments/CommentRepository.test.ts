import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAuthHeaders } from "../../../core/auth/AuthHeaders";
import { CommentDTO } from "../../../core/comments/CommentDTO";
import { CommentRepository } from "../../../core/comments/CommentRepository";
import { IComment } from "../../../core/comments/IComment";
import * as normalizeModule from "../../../core/normalization/normalizeApiResponse";

vi.mock("axios");
vi.mock("../../../core/auth/AuthHeaders");
vi.mock("../../../core/normalization/normalizeApiResponse");

describe("CommentRepository", () => {
  let repository: CommentRepository;
  const mockAuthHeaders = { Authorization: "Bearer test-token" };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubEnv("VITE_API_ENDPOINT_COMMENTS", "http://api.test/comments");
    (getAuthHeaders as any).mockReturnValue(mockAuthHeaders);

    // Mock normalization functions
    (normalizeModule.normalizeArray as any).mockImplementation(
      (arr: any) => arr
    );
    (normalizeModule.normalizeItem as any).mockImplementation(
      (item: any) => item
    );

    repository = new CommentRepository();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("getByPostId", () => {
    it("should fetch comments by post id successfully", async () => {
      const mockComments: IComment[] = [
        {
          id: 1,
          message: "Comment 1",
          postId: 5,
          userId: 10,
          creationDate: "2024-01-01",
          replies: [],
        },
        {
          id: 2,
          message: "Comment 2",
          postId: 5,
          userId: 11,
          creationDate: "2024-01-02",
          replies: [],
        },
      ];

      const mockResponse = {
        content: mockComments,
      };

      (axios.get as any).mockResolvedValue({ data: mockResponse });

      const result = await repository.getByPostId(5);

      expect(axios.get).toHaveBeenCalledWith(
        "http://api.test/comments/post/5/with-replies",
        { headers: mockAuthHeaders }
      );
      expect(normalizeModule.normalizeArray).toHaveBeenCalledWith(mockComments);
      expect(normalizeModule.normalizeItem).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockComments);
    });

    it("should handle empty comments list", async () => {
      const mockResponse = { content: [] };
      (axios.get as any).mockResolvedValue({ data: mockResponse });

      const result = await repository.getByPostId(5);

      expect(result).toEqual([]);
    });

    it("should normalize comments and their replies", async () => {
      const mockComments = [
        { id: 1, content: "Test 1" },
        { id: 2, content: "Test 2" },
      ];

      (axios.get as any).mockResolvedValue({
        data: { content: mockComments },
      });

      await repository.getByPostId(1);

      expect(normalizeModule.normalizeArray).toHaveBeenCalledWith(mockComments);
      expect(normalizeModule.normalizeItem).toHaveBeenCalledTimes(2);
    });

    it("should handle error in getByPostId", async () => {
      (axios.get as any).mockRejectedValue(new Error("Network error"));

      await expect(repository.getByPostId(999)).rejects.toThrow(
        "Network error"
      );
    });

    it("should use correct endpoint with-replies", async () => {
      (axios.get as any).mockResolvedValue({ data: { content: [] } });

      await repository.getByPostId(10);

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/with-replies"),
        expect.any(Object)
      );
    });
  });

  describe("create", () => {
    it("should create comment successfully", async () => {
      const newComment: CommentDTO = {
        message: "New comment",
        postId: 5,
      };

      const createdComment: IComment = {
        id: 1,
        message: "New comment",
        postId: 5,
        userId: 10,
        creationDate: "2024-01-01",
        replies: [],
      };

      (axios.post as any).mockResolvedValue({ data: createdComment });

      const result = await repository.create(newComment);

      expect(axios.post).toHaveBeenCalledWith(
        "http://api.test/comments/create",
        newComment,
        { headers: mockAuthHeaders }
      );
      expect(result).toEqual(createdComment);
    });

    it("should handle validation error in create", async () => {
      const invalidComment: CommentDTO = {
        message: "",
        postId: 0,
      };

      (axios.post as any).mockRejectedValue(new Error("Validation error"));

      await expect(repository.create(invalidComment)).rejects.toThrow(
        "Validation error"
      );
    });

    it("should use /create endpoint", async () => {
      const comment: CommentDTO = { message: "Test", postId: 1 };
      (axios.post as any).mockResolvedValue({ data: {} });

      await repository.create(comment);

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/create"),
        expect.any(Object),
        expect.any(Object)
      );
    });

    it("should include auth headers", async () => {
      const comment: CommentDTO = { message: "Test", postId: 1 };
      (axios.post as any).mockResolvedValue({ data: {} });

      await repository.create(comment);

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        { headers: mockAuthHeaders }
      );
    });
  });

  describe("update", () => {
    it("should update comment successfully", async () => {
      const updateData: CommentDTO = {
        message: "Updated content",
        postId: 5,
      };

      const updatedComment: IComment = {
        id: 1,
        message: "Updated content",
        postId: 5,
        userId: 10,
        creationDate: "2024-01-01",
        replies: [],
      };

      (axios.put as any).mockResolvedValue({ data: updatedComment });

      const result = await repository.update(1, updateData);

      expect(axios.put).toHaveBeenCalledWith(
        "http://api.test/comments/1",
        updateData,
        { headers: mockAuthHeaders }
      );
      expect(result).toEqual(updatedComment);
    });

    it("should handle 404 error in update", async () => {
      (axios.put as any).mockRejectedValue(new Error("Comment not found"));

      await expect(repository.update(999, {} as CommentDTO)).rejects.toThrow(
        "Comment not found"
      );
    });

    it("should handle unauthorized error in update", async () => {
      (axios.put as any).mockRejectedValue(new Error("Unauthorized"));

      await expect(repository.update(1, {} as CommentDTO)).rejects.toThrow(
        "Unauthorized"
      );
    });

    it("should pass correct comment id in URL", async () => {
      const updateData: CommentDTO = { message: "Test", postId: 1 };
      (axios.put as any).mockResolvedValue({ data: {} });

      await repository.update(42, updateData);

      expect(axios.put).toHaveBeenCalledWith(
        "http://api.test/comments/42",
        updateData,
        expect.any(Object)
      );
    });
  });

  describe("delete", () => {
    it("should delete comment successfully", async () => {
      (axios.delete as any).mockResolvedValue({});

      await repository.delete(1);

      expect(axios.delete).toHaveBeenCalledWith("http://api.test/comments/1", {
        headers: mockAuthHeaders,
      });
    });

    it("should handle 404 error in delete", async () => {
      (axios.delete as any).mockRejectedValue(new Error("Comment not found"));

      await expect(repository.delete(999)).rejects.toThrow("Comment not found");
    });

    it("should handle forbidden error in delete", async () => {
      (axios.delete as any).mockRejectedValue(new Error("Forbidden"));

      await expect(repository.delete(1)).rejects.toThrow("Forbidden");
    });

    it("should pass correct comment id in URL", async () => {
      (axios.delete as any).mockResolvedValue({});

      await repository.delete(25);

      expect(axios.delete).toHaveBeenCalledWith(
        "http://api.test/comments/25",
        expect.any(Object)
      );
    });

    it("should include auth headers in delete", async () => {
      (axios.delete as any).mockResolvedValue({});

      await repository.delete(1);

      expect(axios.delete).toHaveBeenCalledWith(expect.any(String), {
        headers: mockAuthHeaders,
      });
    });
  });

  describe("URI configuration", () => {
    it("should correctly set uri from environment variable", () => {
      expect(repository.uri).toBe("http://api.test/comments");
    });
  });
});
