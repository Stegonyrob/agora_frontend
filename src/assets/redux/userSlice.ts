import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define el tipo de estado del usuario
interface UserState {
 user: {
    email: string;
    password: string;
 } | null;
}

// Define el estado inicial
const initialState: UserState = {
 user: null,
};

const userSlice = createSlice({
 name: 'user',
 initialState,
 reducers: {
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      state.user = action.payload;
    },
 },
});

export const { login } = userSlice.actions;

export default userSlice.reducer;