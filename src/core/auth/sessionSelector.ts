import type { RootState } from "@/redux/store";

export const selectSession = (state: RootState) => state.session;
export const selectIsLoggedIn = (state: RootState) => state.session.isLoggedIn;
export const selectUserRole = (state: RootState) => state.session.role;
