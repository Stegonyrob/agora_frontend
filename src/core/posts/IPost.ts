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
  image: string[];
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
}
