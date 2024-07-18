import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "./authSlice";
import { LogoutState } from "./logoutSlice";
export interface UserState {
  user: any;
  userId: number | null;
  userRole: string | null;
}
export interface RootState {
  auth: AuthState;
  logout: LogoutState;
  user: UserState;
}
const initialState: UserState = {
  userId: null,
  userRole: null,
  user: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (
      state,
      action: PayloadAction<{ userId: number; role: string }>
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
