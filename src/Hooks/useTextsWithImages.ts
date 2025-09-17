import { ITextItem } from "@/core/texts/ITextItem";
import TextService from "@/core/texts/TextService";
import { ITextImage } from "@/core/texts/images/ITextImage";
import TextImageService from "@/core/texts/images/TextImageService";
import { useEffect, useMemo, useState } from "react";

interface TextWithImages {
  text: ITextItem;
  images: ITextImage[];
}

export const useTextsWithImages = (category?: string) => {
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

        console.log("🔍 Fetching all texts...");
        const allTexts = await textService.getAllTexts();
        console.log("✅ All texts fetched:", allTexts);

        // Filter by category if provided
        const filteredTexts = category
          ? allTexts.filter((text: ITextItem) => text.category === category)
          : allTexts;

        console.log(`🔍 Filtering texts by category: ${category}`);
        console.log("✅ Filtered texts:", filteredTexts);

        // Fetch images for each text
        const textsWithImages = await Promise.all(
          filteredTexts.map(async (text: ITextItem) => {
            try {
              console.log(`🖼️ Fetching images for text ID: ${text.id}`);
              const images = await textImageService.getImagesByTextId(
                text.id,
                text.category
              );
              console.log(`✅ Images fetched for text ID ${text.id}:`, images);

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

        console.log("🎯 Final texts with images:", textsWithImages);
        setTexts(textsWithImages);
      } catch (error: any) {
        console.error("❌ Error fetching texts with images:", error);
        setError(error.message || "Failed to fetch texts");
      } finally {
        setLoading(false);
      }
    };

    fetchTextsWithImages();
  }, [category, textService, textImageService]);

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
