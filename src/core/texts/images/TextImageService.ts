import { getFallbackImages } from "../../../config/imageMapping";
import { imageService } from "../../../services/ImageService";
import { ITextImage } from "./ITextImage";
import { TextImageRepository } from "./TextImageRepository";

/**
 * Service for managing text images with support for both API and static images.
 */
export class TextImageService {
  private repository: TextImageRepository;

  constructor() {
    this.repository = new TextImageRepository();
  }

  /**
   * Fetch all images associated with a specific text ID.
   * Uses API first, then falls back to static images based on category mapping.
   */
  async getImagesByTextId(
    textId: number,
    category?: string
  ): Promise<ITextImage[]> {
    console.log(`🔍 [TextImageService] === CARGA DE IMÁGENES ===`);
    console.log(`🔍 [TextImageService] textId:`, textId, typeof textId);

    if (!textId) {
      throw new Error("Text ID is required");
    }

    try {
      // Get images from API (will filter by textId in repository)
      console.log(
        `🔄 [TextImageService] Llamando repository.getImagesByTextId(${textId})...`
      );
      const apiImages = await this.repository.getImagesByTextId(textId);

      console.log(`🔍 [TextImageService] Respuesta del repository:`, apiImages);
      console.log(
        `🔍 [TextImageService] Número de imágenes recibidas:`,
        apiImages.length
      );

      // Filter valid API images
      const validApiImages = apiImages.filter(
        (img) => img.imagePath && typeof img.imagePath === "string"
      );

      console.log(
        `🔍 [TextImageService] Imágenes válidas después del filtro:`,
        validApiImages.length
      );

      if (validApiImages.length > 0) {
        console.log(
          `✅ [TextImageService] Procesando ${validApiImages.length} imágenes válidas`
        );
        const processedImages = validApiImages.map((img) => ({
          ...img,
          url: this.buildImageUrl(img.imagePath),
        }));
        console.log(
          `✅ [TextImageService] Imágenes procesadas:`,
          processedImages
        );
        return processedImages;
      }

      // If no valid API images, try static images based on category mapping
      if (category) {
        console.log(
          `TextImageService: No API images found, trying static images for category: ${category}`
        );
        return await this.getStaticImages(textId, category);
      }

      console.log(`TextImageService: No images found for text ${textId}`);
      return [];
    } catch (error: any) {
      console.error(
        `TextImageService: Error fetching images for text ID ${textId}:`,
        error
      );

      // On error, try static images if category is provided
      if (category) {
        console.log(
          `TextImageService: API failed, trying static images for category: ${category}`
        );
        return await this.getStaticImages(textId, category);
      }

      return [];
    }
  }

  /**
   * Get static images based on category and text ID mapping
   */
  private async getStaticImages(
    textId: number,
    category: string
  ): Promise<ITextImage[]> {
    const fallbackImages = getFallbackImages(textId, category);
    const staticImages: ITextImage[] = [];

    for (const filename of fallbackImages) {
      try {
        const exists = await imageService.imageExists(filename);
        if (exists) {
          staticImages.push({
            id: null,
            textId,
            imageName: filename,
            imagePath: `/temp_images/${filename}`,
            url: imageService.getImageUrl(filename),
            isMock: true,
          });
          // Only take the first available image for now
          break;
        }
      } catch (error) {
        console.error(`Error checking image ${filename}:`, error);
      }
    }

    console.log(
      `TextImageService: Found ${staticImages.length} static images for text ${textId}`
    );
    return staticImages;
  }

  /**
   * Upload multiple images for a specific text ID.
   */
  async uploadImagesByTextId(
    textId: number,
    imageFiles: File[]
  ): Promise<ITextImage[]> {
    console.log(`🔍 [TextImageService] === SERVICIO DE SUBIDA ===`);
    console.log(
      `🔍 [TextImageService] textId recibido:`,
      textId,
      typeof textId
    );
    console.log(
      `🔍 [TextImageService] imageFiles:`,
      imageFiles.length,
      "archivos"
    );

    if (!textId) {
      throw new Error("Text ID is required for image upload");
    }

    if (!imageFiles || imageFiles.length === 0) {
      return [];
    }

    try {
      console.log(
        `🔄 [TextImageService] Llamando al repository.uploadTextImages...`
      );
      const uploadedImages = await this.repository.uploadTextImages(
        textId,
        imageFiles
      );

      // Ensure the response is an array
      if (!Array.isArray(uploadedImages)) {
        throw new Error(
          "Invalid response: Expected an array of uploaded images"
        );
      }

      console.log(
        `✅ [TextImageService] Imágenes subidas exitosamente:`,
        uploadedImages
      );

      // NUEVO: Verificar inmediatamente si las imágenes se pueden recuperar
      console.log(
        `🔍 [TextImageService] Verificando inmediatamente si las imágenes se guardaron...`
      );
      console.log(
        `🔍 [TextImageService] IDs esperados de imágenes subidas:`,
        uploadedImages.map((img) => `${img.id} (${img.imageName})`).join(", ")
      );

      try {
        const verificationImages = await this.repository.getImagesByTextId(
          textId
        );
        console.log(
          `🔍 [TextImageService] Verificación POST-UPLOAD (total encontradas): ${verificationImages.length}`
        );
        console.log(
          `🔍 [TextImageService] IDs encontrados:`,
          verificationImages
            .map((img) => `${img.id} (${img.imageName})`)
            .join(", ")
        );

        // Buscar específicamente las imágenes recién subidas
        const uploadedIds = uploadedImages.map((img) => img.id);
        const foundNewImages = verificationImages.filter((img) =>
          uploadedIds.includes(img.id)
        );
        console.log(
          `🔍 [TextImageService] Imágenes recién subidas encontradas: ${foundNewImages.length}/${uploadedImages.length}`
        );

        if (foundNewImages.length !== uploadedImages.length) {
          console.warn(
            `⚠️ [TextImageService] PROBLEMA CRÍTICO: Solo se encontraron ${foundNewImages.length} de ${uploadedImages.length} imágenes subidas`
          );
          console.warn(
            `⚠️ [TextImageService] Esto indica un problema de transacciones en el backend`
          );

          // Mostrar qué IDs específicos faltan
          const missingIds = uploadedIds.filter(
            (id) => !verificationImages.some((img) => img.id === id)
          );
          console.warn(
            `⚠️ [TextImageService] IDs faltantes:`,
            missingIds.join(", ")
          );

          // Intentar verificación con delay más largo para transacciones
          console.log(
            `🔍 [TextImageService] Intentando verificación con delay de 2 segundos (transacciones)...`
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const delayedVerification = await this.repository.getImagesByTextId(
            textId
          );
          const delayedFoundImages = delayedVerification.filter((img) =>
            uploadedIds.includes(img.id)
          );
          console.log(
            `🔍 [TextImageService] Verificación con delay: ${delayedFoundImages.length}/${uploadedImages.length} encontradas`
          );

          if (delayedFoundImages.length === 0) {
            console.error(
              `🚨 [TextImageService] TRANSACCIÓN ROLLBACK DETECTADA: Ninguna imagen nueva persiste después de 2 segundos`
            );
          } else if (delayedFoundImages.length < uploadedImages.length) {
            console.error(
              `🚨 [TextImageService] TRANSACCIÓN PARCIAL: Solo ${delayedFoundImages.length}/${uploadedImages.length} imágenes persistieron`
            );
          }
        } else {
          console.log(
            `✅ [TextImageService] VERIFICACIÓN EXITOSA: Todas las imágenes subidas están persistiendo correctamente`
          );
        }
      } catch (verificationError) {
        console.error(
          `❌ [TextImageService] Error en verificación POST-UPLOAD:`,
          verificationError
        );
      }

      return uploadedImages;
    } catch (error: any) {
      console.error(
        `❌ [TextImageService] Error en uploadImagesByTextId:`,
        error
      );
      throw new Error(
        `Error uploading images by text ID: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Delete a specific text image by its ID.
   */
  async deleteTextImage(imageId: number): Promise<void> {
    console.log(`🗑️ [TextImageService] === ELIMINACIÓN DE IMAGEN ===`);
    console.log(`🗑️ [TextImageService] imageId:`, imageId, typeof imageId);

    if (!imageId) {
      throw new Error("Image ID is required for deletion");
    }

    try {
      console.log(
        `🗑️ [TextImageService] Llamando repository.deleteTextImage(${imageId})...`
      );
      await this.repository.deleteTextImage(imageId);
      console.log(
        `✅ [TextImageService] Imagen ${imageId} eliminada exitosamente`
      );
    } catch (error: any) {
      console.error(
        `❌ [TextImageService] Error eliminando imagen ${imageId}:`,
        error
      );
      console.error(
        `❌ [TextImageService] Error response:`,
        error.response?.data
      );
      console.error(
        `❌ [TextImageService] Error status:`,
        error.response?.status
      );

      if (error.response?.status === 500) {
        console.error(
          `🚨 [TextImageService] ERROR 500 EN DELETE: Esto indica un problema en el backend.`
        );
        console.error(
          `🚨 [TextImageService] La imagen con ID ${imageId} puede que no exista o haya un problema en la base de datos.`
        );
      }

      throw new Error(
        `Error deleting text image: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Build the URL for accessing an image.
   */
  buildImageUrl(imagePath: string): string {
    return this.repository.buildImageUrl(imagePath);
  }
}

export default TextImageService;
