import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  isAuthenticated: boolean;
  // Otros campos del usuario
}

const initialState: UserState = {
  username: '',
  isAuthenticated: false,
  // Inicializa otros campos del usuario
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<UserState>) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
