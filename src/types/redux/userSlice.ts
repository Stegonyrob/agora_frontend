import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userId: string | null;
  userRole: string | null;
}

const initialState: UserState = {
  userId: null,
  userRole: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (
      state,
      action: PayloadAction<{ userId: string; role: string }>
    ) => {
      state.userId = action.payload.userId;
      state.userRole = action.payload.role;
    },
    clearErrorMessage: (state) => {
      state.userId = null;
      state.userRole = null;
    },
  },
});

export const { loginUser, clearErrorMessage } = userSlice.actions;

export default userSlice.reducer;
