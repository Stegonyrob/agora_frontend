import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import IProfile from "./IProfile";
import IProfileDTO from "./IProfileDTO";
import ProfileService from "./ProfileService";

const service = new ProfileService();

export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async () => {
    return await service.getAllProfiles();
  }
);

export const fetchProfileById = createAsyncThunk(
  "profiles/fetchProfileById",
  async (id: number) => {
    return await service.getProfileById(id);
  }
);
export const createProfile = createAsyncThunk(
  "profiles/createProfile",
  async (profile: IProfileDTO) => {
    return await service.createProfile(profile);
  }
);

export const updateProfile = createAsyncThunk(
  "profiles/updateProfile",
  async ({ id, profile }: { id: number; profile: IProfileDTO }) => {
    return await service.updateProfile(id, profile);
  }
);

export const deleteProfile = createAsyncThunk(
  "profiles/deleteProfile",
  async (id: number) => {
    await service.deleteProfile(id);
    return id;
  }
);

interface ProfilesState {
  profiles: IProfile[];
  isLoaded: boolean;
}

const profilesSlice = createSlice({
  name: "profiles",
  initialState: { profiles: [], isLoaded: false } as ProfilesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.profiles = action.payload;
        state.isLoaded = true;
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        // Insert or update the profile by id (or userId if present)
        const idx = state.profiles.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.profiles[idx] = action.payload;
        } else {
          state.profiles.push(action.payload);
        }
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.profiles.push(action.payload);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const idx = state.profiles.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.profiles[idx] = action.payload;
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.profiles = state.profiles.filter((p) => p.id !== action.payload);
      });
  },
});

export default profilesSlice.reducer;
