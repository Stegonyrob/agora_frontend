import { configureStore } from "@reduxjs/toolkit";
import textsReducer from "./textSlice";
import userReducer from "./userSlice";
const store = configureStore({
  reducer: {
    text: textsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
