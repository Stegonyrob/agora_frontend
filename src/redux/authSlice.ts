import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: any;
  isLoggedIn: any;
  isAuthenticated: boolean;
  user: any | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoggedIn: undefined,
  token: undefined,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthentication: (
      state,
      action: PayloadAction<{
        isAuthenticated: boolean;
        user: any;
        role: string;
      }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.user.role = action.payload.role;
    },
  },
});

export const { setAuthentication } = authSlice.actions;

export default authSlice.reducer;
