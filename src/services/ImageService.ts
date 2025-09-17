/**
 * Service for managing static images from the backend's temp_images directory.
 * Handles URL construction, existence validation, and image loading.
 */
export class ImageService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "http://localhost:8080/temp_images";
  }

  /**
   * Get the complete URL for an image filename
   * @param filename - Image filename (e.g., 'fachada.jpg')
   * @returns Complete URL for the image
   */
  getImageUrl(filename: string): string {
    if (!filename) {
      throw new Error("Filename is required");
    }
    return `${this.baseUrl}/${filename}`;
  }

  /**
   * Check if an image exists on the server
   * @param filename - Image filename
   * @returns Promise<boolean> indicating if image exists
   */
  async imageExists(filename: string): Promise<boolean> {
    try {
      const url = this.getImageUrl(filename);
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      console.error("Error checking image existence:", error);
      return false;
    }
  }

  /**
   * Preload an image for better performance
   * @param filename - Image filename
   * @returns Promise<HTMLImageElement>
   */
  async preloadImage(filename: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = this.getImageUrl(filename);
    });
  }

  /**
   * Get multiple images with existence validation
   * @param filenames - Array of image filenames
   * @returns Promise<Array<{filename: string, url: string, exists: boolean}>>
   */
  async validateMultipleImages(
    filenames: string[]
  ): Promise<Array<{ filename: string; url: string; exists: boolean }>> {
    const results = await Promise.all(
      filenames.map(async (filename) => {
        const url = this.getImageUrl(filename);
        const exists = await this.imageExists(filename);
        return { filename, url, exists };
      })
    );
    return results;
  }
}

// Singleton instance
export const imageService = new ImageService();
export default ImageService;
