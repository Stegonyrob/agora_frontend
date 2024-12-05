import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
  },
  reducers: {
    setProfile(state, action) {
      console.log("setProfile - action.payload:", action.payload);
      if (action.payload === null || action.payload === undefined) {
        console.error(
          "setProfile - Error: action.payload is null or undefined"
        );
        return;
      }
      try {
        console.log("setProfile - Updating state.profile:");
        state.profile = action.payload;
        console.log("setProfile - Updated state:", state);
      } catch (error) {
        console.error("setProfile - Error:", error);
      }
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
