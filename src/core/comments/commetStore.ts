// src/core/comments/commentStore.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CommentDTO } from "./CommentDTO";
import { CommentService } from "./CommentService";
import { IComment } from "./IComment";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId: number) => await CommentService.getByPostId(postId)
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async (dto: CommentDTO) => await CommentService.create(dto)
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ id, dto }: { id: number; dto: CommentDTO }) =>
    await CommentService.update(id, dto)
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id: number) => {
    await CommentService.delete(id);
    return id;
  }
);

interface CommentsState {
  commentsByPostId: { [postId: number]: IComment[] };
  isLoading: boolean;
}

const initialState: CommentsState = {
  commentsByPostId: {},
  isLoading: false,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        // action.meta.arg is the postId used in the thunk
        const postId = action.meta.arg;
        state.commentsByPostId[postId] = action.payload;
        state.isLoading = false;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        const comment = action.payload;
        const postId = comment.postId;
        if (!state.commentsByPostId[postId]) {
          state.commentsByPostId[postId] = [];
        }
        state.commentsByPostId[postId].push(comment);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const postId = updatedComment.postId;
        const comments = state.commentsByPostId[postId];
        if (comments) {
          const idx = comments.findIndex((c) => c.id === updatedComment.id);
          if (idx !== -1) comments[idx] = updatedComment;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const deletedCommentId = action.payload;
        // Find the postId that contains this comment
        Object.keys(state.commentsByPostId).forEach((postId) => {
          state.commentsByPostId[Number(postId)] = state.commentsByPostId[
            Number(postId)
          ].filter((c) => c.id !== deletedCommentId);
        });
      });
  },
});

export default commentsSlice.reducer;
