export interface IPostDTO {
  id: number;
  title: string;
  message: string;
  creatorId: number;
  location: string;
  loves: number;
  comments: any[];
  isArchived: boolean;
  tags: string[];
  images: string[];
  isPublished: boolean;
  alt_image: string;
  source_image: string;
  alt_avatar: string;
  source_avatar: string;
  creatorName: string;
  role: string;
  url_avatar: string;
  createdAt: string;
}
