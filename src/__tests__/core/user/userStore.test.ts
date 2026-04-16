import { describe, expect, it } from "vitest";
import IUser from "../../../core/user/IUser";
import usersReducer, {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../../../core/user/userStore";

describe("userStore", () => {
  const mockUsers: IUser[] = [
    {
      id: 1,
      username: "user1",
      email: "user1@example.com",
      acceptedRules: true,
      firstName: "John",
      lastName1: "Doe",
      lastName2: "Smith",
      avatarId: 1,
      avatarUrl: "http://example.com/avatar1.jpg",
      avatarDisplayName: "Avatar 1",
      roles: ["USER"],
      banReason: null,
      fullName: "John Doe Smith",
      banned: false,
      admin: false,
    },
    {
      id: 2,
      username: "user2",
      email: "user2@example.com",
      acceptedRules: true,
      firstName: "Jane",
      lastName1: "Doe",
      lastName2: "Johnson",
      avatarId: 2,
      avatarUrl: "http://example.com/avatar2.jpg",
      avatarDisplayName: "Avatar 2",
      roles: ["USER", "ADMIN"],
      banReason: null,
      fullName: "Jane Doe Johnson",
      banned: false,
      admin: true,
    },
  ];

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = usersReducer(undefined, { type: "@@INIT" });

      expect(state.users).toEqual([]);
      expect(state.isLoaded).toBe(false);
    });
  });

  describe("reducer", () => {
    it("should handle fetchUsers.fulfilled action", () => {
      const action = {
        type: fetchUsers.fulfilled.type,
        payload: mockUsers,
      };

      const state = usersReducer(undefined, action);

      expect(state.users).toEqual(mockUsers);
      expect(state.isLoaded).toBe(true);
    });

    it("should handle fetchUsers.fulfilled with empty array", () => {
      const action = {
        type: fetchUsers.fulfilled.type,
        payload: [],
      };

      const state = usersReducer(undefined, action);

      expect(state.users).toEqual([]);
      expect(state.isLoaded).toBe(true);
    });

    it("should handle createUser.fulfilled action", () => {
      const newUser: IUser = {
        id: 3,
        username: "newuser",
        email: "newuser@example.com",
        acceptedRules: true,
        firstName: "New",
        lastName1: "User",
        lastName2: "Test",
        avatarId: null,
        avatarUrl: null,
        avatarDisplayName: null,
        roles: ["USER"],
        banReason: null,
        fullName: "New User Test",
        banned: false,
        admin: false,
      };

      const action = {
        type: createUser.fulfilled.type,
        payload: newUser,
      };

      const initialState = {
        users: [...mockUsers],
        isLoaded: true,
      };

      const state = usersReducer(initialState, action);

      expect(state.users).toHaveLength(3);
      expect(state.users[2]).toEqual(newUser);
    });

    it("should handle updateUser.fulfilled action", () => {
      const updatedUser: IUser = {
        ...mockUsers[0],
        email: "updated@example.com",
      };

      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser,
      };

      const initialState = {
        users: [...mockUsers],
        isLoaded: true,
      };

      const state = usersReducer(initialState, action);

      expect(state.users[0].email).toBe("updated@example.com");
    });

    it("should handle updateUser.fulfilled when user not found", () => {
      const nonExistentUser: IUser = {
        id: 999,
        username: "nonexistent",
        email: "nonexistent@example.com",
        acceptedRules: false,
        firstName: null,
        lastName1: null,
        lastName2: null,
        avatarId: null,
        avatarUrl: null,
        avatarDisplayName: null,
        roles: ["USER"],
        banReason: null,
        fullName: "",
        banned: false,
        admin: false,
      };

      const action = {
        type: updateUser.fulfilled.type,
        payload: nonExistentUser,
      };

      const initialState = {
        users: [...mockUsers],
        isLoaded: true,
      };

      const state = usersReducer(initialState, action);

      // User list should remain unchanged
      expect(state.users).toHaveLength(2);
      expect(state.users).toEqual(mockUsers);
    });

    it("should handle deleteUser.fulfilled action", () => {
      const action = {
        type: deleteUser.fulfilled.type,
        payload: 1,
      };

      const initialState = {
        users: [...mockUsers],
        isLoaded: true,
      };

      const state = usersReducer(initialState, action);

      expect(state.users).toHaveLength(1);
      expect(state.users.find((u) => u.id === 1)).toBeUndefined();
    });

    it("should handle deleteUser.fulfilled when user not found", () => {
      const action = {
        type: deleteUser.fulfilled.type,
        payload: 999,
      };

      const initialState = {
        users: [...mockUsers],
        isLoaded: true,
      };

      const state = usersReducer(initialState, action);

      // User list should remain unchanged
      expect(state.users).toHaveLength(2);
      expect(state.users).toEqual(mockUsers);
    });
  });
});
