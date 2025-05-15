import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LoginState {
  isLoggedIn: boolean;
  loggedUserId: number;
  loggedUserRole: string;
  loggedUserName: string;
  accessToken: string;
  refreshToken: string;
}

interface LoginPayload {
  userId: number;
  role: string;
  userName: string;
  accessToken: string;
  refreshToken: string;
}

// Inicializa el estado desde sessionStorage para persistencia en la sesión
const initialState: LoginState = {
  isLoggedIn: sessionStorage.getItem("isLoggedIn") === "true",
  loggedUserId: Number(sessionStorage.getItem("userId")) || 0,
  loggedUserRole: sessionStorage.getItem("role") || "",
  loggedUserName: sessionStorage.getItem("userName") || "",
  accessToken: sessionStorage.getItem("accessToken") || "",
  refreshToken: sessionStorage.getItem("refreshToken") || "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.isLoggedIn = true;
      state.loggedUserId = action.payload.userId;
      state.loggedUserRole = action.payload.role;
      state.loggedUserName = action.payload.userName;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      // También actualiza sessionStorage para mantener sincronía
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userId", String(action.payload.userId));
      sessionStorage.setItem("role", action.payload.role);
      sessionStorage.setItem("userName", action.payload.userName);
      sessionStorage.setItem("accessToken", action.payload.accessToken);
      sessionStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.loggedUserId = 0;
      state.loggedUserRole = "";
      state.loggedUserName = "";
      state.accessToken = "";
      state.refreshToken = "";
      sessionStorage.clear();
    },
  },
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
export const selectIsLoggedIn = (state: { login: LoginState }) =>
  state.login.isLoggedIn;
