import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginRepository } from "../../../core/auth/loginRepository";

describe("LoginRepository", () => {
  const mockUserRecoveryUrl =
    "http://localhost:8080/api/v1/user/password-recovery/request";
  const mockAdminRecoveryUrl =
    "http://localhost:8080/api/v1/admin/password-recovery/request";
  const mockUserResetUrl = "http://localhost:8080/api/v1/user/password-reset";
  const mockAdminResetUrl = "http://localhost:8080/api/v1/admin/password-reset";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv(
      "VITE_API_ENDPOINT_USER_PASSWORD_RECOVERY_REQUEST",
      mockUserRecoveryUrl
    );
    vi.stubEnv(
      "VITE_API_ENDPOINT_ADMIN_PASSWORD_RECOVERY_REQUEST",
      mockAdminRecoveryUrl
    );
    vi.stubEnv("VITE_API_ENDPOINT_USER_PASSWORD_RESET", mockUserResetUrl);
    vi.stubEnv("VITE_API_ENDPOINT_ADMIN_PASSWORD_RESET", mockAdminResetUrl);

    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
  });

  describe("requestPasswordRecovery", () => {
    it("should request password recovery for user successfully", async () => {
      const mockResponse = { success: true, message: "Recovery email sent" };
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await LoginRepository.requestPasswordRecovery(
        "user@example.com",
        false
      );

      expect(result).toEqual(mockResponse);
      expect(globalThis.fetch).toHaveBeenCalledWith(mockUserRecoveryUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "user@example.com" }),
      });
    });

    it("should request password recovery for admin successfully", async () => {
      const mockResponse = {
        success: true,
        message: "Admin recovery email sent",
      };
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await LoginRepository.requestPasswordRecovery(
        "admin@example.com",
        true
      );

      expect(result).toEqual(mockResponse);
      expect(globalThis.fetch).toHaveBeenCalledWith(mockAdminRecoveryUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@example.com" }),
      });
    });

    it("should default to user recovery when isAdmin is not provided", async () => {
      const mockResponse = { success: true };
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await LoginRepository.requestPasswordRecovery("user@example.com");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        mockUserRecoveryUrl,
        expect.any(Object)
      );
    });

    it("should throw error when endpoint is not configured", async () => {
      vi.stubEnv("VITE_API_ENDPOINT_USER_PASSWORD_RECOVERY_REQUEST", "");

      await expect(
        LoginRepository.requestPasswordRecovery("user@example.com", false)
      ).rejects.toThrow("Endpoint de recuperación no configurado");
    });

    it("should throw error when request fails", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: false,
        status: 400,
      } as Response);

      await expect(
        LoginRepository.requestPasswordRecovery("invalid@example.com", false)
      ).rejects.toThrow("Error en la solicitud");
    });

    it("should throw error when email does not exist", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      await expect(
        LoginRepository.requestPasswordRecovery("notfound@example.com", false)
      ).rejects.toThrow("Error en la solicitud");
    });
  });

  describe("resetPassword", () => {
    it("should reset password for user successfully", async () => {
      const mockResponse = {
        success: true,
        message: "Password reset successful",
      };
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await LoginRepository.resetPassword(
        "valid-token",
        "newPassword123",
        false
      );

      expect(result).toEqual(mockResponse);
      expect(globalThis.fetch).toHaveBeenCalledWith(mockUserResetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: "valid-token",
          newPassword: "newPassword123",
        }),
      });
    });

    it("should reset password for admin successfully", async () => {
      const mockResponse = { success: true, message: "Admin password reset" };
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await LoginRepository.resetPassword(
        "admin-token",
        "adminPass123",
        true
      );

      expect(result).toEqual(mockResponse);
      expect(globalThis.fetch).toHaveBeenCalledWith(mockAdminResetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: "admin-token",
          newPassword: "adminPass123",
        }),
      });
    });

    it("should default to user reset when isAdmin is not provided", async () => {
      const mockResponse = { success: true };
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await LoginRepository.resetPassword("token", "newPass");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        mockUserResetUrl,
        expect.any(Object)
      );
    });

    it("should throw error when endpoint is not configured", async () => {
      vi.stubEnv("VITE_API_ENDPOINT_USER_PASSWORD_RESET", "");

      await expect(
        LoginRepository.resetPassword("token", "newPass", false)
      ).rejects.toThrow("Endpoint de reseteo no configurado");
    });

    it("should throw error when token is invalid", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: false,
        status: 400,
      } as Response);

      await expect(
        LoginRepository.resetPassword("invalid-token", "newPass", false)
      ).rejects.toThrow("Token inválido o expirado");
    });

    it("should throw error when token is expired", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: false,
        status: 410,
      } as Response);

      await expect(
        LoginRepository.resetPassword("expired-token", "newPass", false)
      ).rejects.toThrow("Token inválido o expirado");
    });
  });
});
