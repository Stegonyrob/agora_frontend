import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AlertRepository } from "../../../core/alerts/AlertRepository";
import { AlertService } from "../../../core/alerts/AlertService";
import { IAlert } from "../../../core/alerts/IAlert";
import { IAlertDTO } from "../../../core/alerts/IAlertDTO";

vi.mock("../../../core/alerts/AlertRepository");

describe("AlertService", () => {
  let alertService: AlertService;
  let mockRepository: AlertRepository;

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
    mockRepository = new AlertRepository();
    alertService = new AlertService(mockRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getAlerts", () => {
    it("should get all alerts successfully", async () => {
      const mockAlerts: IAlert[] = [
        mockAlert,
        { ...mockAlert, id: 2, type: "error" },
      ];
      vi.spyOn(mockRepository, "getAll").mockResolvedValue(mockAlerts);

      const result = await alertService.getAlerts();

      expect(result).toEqual(mockAlerts);
      expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    });

    it("should throw error when repository fails", async () => {
      const error = new Error("Repository error");
      vi.spyOn(mockRepository, "getAll").mockRejectedValue(error);

      await expect(alertService.getAlerts()).rejects.toThrow(
        "Repository error"
      );
    });
  });

  describe("getAlertById", () => {
    it("should get alert by id successfully", async () => {
      vi.spyOn(mockRepository, "getById").mockResolvedValue(mockAlert);

      const result = await alertService.getAlertById(1);

      expect(result).toEqual(mockAlert);
      expect(mockRepository.getById).toHaveBeenCalledWith(1);
    });

    it("should throw error when alert not found", async () => {
      const error = new Error("Alert not found");
      vi.spyOn(mockRepository, "getById").mockRejectedValue(error);

      await expect(alertService.getAlertById(999)).rejects.toThrow(
        "Alert not found"
      );
    });
  });

  describe("createAlert", () => {
    it("should create alert successfully", async () => {
      vi.spyOn(mockRepository, "create").mockResolvedValue(mockAlert);

      const result = await alertService.createAlert(mockAlertDTO);

      expect(result).toEqual(mockAlert);
      expect(mockRepository.create).toHaveBeenCalledWith(mockAlertDTO);
    });

    it("should throw error when creation fails", async () => {
      const error = new Error("Creation failed");
      vi.spyOn(mockRepository, "create").mockRejectedValue(error);

      await expect(alertService.createAlert(mockAlertDTO)).rejects.toThrow(
        "Creation failed"
      );
    });
  });

  describe("updateAlert", () => {
    it("should update alert successfully", async () => {
      const updatedAlert = { ...mockAlert, message: "Updated message" };
      vi.spyOn(mockRepository, "update").mockResolvedValue(updatedAlert);

      const result = await alertService.updateAlert(1, mockAlertDTO);

      expect(result).toEqual(updatedAlert);
      expect(mockRepository.update).toHaveBeenCalledWith(1, mockAlertDTO);
    });

    it("should throw error when update fails", async () => {
      const error = new Error("Update failed");
      vi.spyOn(mockRepository, "update").mockRejectedValue(error);

      await expect(alertService.updateAlert(1, mockAlertDTO)).rejects.toThrow(
        "Update failed"
      );
    });
  });

  describe("deleteAlert", () => {
    it("should delete alert successfully", async () => {
      vi.spyOn(mockRepository, "delete").mockResolvedValue(undefined);

      await alertService.deleteAlert(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it("should throw error when deletion fails", async () => {
      const error = new Error("Deletion failed");
      vi.spyOn(mockRepository, "delete").mockRejectedValue(error);

      await expect(alertService.deleteAlert(1)).rejects.toThrow(
        "Deletion failed"
      );
    });
  });
});
