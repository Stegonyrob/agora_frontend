import { describe, expect, it } from "vitest";
import attendeesReducer, {
  deleteAttendee,
  fetchAttendees,
  registerAttendee,
} from "../../../core/attendees/attendeeStore";
import { IAttendee } from "../../../core/attendees/IAttendee";

describe("attendeeStore", () => {
  const mockAttendee: IAttendee = {
    id: 1,
    eventId: 10,
    name: "John Doe",
    email: "john@example.com",
    registeredAt: new Date().toISOString(),
  };

  describe("Initial State", () => {
    it("should return initial state", () => {
      const state = attendeesReducer(undefined, { type: "@@INIT" });
      expect(state).toEqual({
        attendees: [],
        isLoaded: false,
      });
    });
  });

  describe("fetchAttendees", () => {
    it("should handle fetchAttendees.fulfilled", () => {
      const attendees = [mockAttendee];
      const action = {
        type: fetchAttendees.fulfilled.type,
        payload: attendees,
      };
      const state = attendeesReducer(undefined, action);

      expect(state.attendees).toEqual(attendees);
      expect(state.isLoaded).toBe(true);
    });

    it("should handle empty attendees array", () => {
      const action = { type: fetchAttendees.fulfilled.type, payload: [] };
      const state = attendeesReducer(undefined, action);

      expect(state.attendees).toEqual([]);
      expect(state.isLoaded).toBe(true);
    });
  });

  describe("registerAttendee", () => {
    it("should handle registerAttendee.fulfilled", () => {
      const initialState = {
        attendees: [mockAttendee],
        isLoaded: true,
      };

      const newAttendee: IAttendee = {
        id: 2,
        eventId: 10,
        name: "Jane Doe",
        email: "jane@example.com",
        registeredAt: new Date().toISOString(),
      };

      const action = {
        type: registerAttendee.fulfilled.type,
        payload: newAttendee,
      };
      const state = attendeesReducer(initialState, action);

      expect(state.attendees).toHaveLength(2);
      expect(state.attendees[1]).toEqual(newAttendee);
    });
  });

  describe("deleteAttendee", () => {
    it("should handle deleteAttendee.fulfilled", () => {
      const attendee2: IAttendee = {
        id: 2,
        eventId: 10,
        name: "Jane Doe",
        email: "jane@example.com",
        registeredAt: new Date().toISOString(),
      };

      const initialState = {
        attendees: [mockAttendee, attendee2],
        isLoaded: true,
      };

      const action = { type: deleteAttendee.fulfilled.type, payload: 1 };
      const state = attendeesReducer(initialState, action);

      expect(state.attendees).toHaveLength(1);
      expect(state.attendees[0].id).toBe(2);
    });

    it("should handle deleting non-existent attendee", () => {
      const initialState = {
        attendees: [mockAttendee],
        isLoaded: true,
      };

      const action = { type: deleteAttendee.fulfilled.type, payload: 999 };
      const state = attendeesReducer(initialState, action);

      expect(state.attendees).toEqual([mockAttendee]);
    });
  });
});
