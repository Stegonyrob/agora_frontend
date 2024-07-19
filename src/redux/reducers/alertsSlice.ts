import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AlertsState {
  showSuccessAlert: boolean;
  showErrorAlert: boolean;
  alertText: string;
}

const initialState: AlertsState = {
  showSuccessAlert: false,
  showErrorAlert: false,
  alertText: "",
};

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    createAlert: (
      state,
      action: PayloadAction<{ alertType: string; alertText: string }>
    ) => {
      state.alertText = action.payload.alertText;
      if (action.payload.alertType === "success") {
        state.showSuccessAlert = true;
        setTimeout(() => {
          state.showSuccessAlert = false;
        }, 3000);
      } else if (action.payload.alertType === "error") {
        state.showErrorAlert = true;
        setTimeout(() => {
          state.showErrorAlert = false;
        }, 3000);
      }
    },
  },
});

export const { createAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
