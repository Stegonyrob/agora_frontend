import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITokenDTO } from "../../core/auth/ITokenDTO";

export interface LoginState {
  [x: string]: any;
  isLoggedIn: boolean;
  loggedUserId: number;
  loggedUserRole: string | null;
  JWTToken: ITokenDTO;
}

const initialState: LoginState = {
  isLoggedIn: false,

  loggedUserRole: "",
  loggedUserId: 0,

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

      console.log("Updated sessionStorage: ", sessionStorage);

      state.isLoggedIn = true;
      state.loggedUserId = action.payload.userId;
      state.loggedUserRole = decodedToken.roles;

      console.log(state.loggedUserRole);

      console.log("Updated state: ", state);

      console.log("Updated state and sessionStorage, login action complete");
    },

    logout: (state) => {
      sessionStorage.clear();

      state.isLoggedIn = false;

      state.loggedUserId = 0;

      state.loggedUserRole = "";
    },
  },
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
