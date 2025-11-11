import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AttendeeRepository } from "../../../core/attendees/AttendeeRepository";
import { AttendeeService } from "../../../core/attendees/AttendeeService";
import { IAttendee } from "../../../core/attendees/IAttendee";
import { IAttendeeDTO } from "../../../core/attendees/IAttendeeDTO";

vi.mock("../../../core/attendees/AttendeeRepository");

describe("AttendeeService", () => {
  let attendeeService: AttendeeService;
  let mockRepository: AttendeeRepository;

  const mockAttendee: IAttendee = {
    id: 1,
    eventId: 10,
    name: "John Doe",
    email: "john@example.com",
    registeredAt: "2024-01-15T10:00:00Z",
  };

  const mockAttendeeDTO: IAttendeeDTO = {
    eventId: 10,
    name: "John Doe",
    email: "john@example.com",
    phone: "+34600000000",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = new AttendeeRepository();
    attendeeService = new AttendeeService(mockRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getAttendees", () => {
    it("should get all attendees for an event successfully", async () => {
      const mockAttendees: IAttendee[] = [
        mockAttendee,
        { ...mockAttendee, id: 2 },
      ];
      vi.spyOn(mockRepository, "getAll").mockResolvedValue(mockAttendees);

      const result = await attendeeService.getAttendees(10);

      expect(result).toEqual(mockAttendees);
      expect(mockRepository.getAll).toHaveBeenCalledWith(10);
    });

    it("should throw error when repository fails", async () => {
      const error = new Error("Repository error");
      vi.spyOn(mockRepository, "getAll").mockRejectedValue(error);

      await expect(attendeeService.getAttendees(10)).rejects.toThrow(
        "Repository error"
      );
    });
  });

  describe("registerAttendee", () => {
    it("should register attendee successfully", async () => {
      vi.spyOn(mockRepository, "register").mockResolvedValue(mockAttendee);

      const sanitizedForm = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+34600000000",
      };

      const result = await attendeeService.registerAttendee(
        10,
        sanitizedForm,
        "recaptcha-token",
        mockAttendeeDTO
      );

      expect(result).toEqual(mockAttendee);
      expect(mockRepository.register).toHaveBeenCalledWith(10, mockAttendeeDTO);
    });

    it("should throw error when registration fails", async () => {
      const error = new Error("Registration failed");
      vi.spyOn(mockRepository, "register").mockRejectedValue(error);

      const sanitizedForm = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+34600000000",
      };

      await expect(
        attendeeService.registerAttendee(
          10,
          sanitizedForm,
          "token",
          mockAttendeeDTO
        )
      ).rejects.toThrow("Registration failed");
    });
  });

  describe("deleteAttendee", () => {
    it("should delete attendee successfully", async () => {
      vi.spyOn(mockRepository, "delete").mockResolvedValue(undefined);

      await attendeeService.deleteAttendee(10, 1);

      expect(mockRepository.delete).toHaveBeenCalledWith(10, 1);
    });

    it("should throw error when deletion fails", async () => {
      const error = new Error("Deletion failed");
      vi.spyOn(mockRepository, "delete").mockRejectedValue(error);

      await expect(attendeeService.deleteAttendee(10, 1)).rejects.toThrow(
        "Deletion failed"
      );
    });
  });

  describe("verifyRecaptcha", () => {
    it("should verify recaptcha successfully", async () => {
      vi.spyOn(mockRepository, "verifyRecaptcha").mockResolvedValue(0.9);

      const result = await attendeeService.verifyRecaptcha("recaptcha-token");

      expect(result).toBe(0.9);
      expect(mockRepository.verifyRecaptcha).toHaveBeenCalledWith(
        "recaptcha-token"
      );
    });

    it("should throw error when verification fails", async () => {
      const error = new Error("Verification failed");
      vi.spyOn(mockRepository, "verifyRecaptcha").mockRejectedValue(error);

      await expect(
        attendeeService.verifyRecaptcha("invalid-token")
      ).rejects.toThrow("Verification failed");
    });
  });
});
