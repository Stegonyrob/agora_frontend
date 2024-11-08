import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import alertsReducer from "./reducers/alertsSlice";

import imagesSlice from "../core/images/imageStore";
import loginReducer from "./reducers/loginSlice";
import logoutReducer from "./reducers/logoutSlice";
import postsReducer from "./reducers/postsSlice";
import textSlice from "./reducers/textSlice";
import userReducer from "./reducers/userSlice";

const store = configureStore({
  reducer: {
    logout: logoutReducer,
    user: userReducer,
    login: loginReducer,
    alerts: alertsReducer,
    text: textSlice,
    images: imagesSlice,
    posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
