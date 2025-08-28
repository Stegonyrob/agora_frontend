// src/core/comments/commentStore.ts
import { RootState } from "@/redux/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createReply, deleteReply, updateReply } from "../replies/replyStore";
import { CommentDTO } from "./CommentDTO";
import { CommentService } from "./CommentService";
import { IComment } from "./IComment";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId: number) => {
    const result = await CommentService.getByPostId(postId);
    console.log(
      "[commetStore] fetchComments para postId",
      postId,
      "->",
      result
    );
    return result;
  }
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async (dto: CommentDTO, { dispatch }) => {
    const comment = await CommentService.create(dto);
    console.log("[commetStore] createComment resultado:", comment);
    // Refrescar la lista real tras crear
    if (comment && comment.postId) {
      await dispatch(fetchComments(comment.postId));
    }
    return comment;
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ id, dto }: { id: number; dto: CommentDTO }, { dispatch }) => {
    const updated = await CommentService.update(id, dto);
    console.log("[commetStore] updateComment resultado:", updated);
    if (updated && updated.postId) {
      await dispatch(fetchComments(updated.postId));
    }
    return updated;
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id: number, { getState, dispatch }) => {
    // Tipar correctamente el estado
    const state = getState() as RootState;
    let postId = null;
    if (state && state.comments && state.comments.commentsByPostId) {
      for (const pid in state.comments.commentsByPostId) {
        if (
          Array.isArray(state.comments.commentsByPostId[pid]) &&
          state.comments.commentsByPostId[pid].some((c: any) => c.id === id)
        ) {
          postId = Number(pid);
          break;
        }
      }
    }
    await CommentService.delete(id);
    if (postId) {
      await dispatch(fetchComments(postId));
    }
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
        // Fuerza nueva referencia de array para que React detecte el cambio
        if (action.payload) {
          state.commentsByPostId[postId] = Array.isArray(action.payload)
            ? [...action.payload]
            : [];
        }
        state.isLoading = false;
      })
      // No modificar el array localmente, solo refrescar con fetchComments
      .addCase(createComment.fulfilled, (state, action) => {})
      .addCase(updateComment.fulfilled, (state, action) => {})
      .addCase(deleteComment.fulfilled, (state, action) => {
        const deletedCommentId = action.payload;
        if (deletedCommentId == null) {
          console.warn(
            "No se pudo eliminar el comentario. No se encontr  el id del comentario eliminado en el store."
          );
          return;
        }
        // Find the postId that contains this comment
        Object.keys(state.commentsByPostId).forEach((postId) => {
          if (state.commentsByPostId[Number(postId)]) {
            state.commentsByPostId[Number(postId)] = state.commentsByPostId[
              Number(postId)
            ].filter((c) => c.id !== deletedCommentId);
          }
        });
      })
      // Handle reply operations to keep comments in sync
      // No modificar el array localmente, solo refrescar con fetchComments
      .addCase(createReply.fulfilled, (state, action) => {})
      .addCase(updateReply.fulfilled, (state, action) => {})
      .addCase(deleteReply.fulfilled, (state, action) => {
        const deletedReplyId = action.meta.arg;

        if (deletedReplyId == null) {
          console.warn(
            "No se pudo eliminar la respuesta. No se encontr  el id de la respuesta eliminada en el store."
          );
          return;
        }

        // Find the reply in all comments and remove it, creando nuevas referencias
        Object.keys(state.commentsByPostId).forEach((postId) => {
          const comments = state.commentsByPostId[Number(postId)];
          if (comments) {
            // Crear nuevo array de comentarios con replies actualizadas
            const newComments = comments.map((comment) => {
              if (comment.replies) {
                return {
                  ...comment,
                  replies: comment.replies.filter(
                    (r) => r.id !== deletedReplyId
                  ),
                };
              }
              return comment;
            });
            state.commentsByPostId[Number(postId)] = newComments;
          }
        });
      });
  },
});

export default commentsSlice.reducer;
