export interface IPost {
  location: string;
  loves: number;
  comments: Comment[];
  isArchived: boolean;
  tags: string[];
  userId: number;
  creation_date: Date;
  message: string;
  id: number;
  title: string;
  alt_image: string;
  source_image: string;
  alt_avatar: string;
  source_avatar: string;
  username: string;
  role: string;
  url_avatar: string;
}
