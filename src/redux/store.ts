import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import textsReducer from "./textSlice";
import userReducer from "./userSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    text: textsReducer,
    user: userReducer,
  },
});
export const getToken = (state: RootState) => state.auth.token;
export const getRole = (state: RootState) => state.auth.role;
export const getUser = (state: RootState) => state.auth.user;
export const getUserId = (state: RootState) => state.auth.userId;

export type RootState = ReturnType<typeof store.getState>;
export default store;
