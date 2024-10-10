import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginState } from "./loginSlice";
import { LogoutState } from "./logoutSlice";
export interface UserState {
  find(arg0: (u: { userId: number }) => boolean): any;
  url_avatar: string;
  userName: string;
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
  userName: "",
  source_avatar: "",
  find: (predicate: (u: { userId: number }) => boolean) => {
    if (initialState.user === undefined) {
      return undefined;
    }
    return initialState.user.find(predicate);
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (
      state,
      action: PayloadAction<{ userId: number; role: string }>
    ) => {
      console.log("Login user action: ", action.payload);
      state.userId = action.payload.userId;
      state.userRole = action.payload.role;
      console.log("Updated state: ", state);
    },
    clearErrorMessage: (state) => {
      state.userId = null;
      state.userRole = null;
    },
  },
});

export const { loginUser, clearErrorMessage } = userSlice.actions;

export default userSlice.reducer;
