import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IPost } from "./IPost";
import PostService from "./PostService";

const service = new PostService();

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page = 0, size = 10 }: { page?: number; size?: number }) =>
    await service.getAllPosts(page, size)
);

interface PostsState {
  posts: IPost[];
  totalPages: number;
  page: number;
  isLoaded: boolean;
}

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    totalPages: 0,
    page: 0,
    isLoaded: false,
  } as PostsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload.content;
      state.totalPages = action.payload.totalPages;
      state.page = action.payload.number;
      state.isLoaded = true;
    });
  },
});

export default postsSlice.reducer;
