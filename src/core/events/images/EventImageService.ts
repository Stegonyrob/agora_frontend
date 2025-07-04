import { EventImageRepository } from "./EventImageRepository";
import { IEventImage } from "./IEventImage";

export class EventImageService {
  private repository: EventImageRepository;

  constructor() {
    this.repository = new EventImageRepository();
  }

  /**
   * Cargar imágenes de un evento
   */
  async getEventImages(eventId: number): Promise<IEventImage[]> {
    if (!eventId) {
      throw new Error("Event ID is required");
    }

    try {
      console.log(
        "🖼️ EventImageService - Cargando imágenes del evento:",
        eventId
      );

      const images = await this.repository.getEventImages(eventId);

      console.log("✅ EventImageService - Imágenes cargadas:", {
        eventId,
        cantidad: images.length,
        imagenes: images.map((img) => ({ id: img.id, name: img.imageName })),
      });

      return images;
    } catch (error: any) {
      console.error("💥 EventImageService - Error cargando imágenes:", error);

      if (error.response?.status === 404) {
        console.warn(
          "⚠️ EventImageService - No se encontraron imágenes para el evento:",
          eventId
        );
        return [];
      }

      throw new Error(
        `Error fetching event images: ${
          error.response?.data?.message || error.message
        }`
      );
    }
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
      console.warn("🚫 EventImageService - No hay imágenes para subir");
      return [];
    }

    try {
      console.log("🖼️ EventImageService - Subiendo imágenes al evento:", {
        eventId,
        cantidadArchivos: imageFiles.length,
        archivos: imageFiles.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
        })),
      });

      const uploadedImages = await this.repository.uploadEventImages(
        eventId,
        imageFiles
      );

      console.log("✅ EventImageService - Imágenes subidas exitosamente:", {
        cantidad: uploadedImages.length,
        imagenes: uploadedImages.map((img) => ({
          id: img.id,
          name: img.imageName,
        })),
      });

      return uploadedImages;
    } catch (error: any) {
      console.error("💥 EventImageService - Error subiendo imágenes:", error);

      if (error.response?.status === 404) {
        throw new Error(
          "Endpoint de subida de imágenes no encontrado. Verifica la configuración del backend."
        );
      }

      if (error.response?.status === 500) {
        const errorDetail =
          error.response?.data || "Error interno del servidor";
        throw new Error(
          `Error interno del servidor al subir imágenes: ${JSON.stringify(
            errorDetail
          )}`
        );
      }

      throw new Error(
        `Error uploading event images: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Eliminar una imagen de evento
   */
  async deleteEventImage(imageId: number): Promise<void> {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    try {
      console.log("🗑️ EventImageService - Eliminando imagen:", imageId);

      await this.repository.deleteEventImage(imageId);

      console.log(
        "✅ EventImageService - Imagen eliminada exitosamente:",
        imageId
      );
    } catch (error: any) {
      console.error("💥 EventImageService - Error eliminando imagen:", error);
      throw new Error(
        `Error deleting event image: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Construir URL para mostrar imagen
   */
  buildImageUrl(imageId: number): string {
    if (!imageId) {
      console.warn("⚠️ EventImageService - buildImageUrl llamado sin imageId");
      return "";
    }

    const imageUrl = this.repository.buildImageUrl(imageId);
    console.log("🔗 EventImageService - URL de imagen construida:", {
      imageId,
      url: imageUrl,
    });

    return imageUrl;
  }

  /**
   * Obtener datos binarios de una imagen
   */
  async getImageData(imageId: number): Promise<Blob> {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    try {
      console.log(
        "🖼️ EventImageService - Obteniendo datos de imagen:",
        imageId
      );

      const imageData = await this.repository.getImageData(imageId);

      console.log("✅ EventImageService - Datos de imagen obtenidos:", {
        size: imageData.size,
        type: imageData.type,
      });

      return imageData;
    } catch (error: any) {
      console.error(
        "💥 EventImageService - Error obteniendo datos de imagen:",
        error
      );
      throw new Error(
        `Error fetching image data: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }
}
