import { ReactNode } from "react";

export interface IPost {
  tags: ReactNode;
  userId: ReactNode;
  postname: ReactNode;
  creation_date: ReactNode;
  message: ReactNode;
  id: number;
  title: string;
  alt_image: string;
  source_image: string;
  alt_avatar: string;
  source_avatar: string;
  username: string;
  role: string;
  name: string;
  url_avatar: string;
}
