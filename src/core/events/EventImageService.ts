import { EventImageRepository } from "./images/EventImageRepository";
import { IEventImage } from "./images/IEventImage";

/**
 * Servicio de alto nivel para gestión de imágenes de eventos
 * Usa EventImageRepository para las operaciones de red
 */
export default class EventImageService {
  private repository: EventImageRepository;

  constructor() {
    this.repository = new EventImageRepository();
  }

  /**
   * Subir imágenes a un evento
   */
  async uploadEventImages(
    eventId: number,
    imageFiles: File[]
  ): Promise<IEventImage[]> {
    if (!eventId) {
      throw new Error("Event ID is required for image upload");
    }

    if (!imageFiles || imageFiles.length === 0) {
      return [];
    }

    try {
      console.log(
        `📤 EventImageService - Uploading ${imageFiles.length} images for event ${eventId}`
      );
      const response = await this.repository.uploadEventImages(
        eventId,
        imageFiles
      );
      console.log(
        `✅ EventImageService - Images uploaded successfully:`,
        response
      );
      return response;
    } catch (error: any) {
      console.error("❌ EventImageService - Error uploading images:", error);
      throw error;
    }
  }

  /**
   * Obtener todas las imágenes de un evento
   */
  async getEventImages(eventId: number): Promise<IEventImage[]> {
    if (!eventId) {
      throw new Error("Event ID is required");
    }

    try {
      return await this.repository.getEventImages(eventId);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return []; // No images found
      }
      console.error("❌ EventImageService - Error fetching images:", error);
      throw error;
    }
  }

  /**
   * Eliminar una imagen individual
   */
  async deleteEventImage(imageId: number): Promise<void> {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    try {
      console.log(`🗑️ EventImageService - Deleting image ${imageId}`);
      await this.repository.deleteEventImage(imageId);
      console.log(
        `✅ EventImageService - Image ${imageId} deleted successfully`
      );
    } catch (error: any) {
      console.error("❌ EventImageService - Error deleting image:", error);
      throw error;
    }
  }

  /**
   * Construir URL para acceso directo a imagen usando imagePath
   */
  buildImageUrl(imagePath: string): string {
    return this.repository.buildImageUrl(imagePath);
  }

  /**
   * Método legacy para compatibilidad
   * @deprecated Usar buildImageUrl(imagePath) en su lugar
   */
  buildImageUrlLegacy(imageId: number): string {
    return this.repository.buildPublicImageUrl(imageId);
  }
}
