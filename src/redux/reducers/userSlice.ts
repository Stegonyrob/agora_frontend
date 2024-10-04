import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginState } from "./loginSlice";
import { LogoutState } from "./logoutSlice";
export interface UserState {
  url_avatar: string;
  username: string;
  source_avatar: string;
  user: any;
  userId: number | null;
  userRole: string | null;
}
export interface RootState {
  auth: LoginState;
  logout: LogoutState;
  user: UserState;
}
const initialState: UserState = {
  userId: null,
  userRole: null,
  user: undefined,
  url_avatar: "",
  username: "",
  source_avatar: "",
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
