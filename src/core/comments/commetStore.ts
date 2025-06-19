import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CommentRepository } from "./CommentRepository";
import { CommentService } from "./CommentService";
import { IComment } from "./IComment";

const service = new CommentService(new CommentRepository());

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId: number) => {
    return await service.getByPostId(postId);
  }
);

interface CommentsState {
  comments: IComment[];
  isLoading: boolean;
}

const commentsSlice = createSlice({
  name: "comments",
  initialState: { comments: [], isLoading: false } as CommentsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default commentsSlice.reducer;
