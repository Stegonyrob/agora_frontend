import { ITextItem } from "@/core/texts/ITextItem";
import TextService from "@/core/texts/TextService";
import { ITextImage } from "@/core/texts/images/ITextImage";
import TextImageService from "@/core/texts/images/TextImageService";
import { useCallback, useEffect, useMemo, useState } from "react";

interface TextWithImages {
  text: ITextItem;
  images: ITextImage[];
  primaryImageUrl?: string; // URL optimizada para mostrar
  imageQuality?:
    | "excellent"
    | "good"
    | "acceptable"
    | "poor"
    | "corrupted"
    | "none";
}

interface UseTextsWithImagesOptimizedOptions {
  category?: string;
  enableDetailedLogging?: boolean;
}

export const useTextsWithImagesOptimized = (
  options: UseTextsWithImagesOptimizedOptions = {}
) => {
  const { category, enableDetailedLogging = false } = options;

  const [texts, setTexts] = useState<TextWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Servicios memoizados
  const textService = useMemo(() => new TextService(), []);
  const textImageService = useMemo(() => new TextImageService(), []);

  // Helper para obtener la mejor URL de imagen
  const getBestImageUrl = useCallback(
    (
      images: ITextImage[],
      textTitle: string
    ): {
      url: string;
      quality:
        | "excellent"
        | "good"
        | "acceptable"
        | "poor"
        | "corrupted"
        | "none";
      source: "imageData" | "endpoint" | "fallback";
    } => {
      if (!images || images.length === 0) {
        const fallbackUrl = "/images/agoraLogoTras.png"; // Fallback por defecto
        return {
          url: fallbackUrl,
          quality: "none",
          source: "fallback",
        };
      }

      const img = images[0];
      const imageDataLength = img.imageData?.length || 0;

      // Determinar calidad basada en tamaño
      let quality: "excellent" | "good" | "acceptable" | "poor" | "corrupted";
      if (imageDataLength === 0) {
        quality = "corrupted";
      } else if (imageDataLength < 1000) {
        quality = "corrupted";
      } else if (imageDataLength < 5000) {
        quality = "poor";
      } else if (imageDataLength < 20000) {
        quality = "acceptable";
      } else if (imageDataLength < 50000) {
        quality = "good";
      } else {
        quality = "excellent";
      }

      // Decidir qué URL usar basado en la calidad
      if (img.imageData && quality !== "corrupted" && quality !== "poor") {
        // Usar imageData para calidad aceptable o mejor
        const url = img.imageData.startsWith("data:")
          ? img.imageData
          : `data:image/jpeg;base64,${img.imageData}`;

        if (enableDetailedLogging) {
          console.log(
            `✅ Using imageData for "${textTitle}" - Quality: ${quality}, Size: ${imageDataLength} chars`
          );
        }

        return {
          url,
          quality,
          source: "imageData",
        };
      } else {
        // Usar endpoint URL para calidad pobre o datos corruptos
        const baseUrl =
          import.meta.env.VITE_API_ENDPOINT_TEXT_IMAGES ||
          "/api/v1/text-images";
        const url = `${baseUrl}/${img.id}/data`;

        if (enableDetailedLogging) {
          console.log(
            `🔗 Using endpoint URL for "${textTitle}" - Quality: ${quality}, Reason: ${
              quality === "corrupted"
                ? "Corrupted data"
                : "Poor quality imageData"
            }`
          );
        }

        return {
          url,
          quality,
          source: "endpoint",
        };
      }
    },
    [enableDetailedLogging]
  );

  useEffect(() => {
    const fetchTextsWithImages = async () => {
      try {
        setLoading(true);
        setError(null);

        if (enableDetailedLogging) {
          console.log(`🔍 Fetching texts for category: "${category || "all"}"`);
        }

        // Obtener textos
        const allTexts = await textService.getAllTexts();

        // Filtrar por categoría si se especifica
        const filteredTexts = category
          ? allTexts.filter((text: ITextItem) => text.category === category)
          : allTexts;

        if (enableDetailedLogging) {
          console.log(
            `📝 Found ${filteredTexts.length} texts for category "${category}"`
          );
        }

        // Obtener imágenes para cada texto
        const textsWithImages = await Promise.all(
          filteredTexts.map(
            async (text: ITextItem): Promise<TextWithImages> => {
              try {
                const images = await textImageService.getTextImages(text.id);
                const imageInfo = getBestImageUrl(images, text.title);

                return {
                  text,
                  images,
                  primaryImageUrl: imageInfo.url,
                  imageQuality: imageInfo.quality,
                };
              } catch (error) {
                if (enableDetailedLogging) {
                  console.warn(
                    `⚠️ Failed to load images for text "${text.title}":`,
                    error
                  );
                }

                return {
                  text,
                  images: [],
                  primaryImageUrl: "/images/agoraLogoTras.png",
                  imageQuality: "none",
                };
              }
            }
          )
        );

        if (enableDetailedLogging) {
          console.log(
            `✅ Successfully processed ${textsWithImages.length} texts with images`
          );
          textsWithImages.forEach((item, index) => {
            console.log(
              `   ${index + 1}. "${item.text.title}" - ${
                item.images.length
              } images, quality: ${item.imageQuality}`
            );
          });
        }

        setTexts(textsWithImages);
      } catch (error: any) {
        const errorMessage = error.message || "Failed to fetch texts";
        console.error("❌ Error fetching texts with images:", error);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTextsWithImages();
  }, [
    category,
    textService,
    textImageService,
    getBestImageUrl,
    enableDetailedLogging,
  ]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setTexts([]);
  }, []);

  return {
    texts,
    loading,
    error,
    refetch,
    // Información adicional útil
    stats: {
      total: texts.length,
      withImages: texts.filter((t) => t.images.length > 0).length,
      qualityBreakdown: {
        excellent: texts.filter((t) => t.imageQuality === "excellent").length,
        good: texts.filter((t) => t.imageQuality === "good").length,
        acceptable: texts.filter((t) => t.imageQuality === "acceptable").length,
        poor: texts.filter((t) => t.imageQuality === "poor").length,
        corrupted: texts.filter((t) => t.imageQuality === "corrupted").length,
        none: texts.filter((t) => t.imageQuality === "none").length,
      },
    },
  };
};
