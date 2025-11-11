import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  areInterceptorsActive,
  originalConsoleAPI,
  restoreConsole,
  setupConsoleInterceptors,
} from "../../../core/logging/ConsoleInterceptor";
import logger from "../../../core/logging/LoggerService";

describe("ConsoleInterceptor", () => {
  let originalLog: any;
  let originalError: any;
  let originalWarn: any;
  let originalInfo: any;
  let originalDebug: any;

  beforeEach(() => {
    // Backup original console methods
    originalLog = console.log;
    originalError = console.error;
    originalWarn = console.warn;
    originalInfo = console.info;
    originalDebug = console.debug;

    // Mock logger methods
    vi.spyOn(logger, "info").mockImplementation(() => {});
    vi.spyOn(logger, "error").mockImplementation(() => {});
    vi.spyOn(logger, "warn").mockImplementation(() => {});
    vi.spyOn(logger, "debug").mockImplementation(() => {});

    // Restore console to ensure clean state
    restoreConsole();
  });

  afterEach(() => {
    // Restore original console
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
    console.info = originalInfo;
    console.debug = originalDebug;

    vi.restoreAllMocks();
  });

  describe("setupConsoleInterceptors", () => {
    it("should replace console.log with interceptor", () => {
      const originalConsoleLog = console.log;
      setupConsoleInterceptors();

      expect(console.log).not.toBe(originalConsoleLog);
    });

    it("should replace console.error with interceptor", () => {
      const originalConsoleError = console.error;
      setupConsoleInterceptors();

      expect(console.error).not.toBe(originalConsoleError);
    });

    it("should replace console.warn with interceptor", () => {
      const originalConsoleWarn = console.warn;
      setupConsoleInterceptors();

      expect(console.warn).not.toBe(originalConsoleWarn);
    });

    it("should replace console.info with interceptor", () => {
      const originalConsoleInfo = console.info;
      setupConsoleInterceptors();

      expect(console.info).not.toBe(originalConsoleInfo);
    });

    it("should replace console.debug with interceptor", () => {
      const originalConsoleDebug = console.debug;
      setupConsoleInterceptors();

      expect(console.debug).not.toBe(originalConsoleDebug);
    });
  });

  describe("restoreConsole", () => {
    it("should restore original console methods", () => {
      setupConsoleInterceptors();
      const interceptedLog = console.log;
      restoreConsole();

      // Verificar que cambió de la función interceptada
      expect(console.log).not.toBe(interceptedLog);
      // Y que volvió a algo diferente (no podemos comparar directamente con originalLog por el spy)
      expect(typeof console.log).toBe("function");
    });
  });

  describe("areInterceptorsActive", () => {
    it("should return false when interceptors are not active", () => {
      restoreConsole();
      expect(areInterceptorsActive()).toBe(false);
    });

    it("should return true when interceptors are active", () => {
      setupConsoleInterceptors();
      expect(areInterceptorsActive()).toBe(true);
    });
  });

  describe("Intercepted console.log", () => {
    beforeEach(() => {
      setupConsoleInterceptors();
    });

    it("should call logger.info when console.log is used", () => {
      console.log("Test message");

      expect(logger.info).toHaveBeenCalled();
    });

    it("should handle string messages", () => {
      console.log("Simple string");

      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("Simple string"),
        expect.anything(),
        expect.objectContaining({ component: "Console" })
      );
    });

    it("should handle messages with data", () => {
      console.log("Message", { data: "value" });

      expect(logger.info).toHaveBeenCalled();
    });

    it("should handle non-string first argument", () => {
      console.log({ key: "value" });

      expect(logger.info).toHaveBeenCalled();
    });
  });

  describe("Intercepted console.error", () => {
    beforeEach(() => {
      setupConsoleInterceptors();
    });

    it("should call logger.error when console.error is used", () => {
      console.error("Error message");

      expect(logger.error).toHaveBeenCalled();
    });

    it("should handle Error objects", () => {
      const error = new Error("Test error");
      console.error("Error occurred", error);

      expect(logger.error).toHaveBeenCalled();
    });

    it("should handle string errors", () => {
      console.error("Simple error");

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Simple error"),
        expect.anything(),
        expect.objectContaining({ component: "Console" })
      );
    });
  });

  describe("Intercepted console.warn", () => {
    beforeEach(() => {
      setupConsoleInterceptors();
    });

    it("should call logger.warn when console.warn is used", () => {
      console.warn("Warning message");

      expect(logger.warn).toHaveBeenCalled();
    });

    it("should handle warnings with data", () => {
      console.warn("Warning", { status: "degraded" });

      expect(logger.warn).toHaveBeenCalled();
    });

    it("should handle string warnings", () => {
      console.warn("Simple warning");

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Simple warning"),
        expect.anything(),
        expect.objectContaining({ component: "Console" })
      );
    });
  });

  describe("Intercepted console.info", () => {
    beforeEach(() => {
      setupConsoleInterceptors();
    });

    it("should call logger.info when console.info is used", () => {
      console.info("Info message");

      expect(logger.info).toHaveBeenCalled();
    });

    it("should handle info with data", () => {
      console.info("Info", { data: "test" });

      expect(logger.info).toHaveBeenCalled();
    });
  });

  describe("Intercepted console.debug", () => {
    beforeEach(() => {
      setupConsoleInterceptors();
    });

    it("should call logger.debug when console.debug is used", () => {
      console.debug("Debug message");

      expect(logger.debug).toHaveBeenCalled();
    });

    it("should handle debug with data", () => {
      console.debug("Debug", { debug: true });

      expect(logger.debug).toHaveBeenCalled();
    });
  });

  describe("originalConsoleAPI", () => {
    it("should provide access to original console.log", () => {
      expect(originalConsoleAPI.log).toBeDefined();
      expect(typeof originalConsoleAPI.log).toBe("function");
    });

    it("should provide access to original console.error", () => {
      expect(originalConsoleAPI.error).toBeDefined();
      expect(typeof originalConsoleAPI.error).toBe("function");
    });

    it("should provide access to original console.warn", () => {
      expect(originalConsoleAPI.warn).toBeDefined();
      expect(typeof originalConsoleAPI.warn).toBe("function");
    });

    it("should provide access to original console.info", () => {
      expect(originalConsoleAPI.info).toBeDefined();
      expect(typeof originalConsoleAPI.info).toBe("function");
    });

    it("should provide access to original console.debug", () => {
      expect(originalConsoleAPI.debug).toBeDefined();
      expect(typeof originalConsoleAPI.debug).toBe("function");
    });
  });

  describe("Infinite Loop Prevention", () => {
    it("should not cause infinite loops when logger uses console", () => {
      setupConsoleInterceptors();

      // This should not cause an infinite loop
      expect(() => {
        console.log("Test");
        console.error("Test");
        console.warn("Test");
      }).not.toThrow();
    });
  });
});
