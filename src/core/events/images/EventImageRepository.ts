import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthHeaders } from "../../auth/AuthHeaders";
import { IEventImage } from "./IEventImage";

export class EventImageRepository {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_EVENT_IMAGES;
  private publicUri: string =
    import.meta.env.VITE_API_ENDPOINT_EVENT_IMAGES_PUBLIC ||
    `${import.meta.env.VITE_API_ENDPOINT_GENERAL}/all/event-images`;

  /**
   * Obtener todas las imágenes de un evento
   * Endpoint: GET /api/v1/event-images/event/{eventId}
   */
  /**
   * Obtener todas las imágenes de un evento (privado)
   */
  async getEventImages(eventId: number): Promise<IEventImage[]> {
    console.log(
      `[EventImageRepository] Fetching event images for event: ${eventId}`
    );

    const headers = getAuthHeaders();
    console.log("[EventImageRepository] Headers being sent:", headers);

    try {
      const response: AxiosResponse<IEventImage[]> = await axios.get(
        `${this.uri}/event/${eventId}`,
        { headers }
      );
      console.log(
        `[EventImageRepository] Fetched ${response.data.length} event images`
      );
      return response.data;
    } catch (error) {
      console.error(
        "[EventImageRepository] Error fetching event images:",
        error
      );
      throw error;
    }
  }

  /**
   * Obtener todas las imágenes públicas de un evento
   * Endpoint: GET /api/v1/all/event-images/{eventId}
   */
  async getPublicEventImages(eventId: number): Promise<IEventImage[]> {
    const response: AxiosResponse<IEventImage[]> = await axios.get(
      `${this.publicUri}/${eventId}`
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
   * Obtener datos de una imagen específica como JSON con base64
   * Endpoint: GET /api/v1/all/event-images/{id}
   */
  async getPublicImageJson(imageId: number): Promise<{
    id: number;
    imageName: string;
    imageType: string;
    imageData: string;
  }> {
    const response = await axios.get(`${this.publicUri}/${imageId}`, {
      timeout: 10000,
    });
    return response.data;
  }

  /**
   * Obtener datos de una imagen específica como blob usando endpoint privado (admin)
   * Endpoint: GET /api/v1/any/event-images/{id}/data
   */
  async getImageAsBlob(imageId: number): Promise<string> {
    try {
      console.log(
        `[EventImageRepository] Fetching blob for image ID: ${imageId}`
      );
      const response = await axios.get(`${this.uri}/${imageId}/data`, {
        headers: getAuthHeaders(),
        responseType: "blob",
        timeout: 15000,
      });

      const blob = response.data;

      if (blob.size < 1000) {
        try {
          const text = await blob.text();
          throw new Error(
            `Suspicious small blob for image ${imageId}: ${text.substring(
              0,
              200
            )}`
          );
        } catch (readError) {
          // no-op
        }
      }

      const blobUrl = URL.createObjectURL(blob);
      console.log(
        `[EventImageRepository] Blob fetched successfully for image ID: ${imageId}`
      );
      return blobUrl;
    } catch (error) {
      console.error(
        `[EventImageRepository] Error fetching blob for image ID: ${imageId}`,
        error
      );
      throw error;
    }
  }

  /**
   * Obtener datos de una imagen específica como blob usando endpoint público
   * Endpoint: GET /api/v1/all/event-images/{id}/data
   */
  async getPublicImageAsBlob(imageId: number): Promise<string> {
    const response: AxiosResponse<Blob> = await axios.get(
      `${this.publicUri}/${imageId}/data`,
      {
        responseType: "blob",
        timeout: 30000,
      }
    );
    return URL.createObjectURL(response.data);
  }

  /**
   * Construir URL para obtener imagen
   */
  /**
   * Construir URL para obtener imagen (privada)
   */
  buildImageUrl(imageId: number): string {
    return `${this.uri}/${imageId}/data`;
  }

  /**
   * Construir URL para obtener imagen pública
   */
  buildPublicImageUrl(imageId: number): string {
    return `${this.publicUri}/${imageId}/data`;
  }
}
