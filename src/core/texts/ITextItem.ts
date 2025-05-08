import { ReactNode } from "react";

export interface ITextItem {
  title: ReactNode;
  id: number;
  image: string | null;
  description: string | null;
}
