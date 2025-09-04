import { ITextItem } from "@/core/texts/ITextItem";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

/**
 * Hook para obtener y filtrar textos desde el store redux.
 * @param category Filtra por categoría si se proporciona.
 * @returns Array de textos filtrados
 */
export function useTexts(category?: string): ITextItem[] {
  const texts: ITextItem[] = useSelector(
    (state: RootState) => state.texts.texts
  );
  if (!category) return texts;
  return texts.filter((t) => t.category === category);
}
