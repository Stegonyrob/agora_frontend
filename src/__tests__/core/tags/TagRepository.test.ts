import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as AuthHeaders from "../../../core/auth/AuthHeaders";
import {
  ICreateTagRequest,
  ICreateTagResponse,
} from "../../../core/tags/ICreateTagRequest";
import { ITag } from "../../../core/tags/ITag";
import TagRepository from "../../../core/tags/TagRepository";

vi.mock("axios");
vi.mock("../../../core/auth/AuthHeaders");

describe("TagRepository", () => {
  let repository: TagRepository;
  const mockHeaders = { Authorization: "Bearer test-token" };

  const mockTags: ITag[] = [
    { id: 1, name: "Tag1", archived: false },
    { id: 2, name: "Tag2", archived: false },
  ];

  beforeEach(() => {
    vi.stubEnv(
      "VITE_API_ENDPOINT_TAGS_BY_EVENT_PUBLIC",
      "http://api.test/public/tags"
    );
    vi.stubEnv(
      "VITE_API_ENDPOINT_TAGS_BY_EVENT_PRIVATE",
      "http://api.test/private/tags"
    );
    vi.stubEnv("VITE_API_ENDPOINT_POST_TAGS", "http://api.test/post-tags");
    vi.stubEnv("VITE_API_ENDPOINT_TAGS", "http://api.test/tags");
    vi.stubEnv("VITE_API_ENDPOINT_EVENT_TAGS", "http://api.test/event-tags");
    vi.stubEnv("VITE_API_ENDPOINT_GENERAL", "http://api.test");

    (AuthHeaders.getAuthHeaders as any).mockReturnValue(mockHeaders);
    repository = new TagRepository();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("getAllTags", () => {
    it("should fetch all tags from public endpoint", async () => {
      (axios.get as any).mockResolvedValueOnce({ data: mockTags });

      const result = await repository.getAllTags();

      expect(result).toEqual(mockTags);
      expect(axios.get).toHaveBeenCalledWith("http://api.test/public/tags");
    });

    it("should return empty array if no tags", async () => {
      (axios.get as any).mockResolvedValueOnce({ data: null });

      const result = await repository.getAllTags();

      expect(result).toEqual([]);
    });

    it("should throw error on failure", async () => {
      const error = new Error("Network error");
      (axios.get as any).mockRejectedValueOnce(error);

      await expect(repository.getAllTags()).rejects.toThrow("Network error");
    });
  });

  describe("getEventsByTag", () => {
    it("should fetch events by tag name with auth", async () => {
      const mockEvents = [{ id: 1, title: "Event 1" }];
      (axios.get as any).mockResolvedValueOnce({ data: mockEvents });

      const result = await repository.getEventsByTag("TestTag");

      expect(result).toEqual(mockEvents);
      expect(axios.get).toHaveBeenCalledWith(
        "http://api.test/private/tags/TestTag",
        { headers: mockHeaders }
      );
    });

    it("should encode tag name in URL", async () => {
      (axios.get as any).mockResolvedValueOnce({ data: [] });

      await repository.getEventsByTag("Tag With Spaces");

      expect(axios.get).toHaveBeenCalledWith(
        "http://api.test/private/tags/Tag%20With%20Spaces",
        { headers: mockHeaders }
      );
    });
  });

  describe("getTagsByEvent", () => {
    it("should fetch tags for an event with auth", async () => {
      (axios.get as any).mockResolvedValueOnce({ data: mockTags });

      const result = await repository.getTagsByEvent(1);

      expect(result).toEqual(mockTags);
      expect(axios.get).toHaveBeenCalledWith(
        "http://api.test/event-tags/events/1/tags",
        { headers: mockHeaders }
      );
    });

    it("should use fallback URL if event tags URL not set", async () => {
      vi.stubEnv("VITE_API_ENDPOINT_EVENT_TAGS", "");
      repository = new TagRepository();
      (axios.get as any).mockResolvedValueOnce({ data: mockTags });

      await repository.getTagsByEvent(1);

      expect(axios.get).toHaveBeenCalledWith(
        "http://api.test/any/tags/events/1/tags",
        { headers: mockHeaders }
      );
    });
  });

  describe("getTagsByPost", () => {
    it("should fetch tags for a post with auth", async () => {
      (axios.get as any).mockResolvedValueOnce({ data: mockTags });

      const result = await repository.getTagsByPost(1);

      expect(result).toEqual(mockTags);
      expect(axios.get).toHaveBeenCalledWith(
        "http://api.test/post-tags/posts/1/tags",
        { headers: mockHeaders }
      );
    });

    it("should use fallback URL if post tags URL not set", async () => {
      vi.stubEnv("VITE_API_ENDPOINT_POST_TAGS", "");
      repository = new TagRepository();
      (axios.get as any).mockResolvedValueOnce({ data: mockTags });

      await repository.getTagsByPost(1);

      expect(axios.get).toHaveBeenCalledWith(
        "http://api.test/any/tags/posts/1/tags",
        { headers: mockHeaders }
      );
    });
  });

  describe("createTag", () => {
    it("should create a new tag with auth", async () => {
      const request: ICreateTagRequest = { name: "NewTag" };
      const response: ICreateTagResponse = {
        id: 3,
        name: "NewTag",
        archived: false,
      };
      (axios.post as any).mockResolvedValueOnce({ data: response });

      const result = await repository.createTag(request);

      expect(result).toEqual(response);
      expect(axios.post).toHaveBeenCalledWith("http://api.test/tags", request, {
        headers: mockHeaders,
      });
    });

    it("should throw error on creation failure", async () => {
      const error = new Error("Creation failed");
      (axios.post as any).mockRejectedValueOnce(error);

      await expect(repository.createTag({ name: "NewTag" })).rejects.toThrow(
        "Creation failed"
      );
    });
  });

  describe("addTagsToEvent", () => {
    it("should add multiple tags to event with auth", async () => {
      const tags = [
        { id: 1, name: "Tag1", archived: false },
        { id: 2, name: "Tag2", archived: false },
      ];
      (axios.post as any).mockResolvedValueOnce({ data: {} });

      await repository.addTagsToEvent(1, tags);

      expect(axios.post).toHaveBeenCalledWith(
        "http://api.test/event-tags/events/1/tags",
        { tags },
        { headers: mockHeaders }
      );
    });
  });

  describe("addTagsToPost", () => {
    it("should add multiple tags to post with auth", async () => {
      const tags = [
        { id: 1, name: "Tag1", archived: false },
        { id: 2, name: "Tag2", archived: false },
      ];
      (axios.post as any).mockResolvedValueOnce({ data: {} });

      await repository.addTagsToPost(1, tags);

      expect(axios.post).toHaveBeenCalledWith(
        "http://api.test/post-tags/posts/1/tags",
        { tags },
        { headers: mockHeaders }
      );
    });
  });

  describe("removeTagFromEvent", () => {
    it("should remove tag from event with auth", async () => {
      (axios.delete as any).mockResolvedValueOnce({ data: {} });

      await repository.removeTagFromEvent(1, "TagToRemove");

      expect(axios.delete).toHaveBeenCalledWith(
        "http://api.test/event-tags/events/1/tags/TagToRemove",
        { headers: mockHeaders }
      );
    });

    it("should encode tag name in URL", async () => {
      (axios.delete as any).mockResolvedValueOnce({ data: {} });

      await repository.removeTagFromEvent(1, "Tag With Spaces");

      expect(axios.delete).toHaveBeenCalledWith(
        "http://api.test/event-tags/events/1/tags/Tag%20With%20Spaces",
        { headers: mockHeaders }
      );
    });
  });

  describe("removeTagFromPost", () => {
    it("should remove tag from post with auth", async () => {
      (axios.delete as any).mockResolvedValueOnce({ data: {} });

      await repository.removeTagFromPost(1, "TagToRemove");

      expect(axios.delete).toHaveBeenCalledWith(
        "http://api.test/post-tags/posts/1/tags/TagToRemove",
        { headers: mockHeaders }
      );
    });
  });

  describe("clearTagsFromPost", () => {
    it("should clear all tags from post with auth", async () => {
      (axios.delete as any).mockResolvedValueOnce({ data: {} });

      await repository.clearTagsFromPost(1);

      expect(axios.delete).toHaveBeenCalledWith(
        "http://api.test/post-tags/posts/1/tags",
        { headers: mockHeaders }
      );
    });
  });

  describe("clearTagsFromEvent", () => {
    it("should clear all tags from event with auth", async () => {
      (axios.delete as any).mockResolvedValueOnce({ data: {} });

      await repository.clearTagsFromEvent(1);

      expect(axios.delete).toHaveBeenCalledWith(
        "http://api.test/event-tags/events/1/tags",
        { headers: mockHeaders }
      );
    });
  });

  describe("replaceTagsInPost", () => {
    it("should clear, add, and verify tags for post", async () => {
      const tags = [
        { id: 1, name: "Tag1", archived: false },
        { id: 2, name: "Tag2", archived: false },
      ];
      (axios.delete as any).mockResolvedValueOnce({ data: {} });
      (axios.post as any).mockResolvedValueOnce({ data: {} });
      (axios.get as any).mockResolvedValueOnce({ data: tags });

      await repository.replaceTagsInPost(1, tags);

      expect(axios.delete).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalled();
    });

    it("should throw error if clear fails", async () => {
      const error = new Error("Clear failed");
      (axios.delete as any).mockRejectedValueOnce(error);

      await expect(repository.replaceTagsInPost(1, [])).rejects.toThrow(
        "Clear failed"
      );
    });
  });

  describe("replaceTagsInEvent", () => {
    it("should clear, add, and verify tags for event", async () => {
      const tags = [
        { id: 1, name: "Tag1", archived: false },
        { id: 2, name: "Tag2", archived: false },
      ];
      (axios.delete as any).mockResolvedValueOnce({ data: {} });
      (axios.post as any).mockResolvedValueOnce({ data: {} });
      (axios.get as any).mockResolvedValueOnce({ data: tags });

      await repository.replaceTagsInEvent(1, tags);

      expect(axios.delete).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalled();
    });
  });

  describe("archiveTag", () => {
    it("should archive a tag with auth", async () => {
      const archivedTag = { id: 1, name: "Tag1", archived: true };
      (axios.patch as any).mockResolvedValueOnce({ data: archivedTag });

      const result = await repository.archiveTag(1, true);

      expect(result).toEqual(archivedTag);
      expect(axios.patch).toHaveBeenCalledWith(
        "http://api.test/tags/1/archive",
        { archived: true },
        { headers: mockHeaders }
      );
    });

    it("should unarchive a tag", async () => {
      const unarchivedTag = { id: 1, name: "Tag1", archived: false };
      (axios.patch as any).mockResolvedValueOnce({ data: unarchivedTag });

      const result = await repository.archiveTag(1, false);

      expect(result).toEqual(unarchivedTag);
      expect(axios.patch).toHaveBeenCalledWith(
        "http://api.test/tags/1/archive",
        { archived: false },
        { headers: mockHeaders }
      );
    });
  });
});
