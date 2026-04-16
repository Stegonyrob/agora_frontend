import { vi } from "vitest";

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

export class AuthService {
  login = mockAuthService.login;
  loginWithGoogle = mockAuthService.loginWithGoogle;
  loginWithFacebook = mockAuthService.loginWithFacebook;
  logout = mockAuthService.logout;
  refreshToken = mockAuthService.refreshToken;
  register = mockAuthService.register;
  requestPasswordReset = mockAuthService.requestPasswordReset;
  resetPassword = mockAuthService.resetPassword;
}
