import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
export const deletedExistingPost = createAsyncThunk(
  "posts/deletedExistingPost",
  async (
    { postId, deletedPostData }: { postId: number; deletedPostData: IPostDTO },
    thunkAPI
  ) => {
    const postService = new PostService();
    const response = await postService.deletePost(deletedPostData, postId);
    return response;
  }
);
// Assuming ProductService archive
export const archivePost = createAsyncThunk(
  "posts/archivePostsById",
  async (
    { postId, archivePostData }: { postId: number; archivePostData: IPostDTO },
    thunkAPI
  ) => {
    const postService = new PostService();
    const response = await postService.deletePost(archivePostData, postId);
    return response;
  }
);
export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    getAllPosts: (state) => {
      state.isLoaded = false;
    },
    setAllPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = action.payload;
      state.isLoaded = true;
    },
    deletePostById: (state, action: PayloadAction<number>) => {
      const index = state.posts.findIndex(
        (post) => post.postId === action.payload
      );
      if (index > -1) {
        state.posts.splice(index, 1);
      }
    },
    archivePostById: (state, action: PayloadAction<number>) => {
      const post = state.posts.find((post) => post.postId === action.payload);
      if (post) {
        post.isArchived = true;
      }
    },
    unarchivePostById: (state, action: PayloadAction<number>) => {
      const post = state.posts.find((post) => post.postId === action.payload);
      if (post) {
        post.isArchived = false;
      }
    },
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
          (post) => post.postId === action.payload.postId
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        state.isLoaded = true;
      });
  },
});

export default postsSlice.reducer;
