export interface IEventImage {
  id: number;
  eventId: number;
  imageName: string;
  imageType: string;
  imageData: string; // Base64 o URL
  createdAt: string;
}
