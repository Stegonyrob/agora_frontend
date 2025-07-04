import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";

export interface EventImageResponse {
  id: number;
  eventId: number;
  imageName: string;
  imageType: string;
  imageData: string; // Base64 o URL
  createdAt: string;
}

export default class EventImageService {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_EVENT_IMAGES;

  /**
   * Subir imágenes a un evento existente
   * Endpoint: POST /api/v1/event-images/upload
   */
  async uploadEventImages(
    eventId: number,
    imageFiles: File[]
  ): Promise<EventImageResponse[]> {
    if (!eventId) {
      throw new Error("Event ID is required for image upload");
    }

    if (!imageFiles || imageFiles.length === 0) {
      console.warn("🚫 EventImageService - No hay imágenes para subir");
      return [];
    }

    console.log("🖼️ EventImageService - Subiendo imágenes al evento:", {
      eventId,
      cantidadArchivos: imageFiles.length,
      uri: this.uri,
      archivos: imageFiles.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      })),
    });

    const formData = new FormData();
    formData.append("eventId", eventId.toString());

    imageFiles.forEach((file, index) => {
      console.log(`📎 Agregando archivo ${index + 1}:`, {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      formData.append("files", file);
    });

    const config: AxiosRequestConfig = {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000, // 30 segundos timeout
    };

    try {
      const uploadUrl = `${this.uri}/upload`;
      console.log("📤 EventImageService - Enviando request a:", uploadUrl);
      console.log("📦 EventImageService - FormData enviada:", {
        eventId: formData.get("eventId"),
        filesCount: imageFiles.length,
        files: imageFiles.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
        })),
      });

      const response: AxiosResponse<EventImageResponse[]> = await axios.post(
        uploadUrl,
        formData,
        config
      );

      console.log("✅ EventImageService - Respuesta completa del servidor:", {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        dataType: typeof response.data,
        dataLength: Array.isArray(response.data)
          ? response.data.length
          : "No es array",
        data: response.data,
      });

      console.log("✅ EventImageService - Imágenes subidas exitosamente:", {
        cantidad: response.data.length,
        imagenes: response.data.map((img) => ({
          id: img.id,
          eventId: img.eventId,
          imageName: img.imageName,
          imageType: img.imageType,
        })),
      });

      return response.data;
    } catch (error: any) {
      console.error("💥 EventImageService - Error completo:", error);
      console.error("💥 EventImageService - Error subiendo imágenes:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data ? "FormData presente" : "Sin datos",
        },
      });

      // ✅ IMPORTANTE: Verificar si es realmente un error o respuesta exitosa mal interpretada
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        // Si el status es 2xx (exitoso), no es un error real
        if (status >= 200 && status < 300) {
          console.log(
            "✅ EventImageService - Respuesta exitosa interpretada como error, corrigiendo..."
          );
          console.log("✅ Datos de respuesta exitosa:", data);
          return Array.isArray(data) ? data : [data];
        }

        // Si es 201 CREATED, es exitoso
        if (status === 201) {
          console.log(
            "✅ EventImageService - Status 201 CREATED detectado correctamente"
          );
          return Array.isArray(data) ? data : [data];
        }
      }

      if (error.response?.status === 404) {
        throw new Error(
          "Endpoint de subida de imágenes no encontrado. Verifica la configuración del backend."
        );
      }

      if (error.response?.status === 500) {
        const errorDetail =
          error.response?.data || "Error interno del servidor";
        console.error(
          "💥 EventImageService - Detalles del error 500:",
          errorDetail
        );
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
   * Obtener todas las imágenes de un evento
   * Endpoint: GET /api/v1/event-images/event/{eventId}
   */
  async getEventImages(eventId: number): Promise<EventImageResponse[]> {
    if (!eventId) {
      throw new Error("Event ID is required");
    }

    console.log("📸 EventImageService - Obteniendo imágenes del evento:", {
      eventId,
      uri: this.uri,
    });

    try {
      const getUrl = `${this.uri}/event/${eventId}`;
      console.log("📥 EventImageService - Consultando:", getUrl);

      const response: AxiosResponse<EventImageResponse[]> = await axios.get(
        getUrl,
        { headers: getAuthHeaders() }
      );

      console.log("✅ EventImageService - Imágenes obtenidas:", {
        cantidad: response.data.length,
        imagenes: response.data.map((img) => ({
          id: img.id,
          imageName: img.imageName,
          imageType: img.imageType,
        })),
      });

      return response.data;
    } catch (error: any) {
      console.error("💥 EventImageService - Error obteniendo imágenes:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      if (error.response?.status === 404) {
        console.warn(
          "⚠️ EventImageService - No se encontraron imágenes para el evento:",
          eventId
        );
        return []; // Retornar array vacío si no hay imágenes
      }

      throw new Error(
        `Error fetching event images: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Obtener datos de una imagen específica
   * Endpoint: GET /api/v1/event-images/{id}/data
   */
  async getImageData(imageId: number): Promise<Blob> {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    console.log("🖼️ EventImageService - Obteniendo datos de imagen:", {
      imageId,
      uri: this.uri,
    });

    try {
      const imageUrl = `${this.uri}/${imageId}/data`;
      console.log("📥 EventImageService - Consultando imagen:", imageUrl);

      const response: AxiosResponse<Blob> = await axios.get(imageUrl, {
        headers: getAuthHeaders(),
        responseType: "blob",
        timeout: 30000,
      });

      console.log("✅ EventImageService - Datos de imagen obtenidos:", {
        size: response.data.size,
        type: response.data.type,
      });

      return response.data;
    } catch (error: any) {
      console.error(
        "💥 EventImageService - Error obteniendo datos de imagen:",
        {
          imageId,
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
        }
      );

      throw new Error(
        `Error fetching image data: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Eliminar una imagen de evento
   * Endpoint: DELETE /api/v1/event-images/{id}
   */
  async deleteEventImage(imageId: number): Promise<void> {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    console.log("🗑️ EventImageService - Eliminando imagen:", {
      imageId,
      uri: this.uri,
    });

    try {
      const deleteUrl = `${this.uri}/${imageId}`;
      console.log("🗑️ EventImageService - Eliminando en:", deleteUrl);

      await axios.delete(deleteUrl, {
        headers: getAuthHeaders(),
        timeout: 10000,
      });

      console.log(
        "✅ EventImageService - Imagen eliminada exitosamente:",
        imageId
      );
    } catch (error: any) {
      console.error("💥 EventImageService - Error eliminando imagen:", {
        imageId,
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      throw new Error(
        `Error deleting event image: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Construir URL completa para servir imagen
   * @param imageId ID de la imagen
   * @returns URL completa para obtener la imagen
   */
  buildImageUrl(imageId: number): string {
    if (!imageId) {
      console.warn("⚠️ EventImageService - buildImageUrl llamado sin imageId");
      return "";
    }

    const imageUrl = `${this.uri}/${imageId}/data`;
    console.log("🔗 EventImageService - URL de imagen construida:", {
      imageId,
      url: imageUrl,
    });

    return imageUrl;
  }

  /**
   * Validar que el servicio esté correctamente configurado
   */
  validateConfiguration(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.uri) {
      errors.push(
        "Variable de entorno VITE_API_ENDPOINT_EVENT_IMAGES no está definida"
      );
    }

    if (!this.uri.includes("event-images")) {
      errors.push(
        "La URL del endpoint no parece correcta (debería contener 'event-images')"
      );
    }

    const isValid = errors.length === 0;

    console.log("🔍 EventImageService - Validación de configuración:", {
      isValid,
      uri: this.uri,
      errors,
    });

    return { isValid, errors };
  }
}
