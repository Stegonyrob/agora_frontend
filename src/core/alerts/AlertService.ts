// AlertService.ts
import { IAlert } from "./IAlert"; // Asegúrate de que esta interfaz existe

class AlertService {
  private alerts: IAlert[] = [];

  // Método para crear una alerta
  createAlert(type: string, message: string): IAlert {
    const alert: IAlert = { type, message };
    this.alerts.push(alert);
    // Opcional: Puedes agregar lógica para eliminar la alerta después de un tiempo
    setTimeout(() => {
      this.removeAlert(alert);
    }, 3000); // Eliminar alerta después de 3 segundos
    return alert;
  }

  // Método para eliminar una alerta
  removeAlert(alert: IAlert): void {
    const index = this.alerts.indexOf(alert);
    if (index > -1) {
      this.alerts.splice(index, 1);
    }
  }

  // Método para obtener todas las alertas
  getAlerts(): IAlert[] {
    return this.alerts;
  }

  // Método para limpiar todas las alertas
  clearAlerts(): void {
    this.alerts = [];
  }
}

export default AlertService;
