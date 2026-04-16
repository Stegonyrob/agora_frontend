import { describe, expect, it } from "vitest";
import { IReply } from "../../../core/replies/IReply";
import repliesReducer, {
  createReply,
  deleteReply,
  fetchRepliesByCommentId,
  updateReply,
} from "../../../core/replies/replyStore";

describe("replyStore", () => {
  const mockReply: IReply = {
    id: 1,
    commentId: 10,
    userId: 5,
    message: "Test reply content",
    creation_date: new Date().toISOString(),
  };

  describe("Initial State", () => {
    it("should return initial state", () => {
      const state = repliesReducer(undefined, { type: "@@INIT" });
      expect(state).toEqual({
        replies: [],
        isLoading: false,
        error: null,
      });
    });
  });

  describe("fetchRepliesByCommentId", () => {
    it("should handle pending state", () => {
      const action = { type: fetchRepliesByCommentId.pending.type };
      const state = repliesReducer(undefined, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle fulfilled state", () => {
      const replies = [mockReply];
      const action = {
        type: fetchRepliesByCommentId.fulfilled.type,
        payload: replies,
      };
      const state = repliesReducer(undefined, action);

      expect(state.replies).toEqual(replies);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should handle rejected state", () => {
      const action = {
        type: fetchRepliesByCommentId.rejected.type,
        error: { message: "Network error" },
      };
      const state = repliesReducer(undefined, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Network error");
    });
  });

  describe("createReply", () => {
    it("should handle pending state", () => {
      const action = { type: createReply.pending.type };
      const state = repliesReducer(undefined, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle fulfilled state", () => {
      const initialState = {
        replies: [mockReply],
        isLoading: false,
        error: null,
      };

      const newReply: IReply = {
        id: 2,
        commentId: 10,
        userId: 6,
        message: "New reply",
        creation_date: new Date().toISOString(),
      };

      const action = {
        type: createReply.fulfilled.type,
        payload: newReply,
      };
      const state = repliesReducer(initialState, action);

      expect(state.replies).toHaveLength(2);
      expect(state.replies[1]).toEqual(newReply);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should handle rejected state", () => {
      const action = {
        type: createReply.rejected.type,
        error: { message: "Creation failed" },
      };
      const state = repliesReducer(undefined, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Creation failed");
    });
  });

  describe("updateReply", () => {
    it("should handle fulfilled state", () => {
      const initialState = {
        replies: [mockReply],
        isLoading: false,
        error: null,
      };

      const updatedReply: IReply = {
        ...mockReply,
        message: "Updated content",
      };

      const action = {
        type: updateReply.fulfilled.type,
        payload: updatedReply,
      };
      const state = repliesReducer(initialState, action);

      expect(state.replies[0].message).toBe("Updated content");
      expect(state.isLoading).toBe(false);
    });

    it("should not update if reply not found", () => {
      const initialState = {
        replies: [mockReply],
        isLoading: false,
        error: null,
      };

      const action = {
        type: updateReply.fulfilled.type,
        payload: { id: 999, message: "Not found" },
      };
      const state = repliesReducer(initialState, action);

      expect(state.replies).toEqual([mockReply]);
    });
  });

  describe("deleteReply", () => {
    it("should handle fulfilled state", () => {
      const reply2: IReply = {
        id: 2,
        commentId: 10,
        userId: 6,
        message: "Reply 2",
        creation_date: new Date().toISOString(),
      };

      const initialState = {
        replies: [mockReply, reply2],
        isLoading: false,
        error: null,
      };

      const action = {
        type: deleteReply.fulfilled.type,
        meta: { arg: 1 },
      };
      const state = repliesReducer(initialState, action);

      expect(state.replies).toHaveLength(1);
      expect(state.replies[0].id).toBe(2);
      expect(state.isLoading).toBe(false);
    });

    it("should handle deleting non-existent reply", () => {
      const initialState = {
        replies: [mockReply],
        isLoading: false,
        error: null,
      };

      const action = {
        type: deleteReply.fulfilled.type,
        meta: { arg: 999 },
      };
      const state = repliesReducer(initialState, action);

      expect(state.replies).toEqual([mockReply]);
    });
  });
});
