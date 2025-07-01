import { ReactNode } from "react";

export interface IEvent {
  [x: string]: ReactNode;
  id: number;
  title: string;
  message: string;
  description: string;
  location: string;
  loves: number;
  isArchived: boolean;
  tags: string[];
  images: string[];
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
}
