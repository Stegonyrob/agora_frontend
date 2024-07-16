import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  [x: string]: any;
  token: any;
  isLoggedIn: any;
  isAuthenticated: boolean;
  user: any | null;
  role: string | null;
  accessToken: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoggedIn: undefined,
  token: undefined,
  role: null,
  accessToken: "",
  userId: null,
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
        accessToken: string;
        userId: any;
      }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;

      console.log(`El usuario tiene el rol de ${state.role}`);
      console.log(state.accessToken);
      console.log("Reducer:", state);
    },
  },
});

export const { setAuthentication } = authSlice.actions;
console.log(setAuthentication);
export default authSlice.reducer;
