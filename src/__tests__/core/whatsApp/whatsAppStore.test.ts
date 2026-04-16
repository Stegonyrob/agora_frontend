import { reducer } from "@/core/whatsApp/whatsAppStore";
import { describe, expect, it } from "vitest";

describe("whatsAppStore reducer", () => {
  const initialState = {
    isOpen: false,
    isDelay: false,
    isNotification: false,
  };

  describe("initial state", () => {
    it("should have correct initial values", () => {
      expect(initialState.isOpen).toBe(false);
      expect(initialState.isDelay).toBe(false);
      expect(initialState.isNotification).toBe(false);
    });
  });

  describe("open action", () => {
    it("should set isOpen to true and isNotification to false", () => {
      const state = reducer(initialState, { type: "open" });
      expect(state.isOpen).toBe(true);
      expect(state.isNotification).toBe(false);
      expect(state.isDelay).toBe(false);
    });

    it("should override previous notification state", () => {
      const stateWithNotification = {
        isOpen: false,
        isDelay: false,
        isNotification: true,
      };
      const state = reducer(stateWithNotification, { type: "open" });
      expect(state.isOpen).toBe(true);
      expect(state.isNotification).toBe(false);
    });
  });

  describe("close action", () => {
    it("should set isOpen to false", () => {
      const openState = {
        isOpen: true,
        isDelay: false,
        isNotification: false,
      };
      const state = reducer(openState, { type: "close" });
      expect(state.isOpen).toBe(false);
      expect(state.isDelay).toBe(false);
      expect(state.isNotification).toBe(false);
    });

    it("should preserve other state values", () => {
      const stateWithNotification = {
        isOpen: true,
        isDelay: true,
        isNotification: true,
      };
      const state = reducer(stateWithNotification, { type: "close" });
      expect(state.isOpen).toBe(false);
      expect(state.isDelay).toBe(true);
      expect(state.isNotification).toBe(true);
    });
  });

  describe("delay action", () => {
    it("should set isDelay to false", () => {
      const delayState = {
        isOpen: false,
        isDelay: true,
        isNotification: false,
      };
      const state = reducer(delayState, { type: "delay" });
      expect(state.isDelay).toBe(false);
      expect(state.isOpen).toBe(false);
      expect(state.isNotification).toBe(false);
    });

    it("should preserve other state values", () => {
      const stateWithOpen = {
        isOpen: true,
        isDelay: true,
        isNotification: true,
      };
      const state = reducer(stateWithOpen, { type: "delay" });
      expect(state.isDelay).toBe(false);
      expect(state.isOpen).toBe(true);
      expect(state.isNotification).toBe(true);
    });
  });

  describe("notification action", () => {
    it("should set isNotification to true", () => {
      const state = reducer(initialState, { type: "notification" });
      expect(state.isNotification).toBe(true);
      expect(state.isOpen).toBe(false);
      expect(state.isDelay).toBe(false);
    });

    it("should preserve other state values", () => {
      const openState = {
        isOpen: true,
        isDelay: true,
        isNotification: false,
      };
      const state = reducer(openState, { type: "notification" });
      expect(state.isNotification).toBe(true);
      expect(state.isOpen).toBe(true);
      expect(state.isDelay).toBe(true);
    });
  });

  describe("default case", () => {
    it("should return unchanged state for unknown action", () => {
      const customState = {
        isOpen: true,
        isDelay: true,
        isNotification: true,
      };
      const state = reducer(customState, { type: "unknown" } as any);
      expect(state).toEqual(customState);
    });
  });

  describe("state transitions", () => {
    it("should handle open -> close -> notification sequence", () => {
      let state = reducer(initialState, { type: "open" });
      expect(state.isOpen).toBe(true);

      state = reducer(state, { type: "close" });
      expect(state.isOpen).toBe(false);

      state = reducer(state, { type: "notification" });
      expect(state.isNotification).toBe(true);
      expect(state.isOpen).toBe(false);
    });

    it("should handle notification -> open sequence (notification reset)", () => {
      let state = reducer(initialState, { type: "notification" });
      expect(state.isNotification).toBe(true);

      state = reducer(state, { type: "open" });
      expect(state.isOpen).toBe(true);
      expect(state.isNotification).toBe(false);
    });
  });
});
