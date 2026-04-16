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
  async ({ replyId, reply }: { replyId: number; reply: IReplyDTO }) =>
    await service.update(replyId, reply)
);

export const deleteReply = createAsyncThunk(
  "replies/deleteReply",
  async (replyId: number) => await service.delete(replyId)
);

interface RepliesState {
  replies: IReply[];
  isLoading: boolean;
  error: string | null;
}

const repliesSlice = createSlice({
  name: "replies",
  initialState: { replies: [], isLoading: false, error: null } as RepliesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch replies by comment ID
      .addCase(fetchRepliesByCommentId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRepliesByCommentId.fulfilled, (state, action) => {
        state.replies = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchRepliesByCommentId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Error al cargar respuestas";
      })
      // Create reply
      .addCase(createReply.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createReply.fulfilled, (state, action) => {
        state.replies.push(action.payload);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createReply.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Error al crear respuesta";
      })
      // Update reply
      .addCase(updateReply.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateReply.fulfilled, (state, action) => {
        const index = state.replies.findIndex(
          (reply) => reply.id === action.payload.id
        );
        if (index !== -1) {
          state.replies[index] = action.payload;
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateReply.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Error al actualizar respuesta";
      })
      // Delete reply
      .addCase(deleteReply.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReply.fulfilled, (state, action) => {
        state.replies = state.replies.filter(
          (reply) => reply.id !== action.meta.arg
        );
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteReply.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Error al eliminar respuesta";
      });
  },
});

export default repliesSlice.reducer;
