export interface IEventImageDTO {
  eventId: number;
  imageName: string;
  imageType: string;
  imageData?: string; // Base64 o URL opcional
  file?: File; // Para subir archivos
}
