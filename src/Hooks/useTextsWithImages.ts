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

  // Memoizar los servicios para evitar recreación en cada render
  const textService = useMemo(() => new TextService(), []);
  const textImageService = useMemo(() => new TextImageService(), []);

  useEffect(() => {
    const fetchTextsWithImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all texts
        const allTexts = await textService.getAllTexts();
        console.log("📝 Fetched texts:", allTexts);

        // === DOCUMENTACIÓN DETALLADA DE DATOS DESDE BACKEND ===
        console.log("🔍 === ANÁLISIS COMPLETO DE TEXTOS DESDE BACKEND ===");

        // Log de todas las categorías disponibles
        const allCategories = [
          ...new Set(allTexts.map((text) => text.category)),
        ];
        console.log("🏷️ Available categories in database:", allCategories);

        // Documentar estructura completa de todos los textos
        console.log("📋 === ESTRUCTURA COMPLETA DE TODOS LOS TEXTOS ===");
        allTexts.forEach((text, index) => {
          console.log(`📄 Texto ${index + 1}:`, {
            id: text.id,
            title: text.title,
            category: text.category,
            message: text.message
              ? `${text.message.substring(0, 100)}...`
              : "Sin mensaje",
            name_image: text.name_image,
            images: text.images,
            createdAt: text.createdAt,
            updatedAt: text.updatedAt,
            // Log completo del objeto
            fullObject: text,
          });
        });

        // Filter by category if provided
        const filteredTexts = category
          ? allTexts.filter((text: ITextItem) => text.category === category)
          : allTexts;

        console.log(`🔍 Filtering by category: "${category}"`);
        console.log(
          `📝 Filtered texts for category "${category}":`,
          filteredTexts
        );

        // === DOCUMENTACIÓN ESPECÍFICA PARA CATEGORÍA NOSOTROS ===
        if (category === "nosotros") {
          console.log("🎯 === ANÁLISIS ESPECÍFICO CATEGORÍA 'NOSOTROS' ===");
          console.log(
            `� Cantidad de textos encontrados: ${filteredTexts.length}`
          );

          filteredTexts.forEach((text, index) => {
            console.log(`📄 TEXTO ${index + 1} - CATEGORÍA NOSOTROS:`);
            console.log(`   📌 ID: ${text.id}`);
            console.log(`   📌 Título: "${text.title}"`);
            console.log(`   📌 Categoría: "${text.category}"`);
            console.log(
              `   📌 Mensaje: "${
                text.message
                  ? text.message.substring(0, 150) + "..."
                  : "Sin mensaje"
              }"`
            );
            console.log(
              `   📌 name_image (legacy): ${
                text.name_image || "undefined/null"
              }`
            );
            console.log(`   📌 images array: `, text.images);
            console.log(`   📌 createdAt: ${text.createdAt}`);
            console.log(`   📌 updatedAt: ${text.updatedAt}`);
            console.log(`   📌 OBJETO COMPLETO:`, text);
            console.log("   ─────────────────────────────────────");
          });
        }

        // Fetch images for each text
        const textsWithImages = await Promise.all(
          filteredTexts.map(async (text: ITextItem) => {
            try {
              console.log(
                `🖼️ === PROCESANDO IMÁGENES PARA TEXTO ${text.id} ===`
              );
              console.log(`   📌 Título: "${text.title}"`);
              console.log(`   📌 Categoría: "${text.category}"`);
              console.log(
                `   📌 name_image (legacy): ${
                  text.name_image || "undefined/null"
                }`
              );

              const images = await textImageService.getTextImages(text.id);
              console.log(`✅ Images found for text ${text.id}:`, images);

              // Log específico para cada imagen retornada
              if (images.length > 0) {
                images.forEach((img, index) => {
                  console.log(
                    `📸 === PROCESANDO IMAGEN ${index + 1} PARA "${
                      text.title
                    }" ===`
                  );
                  console.log(`   📌 Image ID: ${img.id}`);
                  console.log(`   📌 hasImageData: ${!!img.imageData}`);
                  console.log(
                    `   📌 imageDataLength: ${
                      img.imageData?.length || 0
                    } caracteres`
                  );
                  console.log(
                    `   📌 imageDataPrefix: "${
                      img.imageData?.substring(0, 50) || "No data"
                    }"`
                  );
                  console.log(`   📌 imageName: "${img.imageName}"`);
                  console.log(`   📌 imageType: "${img.imageType}"`);
                });
              } else {
                console.log(`❌ === SIN IMÁGENES PARA "${text.title}" ===`);
                console.log(`   📌 Array de imágenes vacío: []`);
                console.log(
                  `   📌 name_image legacy: ${
                    text.name_image || "undefined/null"
                  }`
                );
              }

              return { text, images };
            } catch (error) {
              console.error(
                `❌ === ERROR OBTENIENDO IMÁGENES PARA TEXTO ${text.id} ===`
              );
              console.error(`   📌 Título: "${text.title}"`);
              console.error(`   📌 Error:`, error);
              console.error(`   📌 Usando array vacío como fallback`);

              return { text, images: [] };
            }
          })
        );

        console.log(`🎯 === RESULTADO FINAL PARA CATEGORÍA "${category}" ===`);
        console.log(`📊 Total textos procesados: ${textsWithImages.length}`);
        textsWithImages.forEach((item, index) => {
          console.log(
            `📄 Texto ${index + 1}: "${item.text.title}" - ${
              item.images.length
            } imágenes`
          );
        });
        console.log(`🎯 Final result:`, textsWithImages);

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
