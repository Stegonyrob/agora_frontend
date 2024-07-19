import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import alertsReducer from "./reducers/alertsSlice";
import authReducer from "./reducers/authSlice";
import loginReducer from "./reducers/loginSlice";
import logoutReducer from "./reducers/logoutSlice";
import postsReducer from "./reducers/postsSlice";
import textSlice from "./reducers/textSlice";
import userReducer from "./reducers/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    logout: logoutReducer,
    user: userReducer,
    login: loginReducer,
    alerts: alertsReducer,
    text: textSlice,
    posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
