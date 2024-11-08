import { IAlert } from "./IAlert";

// Define el store de alertas en Redux
export const alertStore = {
  state: () => ({
    alerts: [] as IAlert[], // Arreglo de alertas
  }),

  actions: {
    // Action to create an alert
    createAlert(this: any, type: string, message: string): void {
      const alert: IAlert = { type, message };
      this.alerts.push(alert);
      // Opcional: Puedes agregar lógica para eliminar la alerta después de un tiempo
      setTimeout(() => {
        this.alerts.splice(this.alerts.indexOf(alert), 1);
      }, 3000); // Eliminar alerta después de 3 segundos
    },

    // Action to clear all alerts
    clearAlerts(this: any): void {
      this.alerts = [];
    },
  },
};
