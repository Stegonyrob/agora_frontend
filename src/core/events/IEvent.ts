import { ReactNode } from "react";

export interface IEvent {
  [x: string]: ReactNode;
  id: number;
  title: string;
  message: string;
  userId: number;
  location: string;
  loves: number;
  isArchived: boolean;
  tags: string[];
  images: string[];
  isPublished: boolean;
  alt_image: string;
  source_image: string;
  userName: string;
  role: string;
  url_avatar: string;
}
