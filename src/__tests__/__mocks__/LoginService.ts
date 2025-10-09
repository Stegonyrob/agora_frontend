import { vi } from "vitest";

export const mockLoginService = {
  login: vi.fn(),
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
};

export default class MockLoginService {
  login = mockLoginService.login;
  loginWithGoogle = mockLoginService.loginWithGoogle;
  logout = mockLoginService.logout;
  refreshToken = mockLoginService.refreshToken;
}
