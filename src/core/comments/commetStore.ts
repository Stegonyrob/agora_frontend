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
  comments: IComment[];
  isLoading: boolean;
}

const initialState: CommentsState = {
  comments: [],
  isLoading: false,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.isLoading = false;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const idx = state.comments.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.comments[idx] = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c.id !== action.payload);
      });
  },
});

export default commentsSlice.reducer;
