import { renderHook } from "@testing-library/react";
import { useSelector } from "react-redux";
import { vi } from "vitest";
import { useCurrentUser } from "../../hooks/useCurrentUser";

// Mock useSelector hook
vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

const mockUseSelector = vi.mocked(useSelector);

describe("useCurrentUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user session data when logged in", () => {
    const mockSession = {
      userId: 123,
      userName: "testUser",
      role: "ROLE_USER",
      isLoggedIn: true,
      useremail: "test@example.com",
    };

    mockUseSelector.mockReturnValue(mockSession);

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current).toEqual({
      userId: 123,
      userName: "testUser",
      userRole: "ROLE_USER",
      isLoggedIn: true,
      useremail: "test@example.com",
      isAdmin: false,
      isUser: true,
    });
  });

  it("should return admin flags when user is admin", () => {
    const mockSession = {
      userId: 456,
      userName: "adminUser",
      role: "ROLE_ADMIN",
      isLoggedIn: true,
      useremail: "admin@example.com",
    };

    mockUseSelector.mockReturnValue(mockSession);

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isUser).toBe(false);
    expect(result.current.userRole).toBe("ROLE_ADMIN");
  });

  it("should return default values when logged out", () => {
    const mockSession = {
      userId: null,
      userName: null,
      role: null,
      isLoggedIn: false,
      useremail: null,
    };

    mockUseSelector.mockReturnValue(mockSession);

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current).toEqual({
      userId: null,
      userName: null,
      userRole: null,
      isLoggedIn: false,
      useremail: null,
      isAdmin: false,
      isUser: false,
    });
  });

  it("should handle undefined role correctly", () => {
    const mockSession = {
      userId: 789,
      userName: "userWithoutRole",
      role: undefined,
      isLoggedIn: true,
      useremail: "norole@example.com",
    };

    mockUseSelector.mockReturnValue(mockSession);

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isUser).toBe(false);
    expect(result.current.userRole).toBe(undefined);
  });
});
