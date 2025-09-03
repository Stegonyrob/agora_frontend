import { ITextImageDTO } from "./images/ITextImageDTO";

export interface ITextItemDTO {
  userId: any;
  title: string;
  images: ITextImageDTO[];
  description?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  category?: string | null;
  id?: number;
  name_image: string;
}
