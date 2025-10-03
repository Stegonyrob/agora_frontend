import { ITextImage } from "./images/ITextImage";

export interface IText {
  id: number;
  title: string;
  category: string; // NUEVO: categoría fija
  createdAt?: string | null;
  updatedAt?: string | null;
  message: string;
  images: ITextImage[];
  name_image: string;
  archived?: boolean; // Campo para manejo de archivado
}
