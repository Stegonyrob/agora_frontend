import { ITextImageDTO } from "./images/ITextImageDTO";

export interface ITextDTO {
  userId: any;
  title: string;
  images: ITextImageDTO[];
  message?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  category?: string | null;
  id?: number;
  name_image: string;
}
