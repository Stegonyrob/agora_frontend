import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const getToken = (state: RootState) => state.auth.accessToken;
export const getRole = (state: RootState) => state.auth.role;
export const getUser = (state: RootState) => state.auth.user;
export const getUserId = (state: RootState) => state.auth.userId;
export const getIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const getUserById = (state: RootState, id: string) =>
  state.user.users.find((user: { id: string }) => user.id === id);

export const useAppSelector = <T>(selector: (state: RootState) => T) => {
  return selector(store.getState());
};

console.log("Initial state:", store.getState());
// Verificar los datos del authSlice almacenados en el store
console.log("Token:", getToken(store.getState()));
console.log("Role:", getRole(store.getState()));
console.log("User:", getUser(store.getState()));
console.log("UserId:", getUserId(store.getState()));

export default store;
