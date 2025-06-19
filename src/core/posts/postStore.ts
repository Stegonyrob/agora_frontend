import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IPost } from "./IPost";
import PostService from "./PostService";

const service = new PostService();

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async () => await service.getAllPosts()
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id: number) => await service.getPostById(id)
);

interface PostsState {
  posts: IPost[];
  isLoaded: boolean;
}

const postsSlice = createSlice({
  name: "posts",
  initialState: { posts: [], isLoaded: false } as PostsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.isLoaded = true;
    });
  },
});

export default postsSlice.reducer;
