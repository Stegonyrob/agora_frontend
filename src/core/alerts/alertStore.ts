import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AlertService } from "./AlertService";
import { IAlert } from "./IAlert";
import { IAlertDTO } from "./IAlertDTO";

const service = new AlertService();

export const fetchAlerts = createAsyncThunk(
  "alerts/fetchAlerts",
  async () => await service.getAlerts()
);

export const createAlert = createAsyncThunk(
  "alerts/createAlert",
  async (alert: IAlertDTO) => await service.createAlert(alert)
);

export const updateAlert = createAsyncThunk(
  "alerts/updateAlert",
  async ({ id, alert }: { id: number; alert: IAlertDTO }) =>
    await service.updateAlert(id, alert)
);

export const deleteAlert = createAsyncThunk(
  "alerts/deleteAlert",
  async (id: number) => {
    await service.deleteAlert(id);
    return id;
  }
);

interface AlertsState {
  alerts: IAlert[];
  isLoaded: boolean;
}

const alertsSlice = createSlice({
  name: "alerts",
  initialState: { alerts: [], isLoaded: false } as AlertsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
        state.isLoaded = true;
      })
      .addCase(createAlert.fulfilled, (state, action) => {
        state.alerts.push(action.payload);
      })
      .addCase(updateAlert.fulfilled, (state, action) => {
        const idx = state.alerts.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.alerts[idx] = action.payload;
      })
      .addCase(deleteAlert.fulfilled, (state, action) => {
        state.alerts = state.alerts.filter((a) => a.id !== action.payload);
      });
  },
});

export default alertsSlice.reducer;
