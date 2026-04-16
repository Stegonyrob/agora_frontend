// DTO para ENVIAR al backend (creación/edición)
export interface IEventCreateDTO {
  title: string; // max 100 chars, required
  message: string; // max 300 chars, required
  location?: string; // optional - ubicación del evento
  link?: string; // optional - enlace relacionado
  capacity?: number; // optional
  tags?: { id?: number; name: string }[]; // Updated to match backend's expected structure
  eventDate?: string; // optional - fecha del evento en formato ISO 8601
  eventTime?: string; // optional - hora del evento en formato HH:mm
  creationDate?: string; // optional - fecha de creación en formato ISO 8601
  archived?: boolean; // optional - estado archivado
}

// DTO para EDITAR al backend
export interface IEventUpdateDTO {
  title: string; // max 100 chars, required
  message: string; // max 300 chars, required
  location?: string; // optional - ubicación del evento
  link?: string; // optional - enlace relacionado
  capacity?: number; // optional
  eventDate?: string; // optional - fecha del evento en formato ISO 8601
  eventTime?: string; // optional - hora del evento en formato HH:mm
  archived?: boolean; // optional
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
