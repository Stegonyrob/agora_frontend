import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IReply } from '../core/replies/IReply'; // Asegúrate de que esta ruta sea correcta
import { ReplyRepository } from '../core/replies/ReplyRepository';
import { ReplyService } from '../core/replies/ReplyService';

// Definimos un thunk asíncrono para obtener las respuestas
export const fetchReplies = createAsyncThunk('replies/fetchReplies', async () => {
 const repository = new ReplyRepository();
 const service = new ReplyService(repository);
 const replies: IReply[] = await service.get();
 return replies;
});

// Definimos el slice de Redux para manejar el estado de las respuestas
interface RepliesState {
 replies: IReply[];
 isLoading: boolean;
}

const repliesSlice = createSlice({
 name: 'replies',
 initialState: { replies: [], isLoading: false } as RepliesState,
 reducers: {},
 extraReducers: (builder) => {
 builder.addCase(fetchReplies.pending, (state) => {
 state.isLoading = true;
 });
 builder.addCase(fetchReplies.fulfilled, (state, action) => {
 state.replies = action.payload;
 state.isLoading = false;
 });
 builder.addCase(fetchReplies.rejected, (state) => {
 state.isLoading = false;
 });
 },
});

export default repliesSlice.reducer;