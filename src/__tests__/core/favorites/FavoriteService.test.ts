import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EventLoveService from "../../../core/favorites/EventLoveService";
import { LoveRepository } from "../../../core/favorites/LoveRepository";
import PostLoveService from "../../../core/favorites/PostLoveService";

vi.mock("axios");
vi.mock("../../../core/auth/AuthHeaders", () => ({
  getAuthHeaders: vi.fn(() => ({ Authorization: "Bearer test-token" })),
}));

describe("LoveRepository", () => {
  let repository: LoveRepository;
  const mockUri = "http://api.test/items";

  beforeEach(() => {
    repository = new LoveRepository(mockUri);
    vi.clearAllMocks();
  });

  describe("getLovesCount", () => {
    it("should get loves count for an item", async () => {
      const mockCount = 42;
      (axios.get as any).mockResolvedValueOnce({ data: mockCount });

      const result = await repository.getLovesCount(1);

      expect(result).toBe(mockCount);
      expect(axios.get).toHaveBeenCalledWith(`${mockUri}/1/loves/count`, {
        headers: { Authorization: "Bearer test-token" },
      });
    });

    it("should handle zero loves count", async () => {
      (axios.get as any).mockResolvedValueOnce({ data: 0 });

      const result = await repository.getLovesCount(1);

      expect(result).toBe(0);
    });
  });

  describe("giveLove", () => {
    it("should give love without userId", async () => {
      (axios.put as any).mockResolvedValueOnce({});

      await repository.giveLove(1);

      expect(axios.put).toHaveBeenCalledWith(`${mockUri}/1/love`, null, {
        headers: { Authorization: "Bearer test-token" },
      });
    });

    it("should give love with userId", async () => {
      (axios.put as any).mockResolvedValueOnce({});

      await repository.giveLove(1, 123);

      expect(axios.put).toHaveBeenCalledWith(
        `${mockUri}/1/love?userId=123`,
        null,
        {
          headers: { Authorization: "Bearer test-token" },
        }
      );
    });
  });

  describe("removeLove", () => {
    it("should remove love with userId", async () => {
      (axios.put as any).mockResolvedValueOnce({});

      await repository.removeLove(1, 123);

      expect(axios.put).toHaveBeenCalledWith(
        `${mockUri}/1/unlove?userId=123`,
        null,
        {
          headers: { Authorization: "Bearer test-token" },
        }
      );
    });
  });
});

describe("EventLoveService", () => {
  let service: EventLoveService;
  const mockEventsUri = "http://api.test/events";

  beforeEach(() => {
    vi.stubEnv("VITE_API_ENDPOINT_EVENTS", mockEventsUri);
    service = new EventLoveService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("giveLoveRegistered", () => {
    it("should give love as registered user", async () => {
      (axios.put as any).mockResolvedValueOnce({});

      await service.giveLoveRegistered(1, 123);

      expect(axios.put).toHaveBeenCalledWith(
        `${mockEventsUri}/1/love?profileId=123`,
        null,
        {
          headers: { Authorization: "Bearer test-token" },
        }
      );
    });
  });

  describe("giveLoveAnonymous", () => {
    it("should give love as anonymous user", async () => {
      (axios.put as any).mockResolvedValueOnce({});

      await service.giveLoveAnonymous(1);

      expect(axios.put).toHaveBeenCalledWith(
        `${mockEventsUri}/1/love-anon`,
        null,
        {
          headers: { Authorization: "Bearer test-token" },
        }
      );
    });
  });

  describe("inherited methods", () => {
    it("should inherit getLovesCount from LoveRepository", async () => {
      (axios.get as any).mockResolvedValueOnce({ data: 10 });

      const result = await service.getLovesCount(1);

      expect(result).toBe(10);
      expect(axios.get).toHaveBeenCalledWith(`${mockEventsUri}/1/loves/count`, {
        headers: { Authorization: "Bearer test-token" },
      });
    });

    it("should inherit giveLove from LoveRepository", async () => {
      (axios.put as any).mockResolvedValueOnce({});

      await service.giveLove(1, 123);

      expect(axios.put).toHaveBeenCalled();
    });

    it("should inherit removeLove from LoveRepository", async () => {
      (axios.put as any).mockResolvedValueOnce({});

      await service.removeLove(1, 123);

      expect(axios.put).toHaveBeenCalled();
    });
  });
});

describe("PostLoveService", () => {
  let service: PostLoveService;
  const mockPostsUri = "http://api.test/posts";

  beforeEach(() => {
    vi.stubEnv("VITE_API_ENDPOINT_POSTS", mockPostsUri);
    service = new PostLoveService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("inherited methods", () => {
    it("should inherit getLovesCount from LoveRepository", async () => {
      (axios.get as any).mockResolvedValueOnce({ data: 25 });

      const result = await service.getLovesCount(5);

      expect(result).toBe(25);
      expect(axios.get).toHaveBeenCalledWith(`${mockPostsUri}/5/loves/count`, {
        headers: { Authorization: "Bearer test-token" },
      });
    });

    it("should inherit giveLove from LoveRepository", async () => {
      (axios.put as any).mockResolvedValueOnce({});

      await service.giveLove(5, 456);

      expect(axios.put).toHaveBeenCalledWith(
        `${mockPostsUri}/5/love?userId=456`,
        null,
        {
          headers: { Authorization: "Bearer test-token" },
        }
      );
    });

    it("should inherit removeLove from LoveRepository", async () => {
      (axios.put as any).mockResolvedValueOnce({});

      await service.removeLove(5, 456);

      expect(axios.put).toHaveBeenCalledWith(
        `${mockPostsUri}/5/unlove?userId=456`,
        null,
        {
          headers: { Authorization: "Bearer test-token" },
        }
      );
    });
  });
});
