import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IReply } from "./IReply";
import { ReplyService } from "./ReplyService";

const service = new ReplyService();

export const fetchReplies = createAsyncThunk(
  "replies/fetchReplies",
  async () => await service.get()
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
      .addCase(fetchReplies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchReplies.fulfilled, (state, action) => {
        state.replies = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchReplies.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default repliesSlice.reducer;
