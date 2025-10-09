import { vi } from "vitest";

// Mock window.google for Google OAuth
export const mockGoogleAuth = {
  accounts: {
    oauth2: {
      initTokenClient: vi.fn().mockReturnValue({
        requestAccessToken: vi.fn(),
      }),
    },
  },
};

// Mock window.FB for Facebook SDK
export const mockFacebookSDK = {
  init: vi.fn(),
  login: vi.fn(),
  api: vi.fn(),
};

// Mock reCAPTCHA
export const mockRecaptcha = {
  ready: vi.fn((callback) => callback()),
  execute: vi.fn().mockResolvedValue("mock-recaptcha-token"),
};

// Setup global mocks
export const setupGlobalMocks = () => {
  // Mock Google OAuth
  Object.defineProperty(window, "google", {
    value: mockGoogleAuth,
    writable: true,
  });

  // Mock Facebook SDK
  Object.defineProperty(window, "FB", {
    value: mockFacebookSDK,
    writable: true,
  });

  // Mock reCAPTCHA
  Object.defineProperty(window, "grecaptcha", {
    value: mockRecaptcha,
    writable: true,
  });

  // Mock localStorage
  const mockStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  Object.defineProperty(window, "localStorage", {
    value: mockStorage,
    writable: true,
  });

  // Mock sessionStorage
  Object.defineProperty(window, "sessionStorage", {
    value: mockStorage,
    writable: true,
  });

  // Mock fetch
  global.fetch = vi.fn();

  // Mock console methods to reduce noise in tests
  console.error = vi.fn();
  console.warn = vi.fn();
  console.log = vi.fn();
};

// Reset all global mocks
export const resetGlobalMocks = () => {
  vi.clearAllMocks();

  // Reset Google OAuth
  mockGoogleAuth.accounts.oauth2.initTokenClient.mockReturnValue({
    requestAccessToken: vi.fn(),
  });

  // Reset Facebook SDK
  mockFacebookSDK.init.mockClear();
  mockFacebookSDK.login.mockClear();
  mockFacebookSDK.api.mockClear();

  // Reset reCAPTCHA
  mockRecaptcha.ready.mockImplementation((callback) => callback());
  mockRecaptcha.execute.mockResolvedValue("mock-recaptcha-token");
};
