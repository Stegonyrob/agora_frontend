import { IPostImage } from "./images/IPostImage";

export interface IPost {
  [x: string]: any;
  id: number;
  title: string;
  message: string;
  userId: number;
  location: string;
  loves: number;
  comments: any[];
  isArchived: boolean;
  tags: string[];
  images: string[] | IPostImage[]; // Homogeneizado con IEvent - soporte para ambos formatos
  image?: string[]; // Mantener compatibilidad con formato legacy
  isPublished: boolean;
  alt_image: string;
  source_image: string;
  alt_avatar: string;
  source_avatar: string;
  userName: string;
  role: string;
  url_avatar: string;
  creationDate: string;
  updatedAt: string;
  createdAt: string;
  description: string;
  ondelete: () => void;
  // Campos adicionales para homogeneizar con IEvent
  favoritesCount?: number;
  commentsCount?: number;
  user?: any; // Información del usuario creador
}
