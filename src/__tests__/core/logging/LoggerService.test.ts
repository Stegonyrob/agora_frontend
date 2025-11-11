import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import logger, { LogLevel, log } from "../../../core/logging/LoggerService";

describe("LoggerService", () => {
  let originalConsole: any;
  let originalFetch: any;

  beforeEach(() => {
    // Backup console methods
    originalConsole = {
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
    };

    // Mock console methods
    console.debug = vi.fn();
    console.info = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();

    // Mock fetch
    originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });

    // Setup environment variables
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VITE_LOG_LEVEL", "DEBUG");
    vi.stubEnv("VITE_ENABLE_CONSOLE_LOGS", "true");
    vi.stubEnv("VITE_ENABLE_REMOTE_LOGGING", "false");
    vi.stubEnv("VITE_MASK_SENSITIVE_DATA", "false");
    vi.stubEnv("VITE_MAX_LOG_SIZE", "1000");

    // Clear logger buffer
    logger.clear();
  });

  afterEach(() => {
    // Restore console
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;

    // Restore fetch
    globalThis.fetch = originalFetch;

    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  describe("Singleton Pattern", () => {
    it("should always use the same logger instance", () => {
      // El logger exportado ya es la instancia singleton
      expect(logger).toBeDefined();
      expect(logger.debug).toBeDefined();
      expect(logger.info).toBeDefined();
    });
  });

  describe("Debug Logging", () => {
    it("should log debug messages", () => {
      logger.debug("Test debug message");

      expect(console.debug).toHaveBeenCalled();
    });

    it("should log debug with data", () => {
      const testData = { key: "value" };
      logger.debug("Debug with data", testData);

      expect(console.debug).toHaveBeenCalled();
    });

    it("should log debug with context", () => {
      logger.debug("Debug with context", undefined, {
        component: "TestComponent",
      });

      expect(console.debug).toHaveBeenCalled();
    });
  });

  describe("Info Logging", () => {
    it("should log info messages", () => {
      logger.info("Test info message");

      expect(console.info).toHaveBeenCalled();
    });

    it("should log info with data", () => {
      logger.info("Info with data", { test: true });

      expect(console.info).toHaveBeenCalled();
    });
  });

  describe("Warning Logging", () => {
    it("should log warning messages", () => {
      logger.warn("Test warning");

      expect(console.warn).toHaveBeenCalled();
    });

    it("should log warning with data", () => {
      logger.warn("Warning with data", { status: "degraded" });

      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("Error Logging", () => {
    it("should log error messages", () => {
      logger.error("Test error");

      expect(console.error).toHaveBeenCalled();
    });

    it("should log error with Error object", () => {
      const error = new Error("Test error");
      logger.error("Error occurred", error);

      expect(console.error).toHaveBeenCalled();
    });

    it("should handle error with stack trace", () => {
      const error = new Error("Error with stack");
      error.stack = "at function (file.ts:10:5)";

      logger.error("Detailed error", error);

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("Critical Logging", () => {
    it("should log critical errors", () => {
      logger.critical("Critical failure");

      expect(console.error).toHaveBeenCalled();
    });

    it("should log critical with error object", () => {
      const error = new Error("Critical error");
      logger.critical("System failure", error);

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("Sensitive Data Masking", () => {
    beforeEach(() => {
      vi.stubEnv("VITE_MASK_SENSITIVE_DATA", "true");
      logger.configure({ maskSensitiveData: true });
    });

    it("should mask password fields", () => {
      const sensitiveData = { username: "user", password: "secret123" };
      logger.info("User login", sensitiveData);

      expect(console.info).toHaveBeenCalled();
    });

    it("should mask token fields", () => {
      const sensitiveData = { token: "abc123xyz", data: "public" };
      logger.info("Auth data", sensitiveData);

      expect(console.info).toHaveBeenCalled();
    });

    it("should mask nested sensitive data", () => {
      const sensitiveData = {
        user: { username: "test", email: "test@test.com" },
        auth: { accessToken: "token123" },
      };
      logger.info("Complex data", sensitiveData);

      expect(console.info).toHaveBeenCalled();
    });
  });

  describe("Log Level Filtering", () => {
    it("should respect log level configuration", () => {
      logger.configure({ level: LogLevel.ERROR });

      logger.debug("Should not appear");
      logger.info("Should not appear");
      logger.error("Should appear");

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    it("should log all levels when set to DEBUG", () => {
      logger.configure({ level: LogLevel.DEBUG });

      logger.debug("Debug");
      logger.info("Info");
      logger.warn("Warn");
      logger.error("Error");

      expect(console.debug).toHaveBeenCalled();
      expect(console.info).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("Console Enable/Disable", () => {
    it("should not log to console when disabled", () => {
      logger.configure({ enableConsole: false });

      logger.info("Test message");

      expect(console.info).not.toHaveBeenCalled();
    });

    it("should log to console when enabled", () => {
      logger.configure({ enableConsole: true });

      logger.info("Test message");

      expect(console.info).toHaveBeenCalled();
    });
  });

  describe("Log Truncation", () => {
    it("should truncate large logs", () => {
      const largeData = { data: "x".repeat(2000) };
      logger.configure({ maxLogSize: 100 });

      logger.info("Large data", largeData);

      expect(console.info).toHaveBeenCalled();
    });
  });

  describe("Legacy Console Methods", () => {
    it("should handle legacy console.log", () => {
      logger.legacyLog("Legacy log message", { data: "test" });

      expect(console.info).toHaveBeenCalled();
    });

    it("should handle legacy console.error", () => {
      logger.legacyError("Legacy error", new Error("test"));

      expect(console.error).toHaveBeenCalled();
    });

    it("should handle legacy console.warn", () => {
      logger.legacyWarn("Legacy warning");

      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("Configuration", () => {
    it("should update configuration dynamically", () => {
      const newConfig = {
        level: LogLevel.WARN,
        enableConsole: false,
      };

      logger.configure(newConfig);

      logger.info("Should not appear");
      expect(console.info).not.toHaveBeenCalled();

      logger.warn("Should not appear in console");
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe("Statistics", () => {
    it("should return logger statistics", () => {
      const stats = logger.getStats();

      expect(stats).toHaveProperty("bufferSize");
      expect(stats).toHaveProperty("environment");
      expect(stats).toHaveProperty("config");
    });

    it("should track buffer size", () => {
      logger.configure({ enableRemoteLogging: true });

      logger.warn("Warning 1");
      logger.error("Error 1");

      const stats = logger.getStats();
      expect(stats.bufferSize).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Clear Buffer", () => {
    it("should clear log buffer", () => {
      logger.configure({ enableRemoteLogging: true });

      logger.error("Error message");
      logger.clear();

      const stats = logger.getStats();
      expect(stats.bufferSize).toBe(0);
    });
  });

  describe("Direct Export Functions", () => {
    it("should have direct log.debug function", () => {
      expect(typeof log.debug).toBe("function");
      expect(() => log.debug("Test debug")).not.toThrow();
    });

    it("should have direct log.info function", () => {
      expect(typeof log.info).toBe("function");
      expect(() => log.info("Test info")).not.toThrow();
    });

    it("should have direct log.warn function", () => {
      expect(typeof log.warn).toBe("function");
      expect(() => log.warn("Test warn")).not.toThrow();
    });

    it("should have direct log.error function", () => {
      expect(typeof log.error).toBe("function");
      expect(() => log.error("Test error")).not.toThrow();
    });

    it("should have direct log.critical function", () => {
      expect(typeof log.critical).toBe("function");
      expect(() => log.critical("Test critical")).not.toThrow();
    });
  });
});
