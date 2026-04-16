import { beforeEach, describe, expect, it, vi } from "vitest";
import { ITag } from "../../../core/tags/ITag";
import TagRepository from "../../../core/tags/TagRepository";
import TagService from "../../../core/tags/TagService";

vi.mock("../../../core/tags/TagRepository");

const createDelayedResolvePromise = (delay = 5000) =>
  new Promise<void>((resolve) => setTimeout(resolve, delay));

const createDelayedRejectPromise = (error: Error, delay = 3000) =>
  new Promise<never>((_, reject) => setTimeout(() => reject(error), delay));

describe("TagService", () => {
  let service: TagService;
  let mockRepository: any;

  const mockTags: ITag[] = [
    { id: 1, name: "Taller", archived: false },
    { id: 2, name: "Neurodiversidad", archived: false },
    { id: 3, name: "Educación", archived: false },
    { id: 4, name: "ArchivedTag", archived: true },
  ];

  beforeEach(() => {
    mockRepository = {
      getAllTags: vi.fn(),
      createTag: vi.fn(),
      archiveTag: vi.fn(),
      getTagsByEvent: vi.fn(),
      getTagsByPost: vi.fn(),
      getPostsByTag: vi.fn(),
      getEventsByTag: vi.fn(),
      addTagsToEvent: vi.fn(),
      addTagsToPost: vi.fn(),
      addTagToPost: vi.fn(),
      removeTagFromEvent: vi.fn(),
      removeTagFromPost: vi.fn(),
      replaceTagsInPost: vi.fn(),
      replaceTagsInEvent: vi.fn(),
    };

    (TagRepository as any).mockImplementation(() => mockRepository);
    service = new TagService();
    vi.clearAllMocks();
  });

  describe("getAllTags", () => {
    it("should get all tags from repository", async () => {
      mockRepository.getAllTags.mockResolvedValueOnce(mockTags);

      const result = await service.getAllTags();

      expect(result).toEqual(mockTags);
      expect(mockRepository.getAllTags).toHaveBeenCalled();
    });
  });

  describe("getActiveTags", () => {
    it("should filter out archived tags", async () => {
      mockRepository.getAllTags.mockResolvedValueOnce(mockTags);

      const result = await service.getActiveTags();

      expect(result).toHaveLength(3);
      expect(result.every((tag) => !tag.archived)).toBe(true);
      expect(result.find((tag) => tag.name === "ArchivedTag")).toBeUndefined();
    });
  });

  describe("getPopularTags", () => {
    it("should return popular tags from backend", async () => {
      mockRepository.getAllTags.mockResolvedValueOnce(mockTags);

      it("should return fallback tags on timeout", async () => {
        const timeoutPromise = createDelayedResolvePromise(5000);
        mockRepository.getAllTags.mockImplementationOnce(() => timeoutPromise);

        const result = await service.getPopularTags();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(10);
        expect(result.every((tag) => tag.id < 0)).toBe(true);
      });
      const result = await service.getPopularTags();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(10);
      expect(result.every((tag) => tag.id < 0)).toBe(true);
    });

    it("should prioritize predefined popular tags", async () => {
      const tagsWithPopular = [
        { id: 1, name: "Taller", archived: false },
        { id: 2, name: "Neurodiversidad", archived: false },
        { id: 5, name: "RandomTag", archived: false },
      ];
      mockRepository.getAllTags.mockResolvedValueOnce(tagsWithPopular);

      const result = await service.getPopularTags();

      const firstTags = result.slice(0, 2).map((t) => t.name);
      expect(firstTags).toContain("Taller");
      expect(firstTags).toContain("Neurodiversidad");
    });
  });

  describe("createTag", () => {
    it("should create a new tag", async () => {
      const newTag = { id: 5, name: "NewTag", archived: false };
      mockRepository.createTag.mockResolvedValueOnce(newTag);

      const result = await service.createTag({
        name: "NewTag",
        archived: false,
      });

      expect(result).toEqual(newTag);
      expect(mockRepository.createTag).toHaveBeenCalledWith({
        name: "NewTag",
        archived: false,
      });
    });

    it("should create tag with archived false by default", async () => {
      const newTag = { id: 6, name: "AnotherTag", archived: false };
      mockRepository.createTag.mockResolvedValueOnce(newTag);

      await service.createTag({ name: "AnotherTag" } as any);

      expect(mockRepository.createTag).toHaveBeenCalledWith({
        name: "AnotherTag",
        archived: false,
      });
    });
  });

  describe("findTagByName", () => {
    it("should find tag by name case-insensitive", async () => {
      mockRepository.getAllTags.mockResolvedValueOnce(mockTags);

      const result = await service.findTagByName("taller");

      expect(result).toEqual(mockTags[0]);
    });

    it("should return null if tag not found", async () => {
      mockRepository.getAllTags.mockResolvedValueOnce(mockTags);

      const result = await service.findTagByName("NonExistent");
      it("should return virtual tag for predefined tags on timeout", async () => {
        const timeoutError = new Error("Timeout");
        const timeoutPromise = createDelayedRejectPromise(timeoutError, 3000);
        mockRepository.getAllTags.mockImplementationOnce(() => timeoutPromise);

        const result = await service.findTagByName("Taller");

        expect(result).not.toBeNull();
        expect(result?.name).toBe("Taller");
        expect(result?.id).toBeLessThan(0);
      });
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Taller");
      expect(result?.id).toBeLessThan(0);
    });
  });

  describe("getOrCreateTag", () => {
    it("should return existing tag if found", async () => {
      mockRepository.getAllTags.mockResolvedValueOnce(mockTags);

      const result = await service.getOrCreateTag("Taller");

      expect(result).toEqual(mockTags[0]);
      expect(mockRepository.createTag).not.toHaveBeenCalled();
    });

    it("should create new tag if not found", async () => {
      mockRepository.getAllTags.mockResolvedValueOnce(mockTags);
      const newTag = { id: 7, name: "NewTag", archived: false };
      mockRepository.createTag.mockResolvedValueOnce(newTag);

      const result = await service.getOrCreateTag("NewTag");

      expect(result).toEqual(newTag);
      expect(mockRepository.createTag).toHaveBeenCalledWith({
        name: "NewTag",
        archived: false,
      });
    });
  });

  describe("getOrCreateTags", () => {
    it("should get or create multiple tags", async () => {
      mockRepository.getAllTags.mockResolvedValue(mockTags);
      const newTag = { id: 8, name: "Tag3", archived: false };
      mockRepository.createTag.mockResolvedValueOnce(newTag);

      const result = await service.getOrCreateTags([
        "Taller",
        "Neurodiversidad",
        "Tag3",
      ]);

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("Taller");
      expect(result[1].name).toBe("Neurodiversidad");
      expect(result[2].name).toBe("Tag3");
    });

    it("should skip empty tag names", async () => {
      mockRepository.getAllTags.mockResolvedValue(mockTags);

      const result = await service.getOrCreateTags([
        "Taller",
        "",
        "  ",
        "Educación",
      ]);

      expect(result).toHaveLength(2);
    });
  });

  describe("archiveTag", () => {
    it("should archive a tag", async () => {
      const archivedTag = { id: 1, name: "Taller", archived: true };
      mockRepository.archiveTag.mockResolvedValueOnce(archivedTag);

      const result = await service.archiveTag(1, true);

      expect(result).toEqual(archivedTag);
      expect(mockRepository.archiveTag).toHaveBeenCalledWith(1, true);
    });
  });

  describe("getTagsByEvent", () => {
    it("should get tags for an event", async () => {
      mockRepository.getTagsByEvent.mockResolvedValueOnce(mockTags);

      const result = await service.getTagsByEvent(1);

      expect(result).toEqual(mockTags);
      expect(mockRepository.getTagsByEvent).toHaveBeenCalledWith(1);
    });
  });

  describe("getTagsByPost", () => {
    it("should get tags for a post", async () => {
      mockRepository.getTagsByPost.mockResolvedValueOnce(mockTags);

      const result = await service.getTagsByPost(1);

      expect(result).toEqual(mockTags);
      expect(mockRepository.getTagsByPost).toHaveBeenCalledWith(1);
    });
  });

  describe("addTagsToEvent", () => {
    it("should add multiple tags to event", async () => {
      const tags = [
        { id: 1, name: "Tag1", archived: false },
        { id: 2, name: "Tag2", archived: false },
      ];
      mockRepository.addTagsToEvent.mockResolvedValueOnce(undefined);

      await service.addTagsToEvent(1, tags);

      expect(mockRepository.addTagsToEvent).toHaveBeenCalledWith(1, tags);
    });
  });

  describe("addTagsToPost", () => {
    it("should add multiple tags to post", async () => {
      const tags = [
        { id: 1, name: "Tag1", archived: false },
        { id: 2, name: "Tag2", archived: false },
      ];
      mockRepository.addTagsToPost.mockResolvedValueOnce(undefined);

      await service.addTagsToPost(1, tags);

      expect(mockRepository.addTagsToPost).toHaveBeenCalledWith(1, tags);
    });
  });

  describe("replaceTagsInPost", () => {
    it("should replace tags in post", async () => {
      const tags = [
        { id: 1, name: "NewTag1", archived: false },
        { id: 2, name: "NewTag2", archived: false },
      ];
      mockRepository.replaceTagsInPost.mockResolvedValueOnce(undefined);

      await service.replaceTagsInPost(1, tags);

      expect(mockRepository.replaceTagsInPost).toHaveBeenCalledWith(1, tags);
    });

    it("should log warning when replacing with empty array", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      mockRepository.replaceTagsInPost.mockResolvedValueOnce(undefined);

      await service.replaceTagsInPost(1, []);

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("replaceTagsInEvent", () => {
    it("should replace tags in event", async () => {
      const tags = [
        { id: 1, name: "NewTag1", archived: false },
        { id: 2, name: "NewTag2", archived: false },
      ];
      mockRepository.replaceTagsInEvent.mockResolvedValueOnce(undefined);

      await service.replaceTagsInEvent(1, tags);

      expect(mockRepository.replaceTagsInEvent).toHaveBeenCalledWith(1, tags);
    });

    it("should log warning when replacing with empty array", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      mockRepository.replaceTagsInEvent.mockResolvedValueOnce(undefined);

      await service.replaceTagsInEvent(1, []);

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("removeTagFromEvent", () => {
    it("should remove tag from event", async () => {
      mockRepository.removeTagFromEvent.mockResolvedValueOnce(undefined);

      await service.removeTagFromEvent(1, "Taller");

      expect(mockRepository.removeTagFromEvent).toHaveBeenCalledWith(
        1,
        "Taller"
      );
    });
  });

  describe("removeTagFromPost", () => {
    it("should remove tag from post", async () => {
      mockRepository.removeTagFromPost.mockResolvedValueOnce(undefined);

      await service.removeTagFromPost(1, "Taller");

      expect(mockRepository.removeTagFromPost).toHaveBeenCalledWith(
        1,
        "Taller"
      );
    });
  });
});
