import { describe, expect, it } from "vitest";
import {
  normalizeArray,
  normalizeDate,
  normalizeItem,
  normalizePostImages,
  normalizeString,
  normalizeTags,
} from "../../../core/normalization/normalizeApiResponse";

describe("normalizeApiResponse", () => {
  describe("normalizeArray", () => {
    it("should return array when input is array", () => {
      const input = [1, 2, 3];
      const result = normalizeArray(input);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should return empty array when input is null", () => {
      const result = normalizeArray(null);
      expect(result).toEqual([]);
    });

    it("should return empty array when input is undefined", () => {
      const result = normalizeArray(undefined);
      expect(result).toEqual([]);
    });

    it("should return empty array when input is not an array", () => {
      const result = normalizeArray("not an array" as any);
      expect(result).toEqual([]);
    });

    it("should handle empty array", () => {
      const result = normalizeArray([]);
      expect(result).toEqual([]);
    });
  });

  describe("normalizeString", () => {
    it("should return string when input is string", () => {
      const result = normalizeString("test");
      expect(result).toBe("test");
    });

    it("should return empty string when input is null", () => {
      const result = normalizeString(null);
      expect(result).toBe("");
    });

    it("should return empty string when input is undefined", () => {
      const result = normalizeString(undefined);
      expect(result).toBe("");
    });

    it("should return empty string when input is number", () => {
      const result = normalizeString(123 as any);
      expect(result).toBe("");
    });

    it("should handle empty string", () => {
      const result = normalizeString("");
      expect(result).toBe("");
    });
  });

  describe("normalizeDate", () => {
    it("should return string date when input is string", () => {
      const input = "2024-01-15T10:30:00Z";
      const result = normalizeDate(input);
      expect(result).toBe("2024-01-15T10:30:00Z");
    });

    it("should convert array to ISO string", () => {
      const input = [2024, 1, 15, 10, 30, 0];
      const result = normalizeDate(input);
      expect(result).toContain("2024-01-15");
    });

    it("should handle array without time components", () => {
      const input = [2024, 1, 15];
      const result = normalizeDate(input);
      expect(result).toMatch(/2024-01-(14|15)/); // Depends on timezone
    });

    it("should handle array with partial time components", () => {
      const input = [2024, 1, 15, 10];
      const result = normalizeDate(input);
      expect(result).toContain("2024-01-15");
    });

    it("should return empty string when input is null", () => {
      const result = normalizeDate(null);
      expect(result).toBe("");
    });

    it("should return empty string when input is undefined", () => {
      const result = normalizeDate(undefined);
      expect(result).toBe("");
    });

    it("should return empty string for invalid input", () => {
      const result = normalizeDate({} as any);
      expect(result).toBe("");
    });
  });

  describe("normalizeTags", () => {
    it("should return array when tags is array", () => {
      const tags = [
        { id: 1, name: "Tag1" },
        { id: 2, name: "Tag2" },
      ];
      const result = normalizeTags(tags);
      expect(result).toEqual(tags);
    });

    it("should return empty array when tags is null", () => {
      const result = normalizeTags(null);
      expect(result).toEqual([]);
    });

    it("should return empty array when tags is undefined", () => {
      const result = normalizeTags(undefined);
      expect(result).toEqual([]);
    });

    it("should return empty array when tags is not array", () => {
      const result = normalizeTags("not array");
      expect(result).toEqual([]);
    });

    it("should handle empty array", () => {
      const result = normalizeTags([]);
      expect(result).toEqual([]);
    });
  });

  describe("normalizePostImages", () => {
    it("should return empty array when images is null", () => {
      const result = normalizePostImages(null, 1);
      expect(result).toEqual([]);
    });

    it("should return empty array when images is undefined", () => {
      const result = normalizePostImages(undefined, 1);
      expect(result).toEqual([]);
    });

    it("should return objects as-is when they have IDs", () => {
      const images = [
        { id: 1, imageName: "image1.jpg", imageData: null, postId: 1 },
        { id: 2, imageName: "image2.jpg", imageData: null, postId: 1 },
      ];
      const result = normalizePostImages(images, 1);
      expect(result).toEqual(images);
    });

    it("should convert string array to mock objects", () => {
      const images = ["image1.jpg", "image2.jpg"];
      const result = normalizePostImages(images, 5);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: null,
        imageName: "image1.jpg",
        imageData: null,
        postId: 5,
        isMock: true,
      });
      expect(result[1]).toEqual({
        id: null,
        imageName: "image2.jpg",
        imageData: null,
        postId: 5,
        isMock: true,
      });
    });

    it("should handle empty array", () => {
      const result = normalizePostImages([], 1);
      expect(result).toEqual([]);
    });

    it("should return empty array for non-array input", () => {
      const result = normalizePostImages("not an array" as any, 1);
      expect(result).toEqual([]);
    });
  });

  describe("normalizeItem", () => {
    it("should normalize basic item structure", () => {
      const rawItem = {
        id: 1,
        title: "Test",
        description: "Description",
      };

      const result = normalizeItem(rawItem);

      expect(result.id).toBe(1);
      expect(result.title).toBe("Test");
      expect(result.tags).toEqual([]);
      expect(result.images).toEqual([]);
      expect(result.attendees).toEqual([]);
    });

    it("should extract item from nested structure", () => {
      const rawData = {
        item: {
          id: 1,
          title: "Test",
        },
      };

      const result = normalizeItem(rawData);

      expect(result.id).toBe(1);
      expect(result.title).toBe("Test");
    });

    it("should flatten profile properties", () => {
      const rawItem = {
        id: 1,
        profile: {
          username: "testuser",
          email: "test@example.com",
        },
        title: "Test",
      };

      const result = normalizeItem(rawItem);

      expect(result.username).toBe("testuser");
      expect(result.email).toBe("test@example.com");
      expect(result.title).toBe("Test");
      expect(result.profile).toBeUndefined();
    });

    it("should prioritize singular 'image' field over 'images'", () => {
      const rawItem = {
        id: 1,
        image: ["image1.jpg", "image2.jpg"],
        images: ["image3.jpg"],
      };

      const result = normalizeItem(rawItem);

      expect(result.images).toHaveLength(2);
      expect(result.images[0].imageName).toBe("image1.jpg");
    });

    it("should handle 'images' field when 'image' not present", () => {
      const rawItem = {
        id: 1,
        images: [
          { id: 1, imageName: "image1.jpg" },
          { id: 2, imageName: "image2.jpg" },
        ],
      };

      const result = normalizeItem(rawItem);

      expect(result.images).toHaveLength(2);
      expect(result.images[0].id).toBe(1);
    });

    it("should normalize tags from raw data", () => {
      const rawItem = {
        id: 1,
        tags: [
          { id: 1, name: "Tag1" },
          { id: 2, name: "Tag2" },
        ],
      };

      const result = normalizeItem(rawItem);

      expect(result.tags).toHaveLength(2);
      expect(result.tags[0].name).toBe("Tag1");
    });

    it("should normalize attendees array", () => {
      const rawItem = {
        id: 1,
        attendees: [{ id: 1, name: "User1" }],
      };

      const result = normalizeItem(rawItem);

      expect(result.attendees).toHaveLength(1);
      expect(result.attendees[0].name).toBe("User1");
    });

    it("should normalize date fields", () => {
      const rawItem = {
        id: 1,
        creationDate: [2024, 1, 15, 10, 30, 0],
        eventDate: "2024-02-20T18:00:00Z",
      };

      const result = normalizeItem(rawItem);

      expect(result.creationDate).toContain("2024-01-15");
      expect(result.eventDate).toBe("2024-02-20T18:00:00Z");
    });

    it("should normalize eventTime field", () => {
      const rawItem = {
        id: 1,
        eventTime: "18:00",
      };

      const result = normalizeItem(rawItem);

      expect(result.eventTime).toBe("18:00");
    });

    it("should include user field when present", () => {
      const rawItem = {
        id: 1,
        user: {
          id: 10,
          username: "testuser",
        },
      };

      const result = normalizeItem(rawItem);

      expect(result.user).toBeDefined();
      expect(result.user.username).toBe("testuser");
    });

    it("should include usuario field as user", () => {
      const rawItem = {
        id: 1,
        usuario: {
          id: 10,
          username: "testuser",
        },
      };

      const result = normalizeItem(rawItem);

      expect(result.user).toBeDefined();
      expect(result.user.username).toBe("testuser");
    });

    it("should apply extra defaults", () => {
      const rawItem = {
        id: 1,
        title: "Test",
      };

      const result = normalizeItem(rawItem, {
        status: "active",
        priority: "high",
      });

      expect(result.status).toBe("active");
      expect(result.priority).toBe("high");
    });

    it("should handle complex nested structure", () => {
      const rawData = {
        item: {
          id: 1,
          profile: {
            username: "user1",
            bio: "Test bio",
          },
          image: ["pic1.jpg", "pic2.jpg"],
          tags: [{ id: 1, name: "Tag1" }],
          attendees: [{ id: 1, name: "Attendee1" }],
          creationDate: [2024, 1, 15],
          eventDate: "2024-02-20T18:00:00Z",
          eventTime: "18:00",
          user: {
            id: 10,
            username: "author",
          },
        },
      };

      const result = normalizeItem(rawData);

      expect(result.id).toBe(1);
      expect(result.username).toBe("user1");
      expect(result.bio).toBe("Test bio");
      expect(result.images).toHaveLength(2);
      expect(result.tags).toHaveLength(1);
      expect(result.attendees).toHaveLength(1);
      expect(result.creationDate).toMatch(/2024-01-(14|15)/); // Depends on timezone
      expect(result.eventDate).toBe("2024-02-20T18:00:00Z");
      expect(result.eventTime).toBe("18:00");
      expect(result.user.username).toBe("author");
    });
  });
});
