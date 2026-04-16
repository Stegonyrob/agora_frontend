// IAlert.ts
export interface IAlert {
  type: string; // "success" o "error"
  message: string;
  id: number; // Identificador único de la alerta
}
