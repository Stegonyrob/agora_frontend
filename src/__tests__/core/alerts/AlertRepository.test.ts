import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AlertRepository } from "../../../core/alerts/AlertRepository";
import { IAlert } from "../../../core/alerts/IAlert";
import { IAlertDTO } from "../../../core/alerts/IAlertDTO";
import * as AuthHeaders from "../../../core/auth/AuthHeaders";

vi.mock("axios");
vi.mock("../../../core/auth/AuthHeaders");

describe("AlertRepository", () => {
  let repository: AlertRepository;
  const mockUri = "http://localhost:8080/api/v1/alerts";

  const mockAlert: IAlert = {
    id: 1,
    type: "success",
    message: "Test alert message",
  };

  const mockAlertDTO: IAlertDTO = {
    title: "Test Alert",
    message: "Test alert message",
    type: "success",
    isActive: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_API_ENDPOINT_ALERTS", mockUri);
    vi.spyOn(AuthHeaders, "getAuthHeaders").mockReturnValue({
      Authorization: "Bearer token",
    });
    repository = new AlertRepository();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
  });

  describe("getAll", () => {
    it("should fetch all alerts successfully", async () => {
      const mockAlerts: IAlert[] = [
        mockAlert,
        { ...mockAlert, id: 2, type: "error" },
      ];
      vi.mocked(axios.get).mockResolvedValue({ data: mockAlerts });

      const result = await repository.getAll();

      expect(result).toEqual(mockAlerts);
      expect(axios.get).toHaveBeenCalledWith(mockUri, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should throw error when request fails", async () => {
      const error = new Error("Network error");
      vi.mocked(axios.get).mockRejectedValue(error);

      await expect(repository.getAll()).rejects.toThrow("Network error");
    });
  });

  describe("getById", () => {
    it("should fetch alert by id successfully", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockAlert });

      const result = await repository.getById(1);

      expect(result).toEqual(mockAlert);
      expect(axios.get).toHaveBeenCalledWith(`${mockUri}/1`, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should throw error when alert not found", async () => {
      const error = new Error("Alert not found");
      vi.mocked(axios.get).mockRejectedValue(error);

      await expect(repository.getById(999)).rejects.toThrow("Alert not found");
    });
  });

  describe("create", () => {
    it("should create alert successfully", async () => {
      vi.mocked(axios.post).mockResolvedValue({ data: mockAlert });

      const result = await repository.create(mockAlertDTO);

      expect(result).toEqual(mockAlert);
      expect(axios.post).toHaveBeenCalledWith(mockUri, mockAlertDTO, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should throw error when creation fails", async () => {
      const error = new Error("Creation failed");
      vi.mocked(axios.post).mockRejectedValue(error);

      await expect(repository.create(mockAlertDTO)).rejects.toThrow(
        "Creation failed"
      );
    });
  });

  describe("update", () => {
    it("should update alert successfully", async () => {
      const updatedAlert = { ...mockAlert, message: "Updated message" };
      vi.mocked(axios.put).mockResolvedValue({ data: updatedAlert });

      const result = await repository.update(1, mockAlertDTO);

      expect(result).toEqual(updatedAlert);
      expect(axios.put).toHaveBeenCalledWith(`${mockUri}/1`, mockAlertDTO, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should throw error when update fails", async () => {
      const error = new Error("Update failed");
      vi.mocked(axios.put).mockRejectedValue(error);

      await expect(repository.update(1, mockAlertDTO)).rejects.toThrow(
        "Update failed"
      );
    });
  });

  describe("delete", () => {
    it("should delete alert successfully", async () => {
      vi.mocked(axios.delete).mockResolvedValue({ data: undefined });

      await repository.delete(1);

      expect(axios.delete).toHaveBeenCalledWith(`${mockUri}/1`, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should throw error when deletion fails", async () => {
      const error = new Error("Deletion failed");
      vi.mocked(axios.delete).mockRejectedValue(error);

      await expect(repository.delete(1)).rejects.toThrow("Deletion failed");
    });
  });
});
