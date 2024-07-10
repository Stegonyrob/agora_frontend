import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  [x: string]: any;
  token: any;
  isLoggedIn: any;
  isAuthenticated: boolean;
  user: any | null;
  role: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoggedIn: undefined,
  token: undefined,
  role: null,
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
      state.role = action.payload.role;
      console.log(`El usuario tiene el rol de ${state.role}`);
      console.log(state.user);
      console.log(state.isAuthenticated);
      console.log(state.role);
    },
  },
});

export const { setAuthentication } = authSlice.actions;

export default authSlice.reducer;
