export interface IEventImage {
  id: number;
  eventId: number;
  imageName: string;
  imageType: string;
  imageData?: string; // Base64 o URL - opcional para reducir payload
  createdAt: string;
}

export interface IEventTag {
  id: number;
  name: string;
  archived: boolean;
}

export interface IEvent {
  id: number;
  title: string;
  message: string;
  location: string;
  loves: number;
  isArchived: boolean;
  tags: IEventTag[];
  images: string[] | IEventImage[]; // Soporte para ambos formatos
  isPublished: boolean;
  alt_image: string;
  source_image: string;
  url_avatar: string;
  creationDate: string;
  favoritesCount: number;
  attendentsCount: number;
  capacity: number; // Campo de aforo
  eventDate: string; // Fecha del evento
  link: string;
  user?: any; // Información del usuario creador
  [x: string]: any; // Para permitir propiedades adicionales dinámicas
}
