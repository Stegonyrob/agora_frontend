import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AttendeeRepository } from "../../../core/attendees/AttendeeRepository";
import { IAttendee } from "../../../core/attendees/IAttendee";
import { IAttendeeDTO } from "../../../core/attendees/IAttendeeDTO";
import * as AuthHeaders from "../../../core/auth/AuthHeaders";

vi.mock("axios");
vi.mock("../../../core/auth/AuthHeaders");

describe("AttendeeRepository", () => {
  let repository: AttendeeRepository;
  const mockUri = "http://localhost:8080/api/v1/attendees";

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
    vi.stubEnv("VITE_API_ENDPOINT_ATTENDEES", mockUri);
    vi.spyOn(AuthHeaders, "getAuthHeaders").mockReturnValue({
      Authorization: "Bearer token",
    });
    repository = new AttendeeRepository();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
  });

  describe("getAll", () => {
    it("should fetch all attendees for an event successfully", async () => {
      const mockAttendees: IAttendee[] = [
        mockAttendee,
        { ...mockAttendee, id: 2 },
      ];
      vi.mocked(axios.get).mockResolvedValue({ data: mockAttendees });

      const result = await repository.getAll(10);

      expect(result).toEqual(mockAttendees);
      expect(axios.get).toHaveBeenCalledWith(`${mockUri}/10`, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should throw error when request fails", async () => {
      const error = new Error("Network error");
      vi.mocked(axios.get).mockRejectedValue(error);

      await expect(repository.getAll(10)).rejects.toThrow("Network error");
    });
  });

  describe("register", () => {
    it("should register attendee successfully", async () => {
      vi.mocked(axios.post).mockResolvedValue({ data: mockAttendee });

      const result = await repository.register(10, mockAttendeeDTO);

      expect(result).toEqual(mockAttendee);
      expect(axios.post).toHaveBeenCalledWith(
        `${mockUri}/10`,
        mockAttendeeDTO,
        {
          headers: { Authorization: "Bearer token" },
        }
      );
    });

    it("should throw error when registration fails", async () => {
      const error = new Error("Registration failed");
      vi.mocked(axios.post).mockRejectedValue(error);

      await expect(repository.register(10, mockAttendeeDTO)).rejects.toThrow(
        "Registration failed"
      );
    });
  });

  describe("delete", () => {
    it("should delete attendee successfully", async () => {
      vi.mocked(axios.delete).mockResolvedValue({ data: undefined });

      await repository.delete(10, 1);

      expect(axios.delete).toHaveBeenCalledWith(`${mockUri}/10/1`, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should throw error when deletion fails", async () => {
      const error = new Error("Deletion failed");
      vi.mocked(axios.delete).mockRejectedValue(error);

      await expect(repository.delete(10, 1)).rejects.toThrow("Deletion failed");
    });
  });

  describe("verifyRecaptcha", () => {
    it("should verify recaptcha successfully with high score", async () => {
      vi.mocked(axios.post).mockResolvedValue({ data: { score: 0.9 } });

      const result = await repository.verifyRecaptcha("recaptcha-token");

      expect(result).toBe(0.9);
      expect(axios.post).toHaveBeenCalledWith(`${mockUri}/recaptcha/verify`, {
        token: "recaptcha-token",
      });
    });

    it("should verify recaptcha with low score", async () => {
      vi.mocked(axios.post).mockResolvedValue({ data: { score: 0.3 } });

      const result = await repository.verifyRecaptcha("suspicious-token");

      expect(result).toBe(0.3);
    });

    it("should throw error when verification fails", async () => {
      const error = new Error("Verification failed");
      vi.mocked(axios.post).mockRejectedValue(error);

      await expect(repository.verifyRecaptcha("invalid-token")).rejects.toThrow(
        "Verification failed"
      );
    });
  });
});
