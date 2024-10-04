import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITokenDTO } from "../../core/auth/ITokenDTO";

export interface LoginState {
  [x: string]: any;
  isLoggedIn: boolean;
  loggedUserId: number;
  loggedUserRole: string;
  JWTToken: ITokenDTO;
}

const initialState: LoginState = {
  isLoggedIn: false,

  loggedUserRole: "",
  loggedUserId: 0,

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

      console.log("Updated sessionStorage: ", sessionStorage);
      state.isLoggedIn = true;
      state.loggedUserId = action.payload.userId;
      state.loggedUserRole = action.payload.roles;

      console.log("Updated state: ", state);

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

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
