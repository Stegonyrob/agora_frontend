import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAuthHeaders } from "../../../core/auth/AuthHeaders";
import * as normalizeModule from "../../../core/normalization/normalizeApiResponse";
import { IPost } from "../../../core/posts/IPost";
import { IPostDTO } from "../../../core/posts/IPostDTO";
import PostRepository, { Page } from "../../../core/posts/PostRepository";

vi.mock("axios");
vi.mock("../../../core/auth/AuthHeaders");
vi.mock("../../../core/normalization/normalizeApiResponse");

describe("PostRepository", () => {
  let repository: PostRepository;
  const mockAuthHeaders = { Authorization: "Bearer test-token" };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubEnv("VITE_API_ENDPOINT_POSTS", "http://api.test/posts");
    (getAuthHeaders as any).mockReturnValue(mockAuthHeaders);

    // Mock normalization functions
    (normalizeModule.normalizeArray as any).mockImplementation(
      (arr: any) => arr
    );
    (normalizeModule.normalizeItem as any).mockImplementation(
      (item: any) => item
    );

    repository = new PostRepository();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("getAll", () => {
    it("should fetch all posts with pagination successfully", async () => {
      const mockResponse: Page<IPost> = {
        content: [
          {
            id: 1,
            title: "Post 1",
            message: "Content 1",
            userId: 1,
            location: "Test",
            loves: 0,
            comments: [],
            isArchived: false,
            tags: [],
            images: [],
            isPublished: true,
            alt_image: "",
            source_image: "",
            alt_avatar: "",
            source_avatar: "",
            userName: "user1",
            role: "USER",
            url_avatar: "",
            creationDate: "2024-01-01",
            updatedAt: "2024-01-01",
            createdAt: "2024-01-01",
            description: "Description",
            ondelete: () => {},
          },
        ],
        totalPages: 5,
        totalElements: 50,
        number: 0,
        size: 10,
      };

      (axios.get as any).mockResolvedValue({ data: mockResponse });

      const result = await repository.getAll(0, 10);

      expect(axios.get).toHaveBeenCalledWith(
        "http://api.test/posts?page=0&size=10",
        { headers: mockAuthHeaders }
      );
      expect(normalizeModule.normalizeArray).toHaveBeenCalledWith(
        mockResponse.content
      );
      expect(result.content).toEqual(mockResponse.content);
      expect(result.totalPages).toBe(5);
      expect(result.totalElements).toBe(50);
    });

    it("should use default pagination values", async () => {
      const mockResponse: Page<IPost> = {
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0,
        size: 10,
      };

      (axios.get as any).mockResolvedValue({ data: mockResponse });

      await repository.getAll();

      expect(axios.get).toHaveBeenCalledWith(
        "http://api.test/posts?page=0&size=10",
        { headers: mockAuthHeaders }
      );
    });

    it("should handle custom page and size parameters", async () => {
      const mockResponse: Page<IPost> = {
        content: [],
        totalPages: 10,
        totalElements: 200,
        number: 3,
        size: 20,
      };

      (axios.get as any).mockResolvedValue({ data: mockResponse });

      await repository.getAll(3, 20);

      expect(axios.get).toHaveBeenCalledWith(
        "http://api.test/posts?page=3&size=20",
        { headers: mockAuthHeaders }
      );
    });

    it("should normalize all posts in the response", async () => {
      const mockPosts = [
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" },
      ];

      const mockResponse = {
        content: mockPosts,
        totalPages: 1,
        totalElements: 2,
        number: 0,
        size: 10,
      };

      (axios.get as any).mockResolvedValue({ data: mockResponse });

      await repository.getAll();

      expect(normalizeModule.normalizeArray).toHaveBeenCalledWith(mockPosts);
      expect(normalizeModule.normalizeItem).toHaveBeenCalledTimes(2);
    });

    it("should handle error in getAll", async () => {
      (axios.get as any).mockRejectedValue(new Error("Network error"));

      await expect(repository.getAll()).rejects.toThrow("Network error");
    });
  });

  describe("getById", () => {
    it("should fetch post by id successfully", async () => {
      const mockPost = {
        id: 1,
        title: "Test Post",
        message: "Test Content",
        userId: 1,
        location: "Test",
        loves: 0,
        comments: [],
        isArchived: false,
        tags: [],
        images: [],
        isPublished: true,
        alt_image: "",
        source_image: "",
        alt_avatar: "",
        source_avatar: "",
        userName: "user1",
        role: "USER",
        url_avatar: "",
        creationDate: "2024-01-01",
        updatedAt: "2024-01-01",
        createdAt: "2024-01-01",
        description: "Description",
        ondelete: () => {},
      };

      (axios.get as any).mockResolvedValue({ data: mockPost });

      const result = await repository.getById(1);

      expect(axios.get).toHaveBeenCalledWith("http://api.test/posts/1", {
        headers: mockAuthHeaders,
      });
      expect(normalizeModule.normalizeItem).toHaveBeenCalledWith(mockPost);
      expect(result).toEqual(mockPost);
    });

    it("should handle 404 error", async () => {
      (axios.get as any).mockRejectedValue(new Error("Post not found"));

      await expect(repository.getById(999)).rejects.toThrow("Post not found");
    });
  });

  describe("create", () => {
    it("should create post successfully", async () => {
      const newPost: IPostDTO = {
        id: 5,
        title: "New Post",
        message: "New Content",
        userId: 1,
        location: "Test",
        loves: 0,
        comments: [],
        isArchived: false,
        images: [],
        isPublished: true,
        alt_image: "",
        source_image: "",
        alt_avatar: "",
        source_avatar: "",
        userName: "user1",
        role: "USER",
        url_avatar: "",
        updatedAt: "2024-01-05",
        createdAt: "2024-01-05",
        description: "Description",
      };

      const createdPost = { ...newPost, ondelete: () => {} };

      (axios.post as any).mockResolvedValue({ data: createdPost });

      const result = await repository.create(newPost);

      expect(axios.post).toHaveBeenCalledWith(
        "http://api.test/posts",
        newPost,
        {
          headers: {
            ...mockAuthHeaders,
            "Content-Type": "application/json",
          },
        }
      );
      expect(result).toEqual(createdPost);
    });

    it("should include Content-Type header", async () => {
      const newPost: IPostDTO = { title: "Test" } as IPostDTO;
      (axios.post as any).mockResolvedValue({ data: {} });

      await repository.create(newPost);

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        {
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }
      );
    });

    it("should handle validation error", async () => {
      const invalidPost: IPostDTO = { title: "" } as IPostDTO;
      (axios.post as any).mockRejectedValue(new Error("Validation error"));

      await expect(repository.create(invalidPost)).rejects.toThrow(
        "Validation error"
      );
    });
  });

  describe("update", () => {
    it("should update post successfully", async () => {
      const updateData: IPostDTO = {
        id: 1,
        title: "Updated Title",
        message: "Updated Content",
        userId: 1,
        location: "Test",
        loves: 0,
        comments: [],
        isArchived: false,
        images: [],
        isPublished: true,
        alt_image: "",
        source_image: "",
        alt_avatar: "",
        source_avatar: "",
        userName: "user1",
        role: "USER",
        url_avatar: "",
        updatedAt: "2024-01-05",
        createdAt: "2024-01-01",
        description: "Description",
      };

      const updatedPost = { ...updateData, ondelete: () => {} };

      (axios.put as any).mockResolvedValue({ data: updatedPost });

      const result = await repository.update(1, updateData);

      expect(axios.put).toHaveBeenCalledWith(
        "http://api.test/posts/1",
        updateData,
        { headers: mockAuthHeaders }
      );
      expect(result).toEqual(updatedPost);
    });

    it("should handle 404 error in update", async () => {
      (axios.put as any).mockRejectedValue(new Error("Post not found"));

      await expect(repository.update(999, {} as IPostDTO)).rejects.toThrow(
        "Post not found"
      );
    });

    it("should handle unauthorized error", async () => {
      (axios.put as any).mockRejectedValue(new Error("Unauthorized"));

      await expect(repository.update(1, {} as IPostDTO)).rejects.toThrow(
        "Unauthorized"
      );
    });
  });

  describe("delete", () => {
    it("should delete post successfully", async () => {
      (axios.delete as any).mockResolvedValue({});

      await repository.delete(1);

      expect(axios.delete).toHaveBeenCalledWith("http://api.test/posts/1", {
        headers: mockAuthHeaders,
      });
    });

    it("should handle 404 error in delete", async () => {
      (axios.delete as any).mockRejectedValue(new Error("Post not found"));

      await expect(repository.delete(999)).rejects.toThrow("Post not found");
    });

    it("should handle forbidden error", async () => {
      (axios.delete as any).mockRejectedValue(new Error("Forbidden"));

      await expect(repository.delete(1)).rejects.toThrow("Forbidden");
    });
  });

  describe("archive", () => {
    it("should archive post successfully", async () => {
      (axios.patch as any).mockResolvedValue({});

      await repository.archive(1, true);

      expect(axios.patch).toHaveBeenCalledWith(
        "http://api.test/posts/1/archive?archive=true",
        null,
        { headers: mockAuthHeaders }
      );
    });

    it("should unarchive post successfully", async () => {
      (axios.patch as any).mockResolvedValue({});

      await repository.archive(1, false);

      expect(axios.patch).toHaveBeenCalledWith(
        "http://api.test/posts/1/archive?archive=false",
        null,
        { headers: mockAuthHeaders }
      );
    });

    it("should handle error in archive", async () => {
      (axios.patch as any).mockRejectedValue(new Error("Failed to archive"));

      await expect(repository.archive(1, true)).rejects.toThrow(
        "Failed to archive"
      );
    });

    it("should pass null as body to patch request", async () => {
      (axios.patch as any).mockResolvedValue({});

      await repository.archive(5, true);

      expect(axios.patch).toHaveBeenCalledWith(
        expect.any(String),
        null,
        expect.any(Object)
      );
    });
  });

  describe("URI configuration", () => {
    it("should correctly set uri from environment variable", () => {
      expect(repository.uri).toBe("http://api.test/posts");
    });
  });
});
