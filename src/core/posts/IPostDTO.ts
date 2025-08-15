import { IPostImageDTO } from "./images/IPostImageDTO";

export interface IPostTagDTO {
  id: number;
  name: string;
  archived?: boolean;
}

export interface IPostDTO {
  updatedAt: string;
  createdAt: string;
  description: string;
  id: number;
  title: string;
  message: string;
  userId: number;
  location: string;
  loves: number;
  comments: any[];
  isArchived: boolean;
  tags: IPostTagDTO[];
  images: IPostImageDTO[];
  isPublished: boolean;
  alt_image: string;
  source_image: string;
  alt_avatar: string;
  source_avatar: string;
  userName: string;
  role: string;
  url_avatar: string;
}
