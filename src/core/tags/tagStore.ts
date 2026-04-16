import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { ITag } from "./ITag";
import TagService from "./TagService";

const service = new TagService();

export const fetchTags = createAsyncThunk(
  "tags/fetchTags",
  async () => await service.getAllTags()
);

export const fetchActiveTags = createAsyncThunk(
  "tags/fetchActiveTags",
  async () => await service.getActiveTags()
);

export const fetchPopularTags = createAsyncThunk(
  "tags/fetchPopularTags",
  async () => await service.getPopularTags()
);

export const fetchTagsByPost = createAsyncThunk(
  "tags/fetchTagsByPost",
  async (postId: number) => {
    const tags = await service.getTagsByPost(postId);
    return tags;
  }
);

export const fetchTagsByEvent = createAsyncThunk(
  "tags/fetchTagsByEvent",
  async (eventId: number) => {
    const tags = await service.getTagsByEvent(eventId);
    return tags;
  }
);

export const updatePostTags = createAsyncThunk(
  "tags/updatePostTags",
  async ({ postId, tags }: { postId: number; tags: ITag[] }) => {
    await service.replaceTagsInPost(postId, tags);
    return { postId, tags };
  }
);

export const updateEventTags = createAsyncThunk(
  "tags/updateEventTags",
  async ({ eventId, tags }: { eventId: number; tags: ITag[] }) => {
    await service.replaceTagsInEvent(eventId, tags);
    return { eventId, tags };
  }
);

interface TagsState {
  allTags: ITag[];
  activeTags: ITag[];
  popularTags: ITag[];
  postTags: { [postId: number]: ITag[] };
  eventTags: { [eventId: number]: ITag[] };
  isLoaded: boolean;
  isActiveTagsLoaded: boolean;
  isPopularTagsLoaded: boolean;
}

const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    allTags: [],
    activeTags: [],
    popularTags: [],
    postTags: {},
    eventTags: {},
    isLoaded: false,
    isActiveTagsLoaded: false,
    isPopularTagsLoaded: false,
  } as TagsState,
  reducers: {
    clearPostTags: (state, action) => {
      const postId = action.payload;
      delete state.postTags[postId];
    },
    clearEventTags: (state, action) => {
      const eventId = action.payload;
      delete state.eventTags[eventId];
    },
    setPostTags: (state, action) => {
      const { postId, tags } = action.payload;
      state.postTags[postId] = tags;
    },
    setEventTags: (state, action) => {
      const { eventId, tags } = action.payload;
      state.eventTags[eventId] = tags;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.allTags = action.payload;
        state.isLoaded = true;
      })
      .addCase(fetchActiveTags.fulfilled, (state, action) => {
        state.activeTags = action.payload;
        state.isActiveTagsLoaded = true;
      })
      .addCase(fetchPopularTags.fulfilled, (state, action) => {
        state.popularTags = action.payload;
        state.isPopularTagsLoaded = true;
      })
      .addCase(fetchTagsByPost.fulfilled, (state, action) => {
        const postId = action.meta.arg;
        state.postTags[postId] = action.payload;
      })
      .addCase(fetchTagsByEvent.fulfilled, (state, action) => {
        const eventId = action.meta.arg;
        state.eventTags[eventId] = action.payload;
      })
      .addCase(updatePostTags.fulfilled, (state, action) => {
        const { postId, tags } = action.payload;
        state.postTags[postId] = tags;
      })
      .addCase(updateEventTags.fulfilled, (state, action) => {
        const { eventId, tags } = action.payload;
        state.eventTags[eventId] = tags;
      });
  },
});

// 🎯 SELECTORES MEMOIZADOS genéricos para posts y events
export const selectTagsByPost = createSelector(
  [(state: any) => state.tags.postTags, (state: any, postId: number) => postId],
  (postTags, postId) => {
    const tags = postTags[postId] || [];
    return tags;
  }
);

export const selectTagsByEvent = createSelector(
  [
    (state: any) => state.tags.eventTags,
    (state: any, eventId: number) => eventId,
  ],
  (eventTags, eventId) => {
    const tags = eventTags[eventId] || [];
    return tags;
  }
);

// Array vacío constante para evitar re-renders cuando no hay tags
const EMPTY_TAGS_ARRAY: any[] = [];

// 🎯 SELECTOR GENÉRICO optimizado para evitar re-renders innecesarios
export const selectTagsByItem = createSelector(
  [
    (state: any) => state.tags.postTags,
    (state: any) => state.tags.eventTags,
    (state: any, itemId: number) => itemId,
    (state: any, itemId: number, itemType: "post" | "event") => itemType,
  ],
  (postTags, eventTags, itemId, itemType) => {
    const tags = itemType === "post" ? postTags[itemId] : eventTags[itemId];
    if (!tags || tags.length === 0) {
      return EMPTY_TAGS_ARRAY;
    }
    return tags;
  }
);

export const { clearPostTags, clearEventTags, setPostTags, setEventTags } =
  tagsSlice.actions;
export default tagsSlice.reducer;
