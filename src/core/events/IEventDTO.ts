export interface IEventDTO {
  id: number;
  title: string;
  message: string;

  userId: number;
  loves: number;
  isArchived: boolean;
  tags: string[];
  alt_image: string;
  source_image: string;
  alt_avatar: string;
  source_avatar: string;
  url_avatar: string;
  images: string[];
  isPublished: boolean;
  location: string;
  createdAt: string;
  updatedAt: string;
  place?: string;
  eventDate: string; // Fecha del evento en formato ISO
  link: string;
  capacity: number; // Campo de aforo
}
