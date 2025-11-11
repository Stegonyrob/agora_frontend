import { describe, expect, it } from "vitest";
import { ITag } from "../../../core/tags/ITag";
import tagsReducer, {
  clearEventTags,
  clearPostTags,
  fetchActiveTags,
  fetchPopularTags,
  fetchTags,
  fetchTagsByEvent,
  fetchTagsByPost,
  setEventTags,
  setPostTags,
  updateEventTags,
  updatePostTags,
} from "../../../core/tags/tagStore";

describe("tagStore", () => {
  const mockTag: ITag = {
    id: 1,
    name: "JavaScript",
    archived: false,
  };

  const mockTag2: ITag = {
    id: 2,
    name: "TypeScript",
    archived: false,
  };

  describe("Initial State", () => {
    it("should return initial state", () => {
      const state = tagsReducer(undefined, { type: "@@INIT" });
      expect(state).toEqual({
        allTags: [],
        activeTags: [],
        popularTags: [],
        postTags: {},
        eventTags: {},
        isLoaded: false,
        isActiveTagsLoaded: false,
        isPopularTagsLoaded: false,
      });
    });
  });

  describe("fetchTags", () => {
    it("should handle fetchTags.fulfilled", () => {
      const tags = [mockTag, mockTag2];
      const action = { type: fetchTags.fulfilled.type, payload: tags };
      const state = tagsReducer(undefined, action);

      expect(state.allTags).toEqual(tags);
      expect(state.isLoaded).toBe(true);
    });
  });

  describe("fetchActiveTags", () => {
    it("should handle fetchActiveTags.fulfilled", () => {
      const tags = [mockTag];
      const action = { type: fetchActiveTags.fulfilled.type, payload: tags };
      const state = tagsReducer(undefined, action);

      expect(state.activeTags).toEqual(tags);
      expect(state.isActiveTagsLoaded).toBe(true);
    });
  });

  describe("fetchPopularTags", () => {
    it("should handle fetchPopularTags.fulfilled", () => {
      const tags = [mockTag, mockTag2];
      const action = { type: fetchPopularTags.fulfilled.type, payload: tags };
      const state = tagsReducer(undefined, action);

      expect(state.popularTags).toEqual(tags);
      expect(state.isPopularTagsLoaded).toBe(true);
    });
  });

  describe("fetchTagsByPost", () => {
    it("should handle fetchTagsByPost.fulfilled", () => {
      const postId = 10;
      const tags = [mockTag];
      const action = {
        type: fetchTagsByPost.fulfilled.type,
        payload: tags,
        meta: { arg: postId },
      };
      const state = tagsReducer(undefined, action);

      expect(state.postTags[postId]).toEqual(tags);
    });
  });

  describe("fetchTagsByEvent", () => {
    it("should handle fetchTagsByEvent.fulfilled", () => {
      const eventId = 20;
      const tags = [mockTag, mockTag2];
      const action = {
        type: fetchTagsByEvent.fulfilled.type,
        payload: tags,
        meta: { arg: eventId },
      };
      const state = tagsReducer(undefined, action);

      expect(state.eventTags[eventId]).toEqual(tags);
    });
  });

  describe("updatePostTags", () => {
    it("should handle updatePostTags.fulfilled", () => {
      const postId = 10;
      const tags = [mockTag2];
      const action = {
        type: updatePostTags.fulfilled.type,
        payload: { postId, tags },
      };
      const state = tagsReducer(undefined, action);

      expect(state.postTags[postId]).toEqual(tags);
    });
  });

  describe("updateEventTags", () => {
    it("should handle updateEventTags.fulfilled", () => {
      const eventId = 20;
      const tags = [mockTag];
      const action = {
        type: updateEventTags.fulfilled.type,
        payload: { eventId, tags },
      };
      const state = tagsReducer(undefined, action);

      expect(state.eventTags[eventId]).toEqual(tags);
    });
  });

  describe("Reducer Actions", () => {
    it("should clear post tags", () => {
      const initialState = {
        allTags: [],
        activeTags: [],
        popularTags: [],
        postTags: { 10: [mockTag] },
        eventTags: {},
        isLoaded: false,
        isActiveTagsLoaded: false,
        isPopularTagsLoaded: false,
      };

      const state = tagsReducer(initialState, clearPostTags(10));

      expect(state.postTags[10]).toBeUndefined();
    });

    it("should clear event tags", () => {
      const initialState = {
        allTags: [],
        activeTags: [],
        popularTags: [],
        postTags: {},
        eventTags: { 20: [mockTag] },
        isLoaded: false,
        isActiveTagsLoaded: false,
        isPopularTagsLoaded: false,
      };

      const state = tagsReducer(initialState, clearEventTags(20));

      expect(state.eventTags[20]).toBeUndefined();
    });

    it("should set post tags", () => {
      const state = tagsReducer(
        undefined,
        setPostTags({ postId: 10, tags: [mockTag, mockTag2] })
      );

      expect(state.postTags[10]).toEqual([mockTag, mockTag2]);
    });

    it("should set event tags", () => {
      const state = tagsReducer(
        undefined,
        setEventTags({ eventId: 20, tags: [mockTag] })
      );

      expect(state.eventTags[20]).toEqual([mockTag]);
    });
  });
});
