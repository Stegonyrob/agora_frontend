import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("ContactService", () => {
  let contactService: any;
  const mockApiUrl = "http://api.test/contact";

  beforeEach(async () => {
    vi.stubEnv("VITE_API_ENDPOINT_CONTACT", mockApiUrl);

    // Clear module cache to get fresh instance with new env
    vi.resetModules();

    // Import service after env is set
    const module = await import("../../../core/contact/contactService");
    contactService = module.default;

    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe("sendContactForm", () => {
    it("should send contact form data successfully", async () => {
      const mockData = {
        name: "John Doe",
        email: "john@example.com",
        message: "Test message",
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      await expect(
        contactService.sendContactForm(mockData)
      ).resolves.toBeUndefined();

      expect(globalThis.fetch).toHaveBeenCalledWith(mockApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockData),
      });
    });

    it("should throw error when no data provided", async () => {
      await expect(contactService.sendContactForm(null)).rejects.toThrow(
        "No data provided for contact form submission"
      );

      expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it("should throw error when response is not ok", async () => {
      const mockData = {
        name: "John Doe",
        email: "john@example.com",
        message: "Test message",
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => "Bad Request",
      });

      await expect(contactService.sendContactForm(mockData)).rejects.toThrow(
        "Error al enviar el formulario de contacto: Bad Request"
      );
    });

    it("should handle network errors", async () => {
      const mockData = {
        name: "John Doe",
        email: "john@example.com",
        message: "Test message",
      };

      (globalThis.fetch as any).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(contactService.sendContactForm(mockData)).rejects.toThrow(
        "Network error"
      );
    });

    it("should send form with all required fields", async () => {
      const mockData = {
        name: "Jane Smith",
        email: "jane@example.com",
        message: "Hello, this is a test message",
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      await contactService.sendContactForm(mockData);

      const callArgs = (globalThis.fetch as any).mock.calls[0];
      const sentData = JSON.parse(callArgs[1].body);

      expect(sentData.name).toBe(mockData.name);
      expect(sentData.email).toBe(mockData.email);
      expect(sentData.message).toBe(mockData.message);
    });

    it("should use correct HTTP method and headers", async () => {
      const mockData = {
        name: "Test User",
        email: "test@example.com",
        message: "Test",
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      await contactService.sendContactForm(mockData);

      const callArgs = (globalThis.fetch as any).mock.calls[0];
      expect(callArgs[1].method).toBe("POST");
      expect(callArgs[1].headers["Content-Type"]).toBe("application/json");
    });
  });
});
