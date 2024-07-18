import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  [x: string]: any;
  isAuthenticated: boolean;
  user: any | null;
  role: string;
  accessToken: string;
  userId: number | null;
  refreshToken: string;
  error: string | null;
  success: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: "",
  accessToken: "",
  userId: null,
  refreshToken: "",
  error: null,
  success: false,
  isLoggedIn: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<Partial<AuthState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;
