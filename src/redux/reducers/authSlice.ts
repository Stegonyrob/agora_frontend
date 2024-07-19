import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  [x: string]: any;
  isAuthenticated: boolean;
  user: {
    userId: number | null;
    role: string | undefined;
  } | null;
  accessToken: string;
  refreshToken: string;
  role: string | undefined;
  userId: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: "",
  refreshToken: "",
  role: "",
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
    },
  },
});

export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;
