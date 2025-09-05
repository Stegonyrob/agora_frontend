import { ITextImage } from "./images/ITextImage";

export interface ITextItem {
  id: number;
  title: string;
  category: string; // NUEVO: categoría fija
  createdAt?: string | null;
  updatedAt?: string | null;
  message: string;
  images: ITextImage[];
  name_image: string;
}
