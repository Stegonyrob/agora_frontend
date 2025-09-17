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
      console.log(`TextImageService: Fetching images for text ID ${textId}`);

      // Try to get images from API first
      const apiResponse = await this.repository.getImagesByTextId(textId);

      // Normalize API response (handle both single object and array)
      let apiImages: ITextImage[] = [];
      if (apiResponse) {
        if (Array.isArray(apiResponse)) {
          apiImages = apiResponse;
        } else if (
          typeof apiResponse === "object" &&
          (apiResponse as any).imagePath
        ) {
          apiImages = [apiResponse as ITextImage];
        }
      }

      // Filter valid API images
      const validApiImages = apiImages.filter(
        (img) => img.imagePath && typeof img.imagePath === "string"
      );

      if (validApiImages.length > 0) {
        console.log(
          `TextImageService: Found ${validApiImages.length} API images for text ${textId}`
        );
        return validApiImages.map((img) => ({
          ...img,
          url: this.buildImageUrl(img.imagePath),
        }));
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
    if (!textId) {
      throw new Error("Text ID is required for image upload");
    }

    if (!imageFiles || imageFiles.length === 0) {
      return [];
    }

    try {
      const uploadedImages = await this.repository.uploadPostImages(
        textId,
        imageFiles
      );

      // Ensure the response is an array
      if (!Array.isArray(uploadedImages)) {
        throw new Error(
          "Invalid response: Expected an array of uploaded images"
        );
      }

      return uploadedImages;
    } catch (error: any) {
      throw new Error(
        `Error uploading images by text ID: ${
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
