export interface IEventImage {
  id: number | null;
  eventId: number;
  imageName: string;
  imagePath: string; // Updated to use imagePath instead of imageData
  url?: string; // URL completa para acceder a la imagen
  isMock?: boolean; // Flag para objetos temporales creados desde strings del backend
  createdAt: string;
}
