import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITokenDTO } from "../../core/auth/ITokenDTO";

export interface LoginState {
  [x: string]: any;
  isLoggedIn: boolean;
  loggedUserId: number;
  loggedUserRole: string | null;
  loggedUserName: string;
  JWTToken: ITokenDTO;
}

const initialState: LoginState = {
  isLoggedIn: false,

  loggedUserRole: "",
  loggedUserId: 0,
  loggedUserName: "",
  JWTToken: {
    userId: 0,
    role: "",
    accessToken: "",
    refreshToken: "",
    userName: "",
  },
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<ITokenDTO>) => {
      state.JWTToken = action.payload;
      sessionStorage.setItem("accessToken", action.payload.accessToken);
      sessionStorage.setItem("refreshToken", action.payload.refreshToken);
      sessionStorage.setItem("userId", String(action.payload.userId));

      const decodedToken = JSON.parse(
        atob(action.payload.accessToken.split(".")[1])
      );
      sessionStorage.setItem("role", decodedToken.roles);
      sessionStorage.setItem("userName", decodedToken.username);
      sessionStorage.setItem("isLoggedIn", decodedToken.isLoggedIn);
      state.isLoggedIn = true;
      state.loggedUserId = action.payload.userId;
      state.loggedUserRole = decodedToken.roles;
      state.loggedUserName = decodedToken.username;

      console.log(state.loggedUserRole);
      console.log(state.loggedUserName);
      console.log("Updated state: ", state);
      console.log(state.isLoggedIn);
      console.log("Updated state and sessionStorage, login action complete");
    },

    logout: (state) => {
      console.log("Redux logout action, clearing session storage");
      document.cookie = "";
      sessionStorage.clear();
      console.log("Session storage cleared, setting state to logged out");
      state.isLoggedIn = false;
      console.log("Setting loggedUserId to 0");
      state.loggedUserId = 0;
      console.log("Setting loggedUserRole to ''");
      state.loggedUserRole = "";
      console.log("Updated state: ", state);
    },
  },
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
