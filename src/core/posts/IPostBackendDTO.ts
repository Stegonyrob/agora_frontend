// DTO para ENVIAR al backend (creación/edición)
export interface IPostCreateDTO {
  title: string; // max 100 chars, required
  message: string; // max 300 chars, required

  tags?: { id?: number; name: string }[]; // Updated to match backend's expected structure
  creationDate?: string; // optional - fecha de creación en formato ISO 8601
  archived?: boolean; // optional - estado archivado
}

// DTO para EDITAR al backend
export interface IPostUpdateDTO {
  title: string; // max 100 chars, required
  message: string; // max 300 chars, required
  archived?: boolean; // optional
}

// DTO que DEVUELVE el backend (respuesta optimizada)
export interface IPostResponseDTO {
  id: number;
  title: string;
  message: string;
  archived: boolean;
  capacity: number;
  attendeesCount: number;
  attendees: any[]; // Array de attendee DTOs
  tags: string[]; // Array of string tags
}
