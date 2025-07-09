// DTO para ENVIAR al backend (creación/edición)
export interface IEventCreateDTO {
  title: string; // max 100 chars, required
  message: string; // max 300 chars, required
  capacity?: number; // optional
  tags?: string[]; // optional - array of strings
}

// DTO para EDITAR al backend
export interface IEventUpdateDTO {
  title: string; // max 100 chars, required
  message: string; // max 300 chars, required
  archived?: boolean; // optional
  capacity?: number; // optional
}

// DTO que DEVUELVE el backend (respuesta optimizada)
export interface IEventResponseDTO {
  id: number;
  title: string;
  message: string;
  archived: boolean;
  capacity: number;
  attendeesCount: number;
  attendees: any[]; // Array de attendee DTOs
  tags: string[]; // Array of string tags
}
