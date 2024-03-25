// En authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
 currentUser: any;
 id: string;
 role: string;
}

const initialState: AuthState = {
  id: '',
  role: '',
  currentUser: undefined
};

const authSlice = createSlice({
 name: 'auth',
 initialState,
 reducers: {
    login: (state, action) => {
      state.id = action.payload.id;
      state.role = action.payload.role;
    },
    // Otros reducers...
 },
});

export const { login } = authSlice.actions;

export default authSlice.reducer;