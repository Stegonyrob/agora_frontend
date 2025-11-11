import { describe, it, expect } from "vitest";
import eventsReducer, {
  fetchEvents,
  fetchEventsPaginated,
  createEvent,
  updateEvent,
  deleteEvent,
  archiveEvent,
  unarchiveEvent,
  resetEvents,
} from "../../../core/events/EventStore";
import { IEvent } from "../../../core/events/IEvent";

describe("EventStore", () => {
  const mockEvent: IEvent = {
    id: 1,
    title: "Test Event",
    message: "Test Description",
    eventDate: "2025-12-01",
    capacity: 50,
    attendentsCount: 10,
    location: "Test Location",
    loves: 5,
    isArchived: false,
    isPublished: true,
    alt_image: "alt-image.jpg",
    source_image: "source-image.jpg",
    url_avatar: "avatar.jpg",
    creationDate: new Date().toISOString(),
    favoritesCount: 3,
    link: "https://event-link.com",
    images: [],
    tags: [],
  };

  describe("Initial State", () => {
    it("should return initial state", () => {
      const state = eventsReducer(undefined, { type: "@@INIT" });
      expect(state).toEqual({
        events: [],
        totalPages: 0,
        page: 0,
        isLoaded: false,
      });
    });
  });

  describe("resetEvents", () => {
    it("should reset state to initial values", () => {
      const initialState = {
        events: [mockEvent],
        totalPages: 5,
        page: 2,
        isLoaded: true,
      };

      const state = eventsReducer(initialState, resetEvents());

      expect(state).toEqual({
        events: [],
        totalPages: 0,
        page: 0,
        isLoaded: false,
      });
    });
  });

  describe("fetchEvents", () => {
    it("should handle fetchEvents.fulfilled", () => {
      const events = [mockEvent];
      const action = { type: fetchEvents.fulfilled.type, payload: events };
      const state = eventsReducer(undefined, action);

      expect(state.events).toEqual(events);
      expect(state.isLoaded).toBe(true);
    });

    it("should handle empty events array", () => {
      const action = { type: fetchEvents.fulfilled.type, payload: [] };
      const state = eventsReducer(undefined, action);

      expect(state.events).toEqual([]);
      expect(state.isLoaded).toBe(true);
    });
  });

  describe("fetchEventsPaginated", () => {
    it("should handle fetchEventsPaginated.fulfilled", () => {
      const paginatedResponse = {
        content: [mockEvent],
        totalPages: 5,
        currentPage: 2,
        totalElements: 50,
        hasNext: true,
        hasPrevious: true,
      };

      const action = {
        type: fetchEventsPaginated.fulfilled.type,
        payload: paginatedResponse,
      };
      const state = eventsReducer(undefined, action);

      expect(state.events).toEqual([mockEvent]);
      expect(state.totalPages).toBe(5);
      expect(state.page).toBe(2);
      expect(state.isLoaded).toBe(true);
    });

    it("should handle response without currentPage", () => {
      const paginatedResponse = {
        content: [mockEvent],
        totalPages: 3,
        totalElements: 30,
        hasNext: false,
        hasPrevious: true,
      };

      const action = {
        type: fetchEventsPaginated.fulfilled.type,
        payload: paginatedResponse,
      };
      const state = eventsReducer(undefined, action);

      expect(state.page).toBe(0);
    });
  });

  describe("createEvent", () => {
    it("should handle createEvent.fulfilled", () => {
      const initialState = {
        events: [mockEvent],
        totalPages: 0,
        page: 0,
        isLoaded: true,
      };

      const newEvent: IEvent = {
        ...mockEvent,
        id: 2,
        title: "New Event",
      };

      const action = { type: createEvent.fulfilled.type, payload: newEvent };
      const state = eventsReducer(initialState, action);

      expect(state.events).toHaveLength(2);
      expect(state.events[1]).toEqual(newEvent);
    });
  });

  describe("updateEvent", () => {
    it("should handle updateEvent.fulfilled", () => {
      const initialState = {
        events: [mockEvent],
        totalPages: 0,
        page: 0,
        isLoaded: true,
      };

      const updatedData = {
        id: 1,
        title: "Updated Title",
        message: "Updated Description",
        capacity: 100,
        archived: false,
      };

      const action = {
        type: updateEvent.fulfilled.type,
        payload: updatedData,
        meta: { arg: { id: 1, event: updatedData } },
      };

      const state = eventsReducer(initialState, action);

      expect(state.events[0].title).toBe("Updated Title");
      expect(state.events[0].message).toBe("Updated Description");
      expect(state.events[0].capacity).toBe(100);
    });

    it("should not update if event not found", () => {
      const initialState = {
        events: [mockEvent],
        totalPages: 0,
        page: 0,
        isLoaded: true,
      };

      const action = {
        type: updateEvent.fulfilled.type,
        payload: { id: 999, title: "Not found" },
        meta: { arg: { id: 999, event: {} } },
      };

      const state = eventsReducer(initialState, action);

      expect(state.events).toEqual([mockEvent]);
    });
  });

  describe("deleteEvent", () => {
    it("should handle deleteEvent.fulfilled", () => {
      const event2: IEvent = {
        ...mockEvent,
        id: 2,
        title: "Event 2",
      };

      const initialState = {
        events: [mockEvent, event2],
        totalPages: 0,
        page: 0,
        isLoaded: true,
      };

      const action = { type: deleteEvent.fulfilled.type, payload: 1 };
      const state = eventsReducer(initialState, action);

      expect(state.events).toHaveLength(1);
      expect(state.events[0].id).toBe(2);
    });

    it("should handle deleting non-existent event", () => {
      const initialState = {
        events: [mockEvent],
        totalPages: 0,
        page: 0,
        isLoaded: true,
      };

      const action = { type: deleteEvent.fulfilled.type, payload: 999 };
      const state = eventsReducer(initialState, action);

      expect(state.events).toEqual([mockEvent]);
    });
  });

  describe("archiveEvent", () => {
    it("should handle archiveEvent.fulfilled", () => {
      const initialState = {
        events: [mockEvent],
        totalPages: 0,
        page: 0,
        isLoaded: true,
      };

      const action = { type: archiveEvent.fulfilled.type, payload: 1 };
      const state = eventsReducer(initialState, action);

      expect(state.events[0].isArchived).toBe(true);
    });

    it("should not modify if event not found", () => {
      const initialState = {
        events: [mockEvent],
        totalPages: 0,
        page: 0,
        isLoaded: true,
      };

      const action = { type: archiveEvent.fulfilled.type, payload: 999 };
      const state = eventsReducer(initialState, action);

      expect(state.events[0].isArchived).toBe(false);
    });
  });

  describe("unarchiveEvent", () => {
    it("should handle unarchiveEvent.fulfilled", () => {
      const archivedEvent = { ...mockEvent, isArchived: true };
      const initialState = {
        events: [archivedEvent],
        totalPages: 0,
        page: 0,
        isLoaded: true,
      };

      const action = { type: unarchiveEvent.fulfilled.type, payload: 1 };
      const state = eventsReducer(initialState, action);

      expect(state.events[0].isArchived).toBe(false);
    });

    it("should not modify if event not found", () => {
      const archivedEvent = { ...mockEvent, isArchived: true };
      const initialState = {
        events: [archivedEvent],
        totalPages: 0,
        page: 0,
        isLoaded: true,
      };

      const action = { type: unarchiveEvent.fulfilled.type, payload: 999 };
      const state = eventsReducer(initialState, action);

      expect(state.events[0].isArchived).toBe(true);
    });
  });
});
