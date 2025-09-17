import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthHeaders } from "../../auth/AuthHeaders";
import { IEventImage } from "./IEventImage";

export class EventImageRepository {
  private baseUri: string = `${
    import.meta.env.VITE_API_ENDPOINT_GENERAL
  }/event-images`;

  /**
   * Obtener todas las imágenes de un evento (PÚBLICO)
   * Endpoint: GET /api/v1/event-images/event/{eventId}
   */
  async getEventImages(eventId: number): Promise<IEventImage[]> {
    try {
      const response: AxiosResponse<IEventImage[]> = await axios.get(
        `${this.baseUri}/event/${eventId}`,
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener una imagen específica por ID (PÚBLICO)
   * Endpoint: GET /api/v1/event-images/{id}
   */
  async getEventImageById(imageId: number): Promise<IEventImage> {
    const response: AxiosResponse<IEventImage> = await axios.get(
      `${this.baseUri}/${imageId}`,
      { timeout: 10000 }
    );
    return response.data;
  }

  /**
   * Método legacy para compatibilidad - redirige a getEventImages
   */
  async getPublicEventImages(eventId: number): Promise<IEventImage[]> {
    return this.getEventImages(eventId);
  }

  /**
   * Subir imágenes a un evento (REQUIERE AUTENTICACIÓN)
   * Endpoint: POST /api/v1/event-images/upload
   */
  async uploadEventImages(
    eventId: number,
    imageFiles: File[]
  ): Promise<IEventImage[]> {
    const formData = new FormData();
    formData.append("eventId", eventId.toString());

    imageFiles.forEach((file) => {
      formData.append("files", file);
    });

    const config: AxiosRequestConfig = {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    };

    const response: AxiosResponse<IEventImage[]> = await axios.post(
      `${this.baseUri}/upload`,
      formData,
      config
    );
    return response.data;
  }

  /**
   * Eliminar una imagen de evento (REQUIERE AUTENTICACIÓN)
   * Endpoint: DELETE /api/v1/event-images/{id}
   */
  async deleteEventImage(imageId: number): Promise<void> {
    await axios.delete(`${this.baseUri}/${imageId}`, {
      headers: getAuthHeaders(),
      timeout: 10000,
    });
  }

  /**
   * Construir URL para imagen física basada en imagePath
   * Ejemplo: imagePath="/temp_images/cubos.jpg" -> "http://localhost:8080/temp_images/cubos.jpg"
   */
  buildImageUrl(imagePath: string): string {
    if (!imagePath) return "";

    // Si ya es una URL completa, devolverla tal como está
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Construir URL completa desde imagePath
    const baseUrl = import.meta.env.VITE_API_ENDPOINT_GENERAL.replace(
      "/api/v1",
      ""
    );
    return `${baseUrl}${imagePath}`;
  }

  /**
   * Método legacy para compatibilidad
   */
  buildPublicImageUrl(imageId: number): string {
    // Este método ahora es obsoleto ya que usamos imagePath
    // Mantenerlo solo para compatibilidad temporal
    return `${this.baseUri}/${imageId}/data`;
  }
}
