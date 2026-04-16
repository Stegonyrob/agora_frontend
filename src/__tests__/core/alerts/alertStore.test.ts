import { describe, expect, it } from "vitest";
import alertsReducer, {
  createAlert,
  deleteAlert,
  fetchAlerts,
  updateAlert,
} from "../../../core/alerts/alertStore";
import { IAlert } from "../../../core/alerts/IAlert";

describe("alertStore", () => {
  const mockAlert: IAlert = {
    id: 1,
    message: "Test alert",
    type: "info",
  };

  describe("Initial State", () => {
    it("should return initial state", () => {
      const state = alertsReducer(undefined, { type: "@@INIT" });
      expect(state).toEqual({
        alerts: [],
        isLoaded: false,
      });
    });
  });

  describe("fetchAlerts", () => {
    it("should handle fetchAlerts.fulfilled", () => {
      const alerts = [mockAlert];
      const action = { type: fetchAlerts.fulfilled.type, payload: alerts };
      const state = alertsReducer(undefined, action);

      expect(state.alerts).toEqual(alerts);
      expect(state.isLoaded).toBe(true);
    });

    it("should handle empty alerts array", () => {
      const action = { type: fetchAlerts.fulfilled.type, payload: [] };
      const state = alertsReducer(undefined, action);

      expect(state.alerts).toEqual([]);
      expect(state.isLoaded).toBe(true);
    });
  });

  describe("createAlert", () => {
    it("should handle createAlert.fulfilled", () => {
      const initialState = {
        alerts: [mockAlert],
        isLoaded: true,
      };

      const newAlert: IAlert = {
        id: 2,
        message: "New alert",
        type: "warning",
      };

      const action = { type: createAlert.fulfilled.type, payload: newAlert };
      const state = alertsReducer(initialState, action);

      expect(state.alerts).toHaveLength(2);
      expect(state.alerts[1]).toEqual(newAlert);
    });
  });

  describe("updateAlert", () => {
    it("should handle updateAlert.fulfilled", () => {
      const initialState = {
        alerts: [mockAlert],
        isLoaded: true,
      };

      const updatedAlert: IAlert = {
        ...mockAlert,
        message: "Updated message",
        type: "error",
      };

      const action = {
        type: updateAlert.fulfilled.type,
        payload: updatedAlert,
      };
      const state = alertsReducer(initialState, action);

      expect(state.alerts[0]).toEqual(updatedAlert);
      expect(state.alerts[0].message).toBe("Updated message");
    });

    it("should not update if alert id not found", () => {
      const initialState = {
        alerts: [mockAlert],
        isLoaded: true,
      };

      const nonExistentAlert: IAlert = {
        id: 999,
        message: "Non-existent",
        type: "info",
      };

      const action = {
        type: updateAlert.fulfilled.type,
        payload: nonExistentAlert,
      };
      const state = alertsReducer(initialState, action);

      expect(state.alerts).toEqual([mockAlert]);
    });
  });

  describe("deleteAlert", () => {
    it("should handle deleteAlert.fulfilled", () => {
      const alert2: IAlert = {
        id: 2,
        message: "Alert 2",
        type: "success",
      };

      const initialState = {
        alerts: [mockAlert, alert2],
        isLoaded: true,
      };

      const action = { type: deleteAlert.fulfilled.type, payload: 1 };
      const state = alertsReducer(initialState, action);

      expect(state.alerts).toHaveLength(1);
      expect(state.alerts[0].id).toBe(2);
    });

    it("should handle deleting non-existent alert", () => {
      const initialState = {
        alerts: [mockAlert],
        isLoaded: true,
      };

      const action = { type: deleteAlert.fulfilled.type, payload: 999 };
      const state = alertsReducer(initialState, action);

      expect(state.alerts).toEqual([mockAlert]);
    });
  });
});
