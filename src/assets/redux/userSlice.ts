import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
 userId: string | null;
 role: string | null;
}

const initialState: UserState = {
 userId: null,
 role: null,
};

export const userSlice = createSlice({
 name: 'user',
 initialState,
 reducers: {
    loginUser: (state, action: PayloadAction<{ userId: string; role: string }>) => {
      state.userId = action.payload.userId;
      state.role = action.payload.role;
    },
    clearErrorMessage: (state) => {
      state.userId = null;
      state.role = null;
    },
 },
});

export const { loginUser, clearErrorMessage } = userSlice.actions;

export default userSlice.reducer;
