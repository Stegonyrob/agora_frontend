import { beforeEach, describe, expect, it, vi } from "vitest";
import { ISession } from "../../../core/auth/ISession";
import { ITokenDTO } from "../../../core/auth/ITokenDTO";
import sessionReducer, {
  login,
  logout,
  setSession,
  updateAvatarUrl,
} from "../../../core/auth/sessionStore";

describe("sessionStore", () => {
  const initialState: ISession = {
    userId: 0,
    role: "",
    userName: "",
    isLoggedIn: false,
    useremail: "",
    accessToken: "",
    refreshToken: "",
    viewAsUser: false,
  };

  const mockTokenDTO: ITokenDTO = {
    userId: 123,
    role: "USER",
    userName: "testuser",
    useremail: "test@example.com",
    accessToken: "access-token-123",
    refreshToken: "refresh-token-123",
    isLoggedIn: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    // Mock document.cookie
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      expect(sessionReducer(undefined, { type: "unknown" })).toEqual(
        initialState
      );
    });
  });

  describe("login action", () => {
    it("should handle login action", () => {
      const state = sessionReducer(initialState, login(mockTokenDTO));

      expect(state.userId).toBe(123);
      expect(state.role).toBe("USER");
      expect(state.userName).toBe("testuser");
      expect(state.useremail).toBe("test@example.com");
      expect(state.isLoggedIn).toBe(true);
      expect(state.accessToken).toBe("access-token-123");
      expect(state.refreshToken).toBe("refresh-token-123");
    });

    it("should handle admin login", () => {
      const adminToken: ITokenDTO = {
        ...mockTokenDTO,
        role: "ADMIN",
        userName: "adminuser",
      };

      const state = sessionReducer(initialState, login(adminToken));

      expect(state.role).toBe("ADMIN");
      expect(state.userName).toBe("adminuser");
    });

    it("should update existing session on login", () => {
      const existingState: ISession = {
        ...initialState,
        userId: 999,
        role: "OLD_ROLE",
      };

      const state = sessionReducer(existingState, login(mockTokenDTO));

      expect(state.userId).toBe(123);
      expect(state.role).toBe("USER");
    });
  });

  describe("setViewAsUser action", () => {
    it("should set viewAsUser to true", () => {
      const state = sessionReducer(
        initialState,
        setSession({ viewAsUser: true } as ISession)
      );

      expect(state.viewAsUser).toBe(true);
    });

    it("should set viewAsUser to false", () => {
      const existingState: ISession = { ...initialState, viewAsUser: true };
      const state = sessionReducer(
        existingState,
        setSession({ viewAsUser: false } as ISession)
      );

      expect(state.viewAsUser).toBe(false);
    });
  });

  describe("logout action", () => {
    it("should reset state to initial values on logout", () => {
      const loggedInState: ISession = {
        userId: 123,
        role: "USER",
        userName: "testuser",
        useremail: "test@example.com",
        isLoggedIn: true,
        accessToken: "token",
        refreshToken: "refresh",
        viewAsUser: false,
      };

      const state = sessionReducer(loggedInState, logout());

      expect(state.userId).toBe(0);
      expect(state.role).toBe("");
      expect(state.userName).toBe("");
      expect(state.useremail).toBe("");
      expect(state.isLoggedIn).toBe(false);
      // accessToken and refreshToken are not reset by logout reducer
      // They remain from the previous state (this is the current implementation)
      expect(state.accessToken).toBe("token");
      expect(state.refreshToken).toBe("refresh");
    });
  });

  describe("setSession action", () => {
    it("should set complete session", () => {
      const newSession: ISession = {
        userId: 456,
        role: "ADMIN",
        userName: "adminuser",
        useremail: "admin@example.com",
        isLoggedIn: true,
        accessToken: "admin-token",
        refreshToken: "admin-refresh",
        viewAsUser: true,
        avatarUrl: "https://example.com/avatar.jpg",
      };

      const state = sessionReducer(initialState, setSession(newSession));

      expect(state).toEqual(newSession);
    });

    it("should update partial session properties", () => {
      const existingState: ISession = {
        ...initialState,
        userId: 123,
        userName: "user",
      };

      const partialSession: Partial<ISession> = {
        role: "ADMIN",
        avatarUrl: "new-avatar.jpg",
      };

      const state = sessionReducer(
        existingState,
        setSession(partialSession as ISession)
      );

      expect(state.userId).toBe(123);
      expect(state.userName).toBe("user");
      expect(state.role).toBe("ADMIN");
      expect(state.avatarUrl).toBe("new-avatar.jpg");
    });
  });

  describe("updateAvatarUrl action", () => {
    it("should update avatar URL", () => {
      const state = sessionReducer(
        initialState,
        updateAvatarUrl("https://example.com/avatar.jpg")
      );

      expect(state.avatarUrl).toBe("https://example.com/avatar.jpg");
    });

    it("should replace existing avatar URL", () => {
      const existingState: ISession = {
        ...initialState,
        avatarUrl: "old-avatar.jpg",
      };

      const state = sessionReducer(
        existingState,
        updateAvatarUrl("new-avatar.jpg")
      );

      expect(state.avatarUrl).toBe("new-avatar.jpg");
    });

    it("should allow setting avatar URL to empty string", () => {
      const state = sessionReducer(initialState, updateAvatarUrl(""));

      expect(state.avatarUrl).toBe("");
    });
  });

  describe("complex scenarios", () => {
    it("should handle login, update avatar, then logout sequence", () => {
      let state = sessionReducer(initialState, login(mockTokenDTO));
      expect(state.isLoggedIn).toBe(true);

      state = sessionReducer(state, updateAvatarUrl("avatar.jpg"));
      expect(state.avatarUrl).toBe("avatar.jpg");

      state = sessionReducer(state, logout());
      expect(state.isLoggedIn).toBe(false);
      expect(state.userId).toBe(0);
    });

    it("should handle multiple session updates", () => {
      let state = sessionReducer(initialState, login(mockTokenDTO));

      state = sessionReducer(state, updateAvatarUrl("avatar.jpg"));
      expect(state.avatarUrl).toBe("avatar.jpg");

      state = sessionReducer(state, setSession({ ...state, viewAsUser: true }));
      expect(state.viewAsUser).toBe(true);

      expect(state.userId).toBe(123);
      expect(state.isLoggedIn).toBe(true);
    });
  });
});
