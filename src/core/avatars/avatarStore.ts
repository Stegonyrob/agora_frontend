import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AvatarService from "./AvatarService";
import IAvatar from "./IAvatar";

const service = new AvatarService();

export const fetchAvatarsForSelector = createAsyncThunk(
  "avatars/fetchAvatarsForSelector",
  async () => {
    console.log("🔄 Redux - fetchAvatarsForSelector iniciado");
    const result = await service.getAvatarsForSelector();
    console.log("✅ Redux - fetchAvatarsForSelector completado:", result);
    return result;
  }
);

export const fetchDefaultAvatar = createAsyncThunk(
  "avatars/fetchDefaultAvatar",
  async () => {
    console.log("🔄 Redux - fetchDefaultAvatar iniciado");
    const result = await service.getDefaultAvatar();
    console.log("✅ Redux - fetchDefaultAvatar completado:", result);
    return result;
  }
);

export const fetchAvatarById = createAsyncThunk(
  "avatars/fetchAvatarById",
  async (id: number) => {
    return await service.getAvatarById(id);
  }
);

export const uploadCustomAvatar = createAsyncThunk(
  "avatars/uploadCustomAvatar",
  async ({ file, userId }: { file: File; userId: number }) => {
    return await service.uploadCustomAvatar(file, userId);
  }
);

export const deleteCustomAvatar = createAsyncThunk(
  "avatars/deleteCustomAvatar",
  async (id: number) => {
    await service.deleteCustomAvatar(id);
    return id;
  }
);

interface AvatarsState {
  avatars: IAvatar[];
  defaultAvatar: IAvatar | null;
  selectedAvatar: IAvatar | null;
  isLoaded: boolean;
  isUploading: boolean;
  uploadError: string | null;
}

const avatarsSlice = createSlice({
  name: "avatars",
  initialState: {
    avatars: [],
    defaultAvatar: null,
    selectedAvatar: null,
    isLoaded: false,
    isUploading: false,
    uploadError: null,
  } as AvatarsState,
  reducers: {
    selectAvatar: (state, action) => {
      state.selectedAvatar = action.payload;
    },
    clearUploadError: (state) => {
      state.uploadError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvatarsForSelector.fulfilled, (state, action) => {
        console.log(
          "✅ Redux - fetchAvatarsForSelector.fulfilled:",
          action.payload
        );
        state.avatars = action.payload;
        state.isLoaded = true;
      })
      .addCase(fetchAvatarsForSelector.rejected, (state, action) => {
        console.log(
          "❌ Redux - fetchAvatarsForSelector.rejected:",
          action.error
        );
        state.isLoaded = true;
      })
      .addCase(fetchDefaultAvatar.fulfilled, (state, action) => {
        console.log("✅ Redux - fetchDefaultAvatar.fulfilled:", action.payload);
        state.defaultAvatar = action.payload;
      })
      .addCase(fetchDefaultAvatar.rejected, (state, action) => {
        console.log("❌ Redux - fetchDefaultAvatar.rejected:", action.error);
      })
      .addCase(fetchAvatarById.fulfilled, (state, action) => {
        const existingIndex = state.avatars.findIndex(
          (a) => a.id === action.payload.id
        );
        if (existingIndex !== -1) {
          state.avatars[existingIndex] = action.payload;
        } else {
          state.avatars.push(action.payload);
        }
      })
      .addCase(uploadCustomAvatar.pending, (state) => {
        state.isUploading = true;
        state.uploadError = null;
      })
      .addCase(uploadCustomAvatar.fulfilled, (state, action) => {
        state.avatars.push(action.payload);
        state.isUploading = false;
        state.uploadError = null;
      })
      .addCase(uploadCustomAvatar.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadError = action.error.message || "Error uploading avatar";
      })
      .addCase(deleteCustomAvatar.fulfilled, (state, action) => {
        state.avatars = state.avatars.filter((a) => a.id !== action.payload);
        if (state.selectedAvatar?.id === action.payload) {
          state.selectedAvatar = null;
        }
      });
  },
});

export const { selectAvatar, clearUploadError } = avatarsSlice.actions;
export default avatarsSlice.reducer;
