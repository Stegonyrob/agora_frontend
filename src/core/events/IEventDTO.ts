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
  description: string;
  createdAt: string;
  updatedAt: string;
  place?: string;
  date: string;
  link: string;
}
