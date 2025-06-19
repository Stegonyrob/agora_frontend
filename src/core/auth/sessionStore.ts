import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ISession } from "./ISession";
import type { ITokenDTO } from "./ITokenDTO";

const initialState: ISession = {
  userId: 0,
  role: "",
  userName: "",
  isLoggedIn: false,
  useremail: "",
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    login(state, action: PayloadAction<ITokenDTO>) {
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.userName = action.payload.userName;
      state.useremail = action.payload.useremail;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.userId = 0;
      state.role = "";
      state.userName = "";
      state.useremail = "";
      state.isLoggedIn = false;
      sessionStorage.clear();
      localStorage.removeItem("rememberMe");
      // Limpia cookies si las usas
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    },
    setSession(state, action: PayloadAction<ISession>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { login, logout, setSession } = sessionSlice.actions;
export default sessionSlice.reducer;
