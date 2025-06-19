import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import IUser from "./IUser";
import IUserDTO from "./IUserDTO";
import UserService from "./UserService";

const service = new UserService();

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return await service.getAllUsers();
});

export const createUser = createAsyncThunk(
  "users/createUser",
  async (user: IUserDTO) => {
    return await service.createUser(user);
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, user }: { id: number; user: IUserDTO }) => {
    return await service.updateUser(id, user);
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: number) => {
    await service.deleteUser(id);
    return id;
  }
);

interface UsersState {
  users: IUser[];
  isLoaded: boolean;
}

const usersSlice = createSlice({
  name: "users",
  initialState: { users: [], isLoaded: false } as UsersState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isLoaded = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
