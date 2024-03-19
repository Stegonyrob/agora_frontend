import { configureStore } from "@reduxjs/toolkit";
import textsReducer from "./textSlice";

 const store = configureStore({
    reducer:{
        text: textsReducer,
    }
});
export default store;