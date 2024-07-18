import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import logoutReducer from "./logoutSlice";
import textSlice from "./textSlice";
import userReducer from "./userSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    logout: logoutReducer,
    user: userReducer,
    text: textSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
export const getToken = () => {
  return store.getState().auth.accessToken;
};
