export interface IPostDTO {
  id: number;
  title: string;
  message: string;
  creationDate: Date;
  userId: number;
  location: string;
  loves: number;
  comments: any[];
  isArchived: boolean;
  tags: string[];
  images: string[];
  isPublished: boolean;
  publishDate: string;
  alt_image: string;
  source_image: string;
  alt_avatar: string;
  source_avatar: string;
  username: string;
  role: string;
  url_avatar: string;
}
