export interface ITextItem {
  id: number;
  title: string;
  image: string | null;
  description: string | null;
  content: string;
  author: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}
