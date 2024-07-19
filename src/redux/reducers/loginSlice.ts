import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ITokenDTO } from "../../core/auth/ITokenDTO";

interface LoginState {
  isLoggedIn: boolean;
  loginFormIsOpened: boolean;
  loggedUserId: number;
  loggedUserRole: string;
  JWTToken: ITokenDTO;
}

const initialState: LoginState = {
  isLoggedIn: false,
  loginFormIsOpened: false,
  loggedUserId: 0,
  loggedUserRole: "",
  JWTToken: {
    userId: 0,
    roles: "",
    accessToken: "",
    refreshToken: "",
  },
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    switchLoginForm: (state) => {
      state.loginFormIsOpened = !state.loginFormIsOpened;
    },
    login: (state, action: PayloadAction<ITokenDTO>) => {
      console.log("Redux login action: ", action.payload);
      state.JWTToken = action.payload;
      sessionStorage.setItem("userId", String(action.payload.userId));
      sessionStorage.setItem("roles", action.payload.roles);
      sessionStorage.setItem("accessToken", action.payload.accessToken);
      sessionStorage.setItem("refreshToken", action.payload.refreshToken);
      console.log("Updated sessionStorage: ", sessionStorage);
      state.isLoggedIn = true;
      state.loggedUserId = action.payload.userId;
      state.loggedUserRole = action.payload.roles;
      console.log("Updated state: ", state);
      state.loginFormIsOpened = false;
      console.log("Updated state and sessionStorage, login action complete");
    },
    logout: (state) => {
      console.log("Clearing sessionStorage");
      sessionStorage.clear();
      console.log("sessionStorage after clearing:", sessionStorage);
      state.isLoggedIn = false;
      console.log("Setting isLoggedIn to false");
      state.loggedUserId = 0;
      console.log("Setting loggedUserId to 0");
      state.loggedUserRole = "";
      console.log("Setting loggedUserRole to empty string");
    },
  },
});

export const { switchLoginForm, login, logout } = loginSlice.actions;
export default loginSlice.reducer;
