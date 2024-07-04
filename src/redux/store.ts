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
export type RootState = ReturnType<typeof store.getState>;
export default store;
