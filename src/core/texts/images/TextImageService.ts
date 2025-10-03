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
    if (!textId) {
      throw new Error("Text ID is required");
    }

    try {
      // Get images from API (will filter by textId in repository)
      const apiImages = await this.repository.getImagesByTextId(textId);

      // Filter valid API images
      const validApiImages = apiImages.filter(
        (img) => img.imagePath && typeof img.imagePath === "string"
      );

      if (validApiImages.length > 0) {
        return validApiImages.map((img) => ({
          ...img,
          url: this.buildImageUrl(img.imagePath),
        }));
      }

      // If no valid API images, try static images based on category mapping
      if (category) {
        return await this.getStaticImages(textId, category);
      }

      return [];
    } catch (error: any) {
      // Error fetching images for text
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

    return staticImages;
  }

  /**
   * Upload multiple images for a specific text ID.
   */
  async uploadImagesByTextId(
    textId: number,
    imageFiles: File[]
  ): Promise<ITextImage[]> {
    if (!textId) {
      throw new Error("Text ID is required for image upload");
    }

    if (!imageFiles || imageFiles.length === 0) {
      return [];
    }

    try {
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

      // NUEVO: Verificar inmediatamente si las imágenes se pueden recuperar
      try {
        const verificationImages = await this.repository.getImagesByTextId(
          textId
        );
        const uploadedIds = uploadedImages.map((img) => img.id);
        const foundNewImages = verificationImages.filter((img) =>
          uploadedIds.includes(img.id)
        );
        if (foundNewImages.length !== uploadedImages.length) {
          console.warn(
            `PROBLEM CRÍTICO EN TRANSACCIÓN: Solo se encontraron ${foundNewImages.length} de ${uploadedImages.length} imágenes subidas`
          );
          // Intentar verificación con delay más largo para transacción
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const delayedVerification = await this.repository.getImagesByTextId(
            textId
          );
          const delayedFoundImages = delayedVerification.filter((img) =>
            uploadedIds.includes(img.id)
          );
          if (delayedFoundImages.length === 0) {
            console.error(
              `TRANSACCIÓN ROLLBACK DETECTADA: Ninguna imagen nueva persiste después de 2 segundos`
            );
          } else if (delayedFoundImages.length < uploadedImages.length) {
            console.error(
              `TRANSACCIÓN PARCIAL: Solo ${delayedFoundImages.length}/${uploadedImages.length} imágenes persistieron`
            );
          }
        } else {
          console.log(
            `VERIFICACIÓN EXITOSA: Todas las imágenes subidas están persistiendo correctamente`
          );
        }
      } catch (verificationError) {
        console.error(`Error en verificación POST-UPLOAD:`, verificationError);
      }

      return uploadedImages;
    } catch (error: any) {
      console.error(
        `Error uploading images by text ID: ${
          error.response?.data?.message || error.message
        }`
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
    if (!imageId) {
      throw new Error("Image ID is required for deletion");
    }

    try {
      await this.repository.deleteTextImage(imageId);
    } catch (error: any) {
      // Error deleting image
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
