import { vi } from "vitest";

// Mock auth services
export const mockLoginRepository = {
  login: vi.fn(),
  loginWithGoogle: vi.fn(),
  loginWithFacebook: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
  requestPasswordRecovery: vi.fn(),
  resetPassword: vi.fn(),
};

export const mockLoginService = {
  login: vi.fn(),
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
};

export const mockAuthService = {
  login: vi.fn(),
  loginWithGoogle: vi.fn(),
  loginWithFacebook: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
  register: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
};

// Mock responses for auth services
export const mockAuthResponses = {
  loginSuccess: {
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlcyI6IlJPTEVfVVNFUiIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJleHAiOjk5OTk5OTk5OTl9.8kn7eZYbZHpjJx7AHH4eP9wJzN6LgZwQ5qD3gRf4QqI",
    refreshToken: "mock-refresh-token",
    userId: 1,
    user: {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      role: "ROLE_USER",
    },
  },

  loginError: {
    message: "Invalid credentials",
    status: 401,
  },

  registerSuccess: {
    message: "User registered successfully",
    userId: 1,
    user: {
      id: 1,
      username: "newuser",
      email: "newuser@example.com",
    },
  },

  googleAuthSuccess: {
    accessToken: "google-access-token",
    refreshToken: "google-refresh-token",
    userId: 2,
    user: {
      id: 2,
      username: "googleuser",
      email: "google@example.com",
      provider: "google",
    },
  },

  passwordResetSuccess: {
    message: "Password reset email sent successfully",
  },
};

// Mock the actual modules
vi.mock("../../../core/auth/LoginRepository", () => ({
  LoginRepository: mockLoginRepository,
}));

vi.mock("../../../core/auth/LoginService", () => ({
  default: class MockLoginService {
    login = mockLoginService.login;
    loginWithGoogle = mockLoginService.loginWithGoogle;
    logout = mockLoginService.logout;
    refreshToken = mockLoginService.refreshToken;
  },
}));

vi.mock("../../../core/auth/AuthService", () => ({
  AuthService: class MockAuthService {
    login = mockAuthService.login;
    loginWithGoogle = mockAuthService.loginWithGoogle;
    loginWithFacebook = mockAuthService.loginWithFacebook;
    logout = mockAuthService.logout;
    refreshToken = mockAuthService.refreshToken;
    register = mockAuthService.register;
    requestPasswordReset = mockAuthService.requestPasswordReset;
    resetPassword = mockAuthService.resetPassword;
  },
}));
