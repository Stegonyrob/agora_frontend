import { describe, expect, it } from "vitest";
import { IPost } from "../../../core/posts/IPost";
import postsReducer, { fetchPosts } from "../../../core/posts/postStore";

describe("postStore", () => {
  const mockPosts: IPost[] = [
    {
      id: 1,
      title: "Test Post 1",
      description: "Description 1",
      message: "Content 1",
      userId: 1,
      location: "Test Location",
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
      userName: "testuser",
      role: "USER",
      url_avatar: "",
      creationDate: "2024-01-01",
      updatedAt: "2024-01-01",
      createdAt: "2024-01-01",
      ondelete: () => {},
    },
    {
      id: 2,
      title: "Test Post 2",
      description: "Description 2",
      message: "Content 2",
      userId: 2,
      location: "Test Location 2",
      loves: 5,
      comments: [],
      isArchived: false,
      tags: [],
      images: [],
      isPublished: true,
      alt_image: "",
      source_image: "",
      alt_avatar: "",
      source_avatar: "",
      userName: "testuser2",
      role: "USER",
      url_avatar: "",
      creationDate: "2024-01-02",
      updatedAt: "2024-01-02",
      createdAt: "2024-01-02",
      ondelete: () => {},
    },
  ];

  const mockPostsResponse = {
    content: mockPosts,
    totalPages: 5,
    totalElements: 50,
    number: 0,
    size: 10,
  };

  // Using the reducer directly in tests avoids TypeScript inferring unknown from
  // an untyped configureStore(). Tests focus on reducer behavior.

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = postsReducer(undefined, { type: "@@INIT" });

      expect(state.posts).toEqual([]);
      expect(state.totalPages).toBe(0);
      expect(state.page).toBe(0);
      expect(state.isLoaded).toBe(false);
    });
  });

  describe("reducer", () => {
    it("should handle fetchPosts.fulfilled action", () => {
      const action = {
        type: fetchPosts.fulfilled.type,
        payload: mockPostsResponse,
      };

      const state = postsReducer(undefined, action);

      expect(state.posts).toEqual(mockPosts);
      expect(state.totalPages).toBe(5);
      expect(state.page).toBe(0);
      expect(state.isLoaded).toBe(true);
    });

    it("should handle fetchPosts.fulfilled with empty response", () => {
      const emptyResponse = {
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0,
        size: 10,
      };

      const action = {
        type: fetchPosts.fulfilled.type,
        payload: emptyResponse,
      };

      const state = postsReducer(undefined, action);

      expect(state.posts).toEqual([]);
      expect(state.totalPages).toBe(0);
      expect(state.isLoaded).toBe(true);
    });

    it("should update state when receiving new page", () => {
      const firstPageAction = {
        type: fetchPosts.fulfilled.type,
        payload: mockPostsResponse,
      };

      let state = postsReducer(undefined, firstPageAction);
      expect(state.page).toBe(0);

      const secondPageResponse = {
        ...mockPostsResponse,
        content: [mockPosts[0]],
        number: 1,
      };

      const secondPageAction = {
        type: fetchPosts.fulfilled.type,
        payload: secondPageResponse,
      };

      state = postsReducer(state, secondPageAction);

      expect(state.page).toBe(1);
      expect(state.posts).toHaveLength(1);
    });
  });
});
