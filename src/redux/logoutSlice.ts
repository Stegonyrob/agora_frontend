import { createSlice } from "@reduxjs/toolkit";

export interface LogoutState {
  isLoggedOut: boolean;
}

const initialState: LogoutState = {
  isLoggedOut: false,
};

const logoutSlice = createSlice({
  name: "logout",
  initialState,
  reducers: {
    setLoggedOut: (state) => {
      state.isLoggedOut = true;
    },
    resetLoggedOut: (state) => {
      state.isLoggedOut = false;
    },
  },
});

export const { setLoggedOut, resetLoggedOut } = logoutSlice.actions;
export default logoutSlice.reducer;
