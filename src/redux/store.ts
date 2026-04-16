import { configureStore } from "@reduxjs/toolkit";

// Nuevos reducers homogéneos desde core
import alertsReducer from "@/core/alerts/alertStore";
import attendeesReducer from "@/core/attendees/attendeeStore";
import sessionReducer from "@/core/auth/sessionStore";
import avatarsReducer from "@/core/avatars/avatarStore";
import commentsReducer from "@/core/comments/commetStore";
import imagesReducer from "@/core/images/imageStore";
import legalTextsReducer from "@/core/legals/legalTextStore";
import postsReducer from "@/core/posts/postStore";
import profileReducer from "@/core/profiles/profileStore";
import repliesReducer from "@/core/replies/replyStore";
import tagsReducer from "@/core/tags/tagStore";
import textsReducer from "@/core/texts/textStore";
// Agrega aquí los demás reducers de core que hayas creado
// Hidrata el estado de sesión desde sessionStorage
const persistedSession =
  sessionStorage.getItem("isLoggedIn") === "true"
    ? {
        userId: Number(sessionStorage.getItem("userId")) || 0,
        role: sessionStorage.getItem("role") || "",
        userName: sessionStorage.getItem("userName") || "",
        isLoggedIn: true,
        useremail: sessionStorage.getItem("useremail") || "",
        accessToken: sessionStorage.getItem("accessToken") || "",
        refreshToken: sessionStorage.getItem("refreshToken") || "",
      }
    : null;

const preloadedState = persistedSession ? { session: persistedSession } : {};

const store = configureStore({
  reducer: {
    session: sessionReducer,
    alerts: alertsReducer,
    avatars: avatarsReducer,
    images: imagesReducer,
    posts: postsReducer,
    profile: profileReducer,
    tags: tagsReducer,
    texts: textsReducer,
    attendees: attendeesReducer,
    legalTexts: legalTextsReducer,
    replies: repliesReducer,
    comments: commentsReducer,
    // ...agrega aquí otros reducers de core si los tienes
  },
  preloadedState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
