import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IReply } from "./IReply";
import { IReplyDTO } from "./IReplyDTO";
import { ReplyService } from "./ReplyService";

const service = new ReplyService();

export const fetchRepliesByCommentId = createAsyncThunk(
  "replies/fetchRepliesByCommentId",
  async (commentId: number) => await service.getByCommentId(commentId)
);

export const createReply = createAsyncThunk(
  "replies/createReply",
  async (reply: IReplyDTO) => await service.create(reply)
);

export const updateReply = createAsyncThunk(
  "replies/updateReply",
  async (reply: IReplyDTO) => await service.update(reply)
);

export const deleteReply = createAsyncThunk(
  "replies/deleteReply",
  async (replyId: number) => await service.delete(replyId)
);

interface RepliesState {
  replies: IReply[];
  isLoading: boolean;
}

const repliesSlice = createSlice({
  name: "replies",
  initialState: { replies: [], isLoading: false } as RepliesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepliesByCommentId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRepliesByCommentId.fulfilled, (state, action) => {
        state.replies = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchRepliesByCommentId.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default repliesSlice.reducer;
