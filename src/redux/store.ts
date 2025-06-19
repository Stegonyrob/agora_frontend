import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";

// Nuevos reducers homogéneos desde core
import alertsReducer from "@/core/alerts/alertStore";
import attendeesReducer from "@/core/attendees/attendeeStore";
import sessionReducer from "@/core/auth/sessionStore";
import imagesReducer from "@/core/images/imageStore";
import legalTextsReducer from "@/core/legals/legalTextStore";
import postsReducer from "@/core/posts/postStore";
import profileReducer from "@/core/profiles/profileStore";
import repliesReducer from "@/core/replies/replyStore";
import textsReducer from "@/core/texts/textStore";
// Agrega aquí los demás reducers de core que hayas creado

const store = configureStore({
  reducer: {
    session: sessionReducer,
    alerts: alertsReducer,
    images: imagesReducer,
    posts: postsReducer,
    profile: profileReducer,
    texts: textsReducer,
    attendees: attendeesReducer,
    legalTexts: legalTextsReducer,
    replies: repliesReducer,
    // ...agrega aquí otros reducers de core si los tienes
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
