import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IPost } from "../../core/posts/IPost";
import { IPostDTO } from "../../core/posts/IPostDTO";
import PostService from "../../core/posts/PostService";

interface PostsState {
  posts: IPost[];
  isLoaded: boolean;
}

const initialState: PostsState = {
  posts: [],
  isLoaded: false,
};

export const saveNewPost = createAsyncThunk(
  "posts/saveNewPost",
  async (newPost: IPostDTO, thunkAPI) => {
    const postService = new PostService();
    const response = await postService.createPost(newPost);
    return response;
  }
);

export const updateExistingPost = createAsyncThunk(
  "posts/updateExistingPost",
  async (
    { postId, updatedPostData }: { postId: number; updatedPostData: IPostDTO },
    thunkAPI
  ) => {
    const postService = new PostService();
    const response = await postService.updatePost(updatedPostData, postId);
    return response;
  }
);

// Assuming ProductService is a class with a static method delete
export const deletePostById = createAsyncThunk(
  "posts/deletePostsById",
  async (postsId: number, thunkAPI) => {
    try {
      const postsService = new PostService();
      await postsService.delete(postsId);

      return postsId;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: "Unexpected error occurred during the posts delete",
        error,
      });
    }
  }
);

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    getAllPosts: (state) => {
      state.isLoaded = false;
    },
    // Define otros reducers síncronos aquí si los tienes
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveNewPost.pending, (state) => {
        state.isLoaded = false;
      })
      .addCase(saveNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
        state.isLoaded = true;
      })
      .addCase(saveNewPost.rejected, (state, action) => {
        console.error("Failed to save new post:", action.error.message);
        state.isLoaded = false;
      })
      .addCase(updateExistingPost.pending, (state) => {
        state.isLoaded = false;
      })
      .addCase(updateExistingPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        state.isLoaded = true;
      })
      .addCase(updateExistingPost.rejected, (state, action) => {
        console.error("Failed to update existing post:", action.error.message);
        state.isLoaded = false;
      })
      .addCase(deletePostById.pending, (state) => {
        state.isLoaded = false;
      })
      .addCase(deletePostById.fulfilled, (state, action) => {
        const postId = action.payload;
        state.posts = state.posts.filter((post) => post.id !== postId);
        state.isLoaded = true;
      })
      .addCase(deletePostById.rejected, (state, action) => {
        console.error("Failed to delete post:", action.error.message);
        state.isLoaded = false;
      });
  },
});

export default postsSlice.reducer;