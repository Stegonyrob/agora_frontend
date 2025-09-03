export interface ITextItem {
  id: number;
  title: string;
  category: string; // NUEVO: categoría fija
  createdAt?: string | null;
  updatedAt?: string | null;
  description: string;
  image: string;
  name_image: string;
}
