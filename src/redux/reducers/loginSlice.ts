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
      console.log("Redux login action: ", action.payload);
      state.JWTToken = action.payload;
      console.log(
        "Setting accessToken in sessionStorage: ",
        action.payload.accessToken
      );
      sessionStorage.setItem("accessToken", action.payload.accessToken);
      console.log(
        "Setting refreshToken in sessionStorage: ",
        action.payload.refreshToken
      );
      sessionStorage.setItem("refreshToken", action.payload.refreshToken);

      console.log("Setting userId in sessionStorage: ", action.payload.userId);
      sessionStorage.setItem("userId", String(action.payload.userId));

      const decodedToken = JSON.parse(
        atob(action.payload.accessToken.split(".")[1])
      );
      console.log("Decoded token: ", decodedToken);

      console.log("Setting role in sessionStorage: ", decodedToken.roles);
      sessionStorage.setItem("role", decodedToken.roles);
      sessionStorage.setItem("userName", decodedToken.username);
      console.log(decodedToken.username);
      console.log("Updated sessionStorage: ", sessionStorage);

      state.isLoggedIn = true;
      state.loggedUserId = action.payload.userId;
      state.loggedUserRole = decodedToken.roles;
      state.loggedUserName = decodedToken.username;

      console.log(state.loggedUserRole);
      console.log(state.loggedUserName);
      console.log("Updated state: ", state);

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
