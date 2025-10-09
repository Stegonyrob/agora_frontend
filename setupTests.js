import "@testing-library/jest-dom";
import { vi } from "vitest";
import { setupGlobalMocks } from "./src/__tests__/mocks/globalMocks";

// Setup global mocks before all tests
setupGlobalMocks();

// Configure Vitest globals to be available
globalThis.vi = vi;

// Mock environment variables
vi.mock("import.meta", () => ({
  env: {
    VITE_API_ENDPOINT_GENERAL: "http://localhost:8080/api/v1",
    VITE_API_ENDPOINT_LOGIN: "http://localhost:8080/api/v1/all/login",
    VITE_API_ENDPOINT_REGISTER: "http://localhost:8080/api/v1/all/register",
    VITE_GOOGLE_CLIENT_ID: "mock-google-client-id",
    VITE_RECAPTCHA_SITE_KEY: "mock-recaptcha-key",
    VITE_NODE_ENV: "test",
  },
}));

// Suppress console errors/warnings in tests unless debugging
if (!import.meta.env?.DEBUG_TESTS) {
  console.error = vi.fn();
  console.warn = vi.fn();
}
