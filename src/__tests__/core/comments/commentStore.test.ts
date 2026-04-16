import commentReducer, {
  createComment,
  deleteComment,
  fetchComments,
  updateComment,
} from "@/core/comments/commetStore";
import { IComment } from "@/core/comments/IComment";
import {
  createReply,
  deleteReply,
  updateReply,
} from "@/core/replies/replyStore";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the CommentService
vi.mock("@/core/comments/CommentService", () => ({
  CommentService: {
    getByPostId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("commentStore", () => {
  const mockComment: IComment = {
    id: 1,
    postId: 10,
    userId: 100,
    message: "Test comment",
    creationDate: "2024-01-01T00:00:00Z",
    replies: [],
  };

  const mockComment2: IComment = {
    id: 2,
    postId: 10,
    userId: 101,
    message: "Test comment 2",
    creationDate: "2024-01-02T00:00:00Z",
    replies: [],
  };

  const mockCommentWithReplies: IComment = {
    id: 3,
    postId: 20,
    userId: 102,
    message: "Comment with replies",
    creationDate: "2024-01-03T00:00:00Z",
    replies: [
      {
        id: 1,
        commentId: 3,
        userId: 103,
        message: "Reply 1",
        creation_date: "2024-01-04T00:00:00Z",
      },
      {
        id: 2,
        commentId: 3,
        userId: 104,
        message: "Reply 2",
        creation_date: "2024-01-05T00:00:00Z",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should return the initial state", () => {
      const state = commentReducer(undefined, { type: "@@INIT" });
      expect(state).toEqual({
        commentsByPostId: {},
        isLoading: false,
      });
    });
  });

  describe("fetchComments", () => {
    it("should store comments by postId", () => {
      const action = {
        type: fetchComments.fulfilled.type,
        payload: [mockComment, mockComment2],
        meta: { arg: 10 },
      };
      const state = commentReducer(undefined, action);
      expect(state.commentsByPostId[10]).toHaveLength(2);
      expect(state.commentsByPostId[10][0]).toEqual(mockComment);
      expect(state.commentsByPostId[10][1]).toEqual(mockComment2);
      expect(state.isLoading).toBe(false);
    });

    it("should handle empty comments array", () => {
      const action = {
        type: fetchComments.fulfilled.type,
        payload: [],
        meta: { arg: 15 },
      };
      const state = commentReducer(undefined, action);
      expect(state.commentsByPostId[15]).toEqual([]);
      expect(state.isLoading).toBe(false);
    });

    it("should replace existing comments for a postId", () => {
      const initialState = {
        commentsByPostId: {
          10: [mockComment],
        },
        isLoading: false,
      };
      const action = {
        type: fetchComments.fulfilled.type,
        payload: [mockComment2],
        meta: { arg: 10 },
      };
      const state = commentReducer(initialState, action);
      expect(state.commentsByPostId[10]).toHaveLength(1);
      expect(state.commentsByPostId[10][0]).toEqual(mockComment2);
    });

    it("should handle multiple postIds separately", () => {
      const initialState = {
        commentsByPostId: {
          10: [mockComment],
        },
        isLoading: false,
      };
      const action = {
        type: fetchComments.fulfilled.type,
        payload: [mockCommentWithReplies],
        meta: { arg: 20 },
      };
      const state = commentReducer(initialState, action);
      expect(state.commentsByPostId[10]).toHaveLength(1);
      expect(state.commentsByPostId[20]).toHaveLength(1);
      expect(state.commentsByPostId[20][0]).toEqual(mockCommentWithReplies);
    });
  });

  describe("createComment", () => {
    it("should not modify state directly (relies on refetch)", () => {
      const initialState = {
        commentsByPostId: {
          10: [mockComment],
        },
        isLoading: false,
      };
      const action = {
        type: createComment.fulfilled.type,
        payload: mockComment2,
      };
      const state = commentReducer(initialState, action);
      // The reducer doesn't modify state on createComment.fulfilled
      expect(state.commentsByPostId[10]).toHaveLength(1);
      expect(state.commentsByPostId[10][0]).toEqual(mockComment);
    });
  });

  describe("updateComment", () => {
    it("should not modify state directly (relies on refetch)", () => {
      const initialState = {
        commentsByPostId: {
          10: [mockComment],
        },
        isLoading: false,
      };
      const updatedComment = {
        ...mockComment,
        message: "Updated message",
      };
      const action = {
        type: updateComment.fulfilled.type,
        payload: updatedComment,
      };
      const state = commentReducer(initialState, action);
      // The reducer doesn't modify state on updateComment.fulfilled
      expect(state.commentsByPostId[10][0].message).toBe("Test comment");
    });
  });

  describe("deleteComment", () => {
    it("should remove comment from all postIds", () => {
      const initialState = {
        commentsByPostId: {
          10: [mockComment, mockComment2],
        },
        isLoading: false,
      };
      const action = {
        type: deleteComment.fulfilled.type,
        payload: 1,
      };
      const state = commentReducer(initialState, action);
      expect(state.commentsByPostId[10]).toHaveLength(1);
      expect(state.commentsByPostId[10][0].id).toBe(2);
    });

    it("should handle deleting from multiple postIds", () => {
      const initialState = {
        commentsByPostId: {
          10: [mockComment, mockComment2],
          20: [mockCommentWithReplies],
        },
        isLoading: false,
      };
      const action = {
        type: deleteComment.fulfilled.type,
        payload: 3,
      };
      const state = commentReducer(initialState, action);
      expect(state.commentsByPostId[10]).toHaveLength(2);
      expect(state.commentsByPostId[20]).toHaveLength(0);
    });

    it("should not error if comment not found", () => {
      const initialState = {
        commentsByPostId: {
          10: [mockComment],
        },
        isLoading: false,
      };
      const action = {
        type: deleteComment.fulfilled.type,
        payload: 999,
      };
      const state = commentReducer(initialState, action);
      expect(state.commentsByPostId[10]).toHaveLength(1);
      expect(state.commentsByPostId[10][0]).toEqual(mockComment);
    });
  });

  describe("reply integration", () => {
    it("should not modify state on createReply (relies on refetch)", () => {
      const initialState = {
        commentsByPostId: {
          20: [mockCommentWithReplies],
        },
        isLoading: false,
      };
      const action = {
        type: createReply.fulfilled.type,
        payload: {
          id: 3,
          commentId: 3,
          userId: 105,
          message: "New reply",
          creation_date: "2024-01-06T00:00:00Z",
        },
      };
      const state = commentReducer(initialState, action);
      expect(state.commentsByPostId[20][0].replies).toHaveLength(2);
    });

    it("should not modify state on updateReply (relies on refetch)", () => {
      const initialState = {
        commentsByPostId: {
          20: [mockCommentWithReplies],
        },
        isLoading: false,
      };
      const action = {
        type: updateReply.fulfilled.type,
        payload: {
          id: 1,
          commentId: 3,
          userId: 103,
          message: "Updated reply",
          creation_date: "2024-01-04T00:00:00Z",
        },
      };
      const state = commentReducer(initialState, action);
      expect(state.commentsByPostId[20][0].replies![0].message).toBe("Reply 1");
    });

    it("should remove reply from comments when deleteReply is fulfilled", () => {
      const initialState = {
        commentsByPostId: {
          20: [mockCommentWithReplies],
        },
        isLoading: false,
      };
      const action = {
        type: deleteReply.fulfilled.type,
        meta: { arg: 1 },
      };
      const state = commentReducer(initialState, action);
      expect(state.commentsByPostId[20][0].replies).toHaveLength(1);
      expect(state.commentsByPostId[20][0].replies![0].id).toBe(2);
    });

    it("should handle deleting reply from multiple comments", () => {
      const mockComment4: IComment = {
        id: 4,
        postId: 20,
        userId: 106,
        message: "Another comment",
        creationDate: "2024-01-07T00:00:00Z",
        replies: [
          {
            id: 1,
            commentId: 4,
            userId: 107,
            message: "Reply to delete",
            creation_date: "2024-01-08T00:00:00Z",
          },
        ],
      };
      const initialState = {
        commentsByPostId: {
          20: [mockCommentWithReplies, mockComment4],
        },
        isLoading: false,
      };
      const action = {
        type: deleteReply.fulfilled.type,
        meta: { arg: 1 },
      };
      const state = commentReducer(initialState, action);
      // Reply id:1 should be removed from both comments
      expect(state.commentsByPostId[20][0].replies).toHaveLength(1);
      expect(state.commentsByPostId[20][0].replies![0].id).toBe(2);
      expect(state.commentsByPostId[20][1].replies).toHaveLength(0);
    });

    it("should not error if reply not found", () => {
      const initialState = {
        commentsByPostId: {
          20: [mockCommentWithReplies],
        },
        isLoading: false,
      };
      const action = {
        type: deleteReply.fulfilled.type,
        meta: { arg: 999 },
      };
      const state = commentReducer(initialState, action);
      expect(state.commentsByPostId[20][0].replies).toHaveLength(2);
    });
  });
});
