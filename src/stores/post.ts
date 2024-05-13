import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IPost } from '../core/posts/IPost'; // Asegúrate de que esta ruta sea correcta
import PostRepository from '../core/posts/PostRepository';
import PostService from '../core/posts/PostService';

// Definimos un thunk asíncrono para obtener las publicaciones
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
 const repository = new PostRepository();
 const service = new PostService(repository);
 const posts: IPost[] = await service.get();
 return posts;
});

// Definimos el slice de Redux para manejar el estado de las publicaciones
interface PostsState {
 posts: IPost[];
 isLoading: boolean;
}

// Use the defined state type in the initialState and createSlice
const postsSlice = createSlice({
 name: 'posts',
 initialState: { posts: [], isLoading: false } as PostsState,
 reducers: {},
 extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchPosts.rejected, (state) => {
      state.isLoading = false;
    });
 },
});

export default postsSlice.reducer;
