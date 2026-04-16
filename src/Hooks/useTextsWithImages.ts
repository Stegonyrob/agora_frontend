import { IText } from "@/core/texts/IText";
import TextService from "@/core/texts/TextService";
import { ITextImage } from "@/core/texts/images/ITextImage";
import TextImageService from "@/core/texts/images/TextImageService";
import { useEffect, useMemo, useState } from "react";

interface TextWithImages {
  text: IText;
  images: ITextImage[];
}

export const useTextsWithImages = (
  category?: string,
  includeArchived = false
) => {
  const [texts, setTexts] = useState<TextWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the services to avoid recreation on every render
  const textService = useMemo(() => new TextService(), []);
  const textImageService = useMemo(() => new TextImageService(), []);

  useEffect(() => {
    const fetchTextsWithImages = async () => {
      try {
        setLoading(true);
        setError(null);

        const allTexts = await textService.getAllTexts();

        // Filter by category if provided
        const filteredTexts = category
          ? allTexts.filter((text: IText) => text.category === category)
          : allTexts;

        // Filter out archived texts unless includeArchived is true
        const nonArchivedTexts = includeArchived
          ? filteredTexts
          : filteredTexts.filter((text: IText) => !text.archived);

        // Fetch images for each text
        const textsWithImages = await Promise.all(
          nonArchivedTexts.map(async (text: IText) => {
            try {
              // Fetching images for text
              const images = await textImageService.getImagesByTextId(
                text.id,
                text.category
              );
              // Images fetched successfully

              return { text, images };
            } catch (error) {
              console.error(
                `❌ Error fetching images for text ID ${text.id}:`,
                error
              );
              return { text, images: [] };
            }
          })
        );

        setTexts(textsWithImages);
      } catch (error: any) {
        console.error("❌ Error fetching texts with images:", error);
        setError(error.message || "Failed to fetch texts");
      } finally {
        setLoading(false);
      }
    };

    fetchTextsWithImages();
  }, [category, includeArchived, textService, textImageService]);

  return {
    texts,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Re-trigger useEffect by forcing a re-render
      setTexts([]);
    },
  };
};
