import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthHeaders } from "../../auth/AuthHeaders";
import { IEventImage } from "./IEventImage";

export class EventImageRepository {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_EVENT_IMAGES;

  /**
   * Obtener todas las imágenes de un evento
   * Endpoint: GET /api/v1/event-images/event/{eventId}
   */
  async getEventImages(eventId: number): Promise<IEventImage[]> {
    const response: AxiosResponse<IEventImage[]> = await axios.get(
      `${this.uri}/event/${eventId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  }

  /**
   * Subir imágenes a un evento
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
      `${this.uri}/upload`,
      formData,
      config
    );
    return response.data;
  }

  /**
   * Eliminar una imagen de evento
   * Endpoint: DELETE /api/v1/event-images/{id}
   */
  async deleteEventImage(imageId: number): Promise<void> {
    await axios.delete(`${this.uri}/${imageId}`, {
      headers: getAuthHeaders(),
      timeout: 10000,
    });
  }

  /**
   * Obtener datos de una imagen específica
   * Endpoint: GET /api/v1/event-images/{id}/data
   */
  async getImageData(imageId: number): Promise<Blob> {
    const response: AxiosResponse<Blob> = await axios.get(
      `${this.uri}/${imageId}/data`,
      {
        headers: getAuthHeaders(),
        responseType: "blob",
        timeout: 30000,
      }
    );
    return response.data;
  }

  /**
   * Construir URL para obtener imagen
   */
  buildImageUrl(imageId: number): string {
    return `${this.uri}/${imageId}/data`;
  }
}
