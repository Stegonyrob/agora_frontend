import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITokenDTO } from "../../core/auth/ITokenDTO";

export interface LoginState {
  isLoggedIn: boolean;
  loggedUserId: number;
  loggedUserRole: string | null;
  loggedUserName: string;
  JWTToken: ITokenDTO;
}

const initialState: LoginState = {
  isLoggedIn: false,
  loggedUserId: 0,
  loggedUserRole: "",
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
      try {
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

        console.log("Login successful. Updated state:", state);
      } catch (error) {
        console.error("Error during login:", error);
        // Handle login failure (e.g., show an error message to the user)
      }
    },

    logout: (state) => {
      try {
        console.log("Redux logout action, clearing session storage");
        document.cookie = "";
        sessionStorage.clear();
        console.log("Session storage cleared, setting state to logged out");

        state.isLoggedIn = false;
        state.loggedUserId = 0;
        state.loggedUserRole = "";
        state.loggedUserName = "";
        state.JWTToken = {
          userId: 0,
          role: "",
          accessToken: "",
          refreshToken: "",
          userName: "",
        };

        console.log("Logout completed. Updated state:", state);
      } catch (error) {
        console.error("Error during logout:", error);
        // Handle logout failure (e.g., show an error message to the user)
      }
    },
  },
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
