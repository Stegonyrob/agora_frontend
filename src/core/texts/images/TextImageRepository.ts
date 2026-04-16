import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthHeaders } from "../../auth/AuthHeaders";
import { ITextImage } from "./ITextImage";

export class TextImageRepository {
  private baseUri: string = `${
    import.meta.env.VITE_API_ENDPOINT_GENERAL
  }/text-images`;

  /**
   * Fetch images by textId using the specific endpoint
   */
  async getImagesByTextId(textId: number): Promise<ITextImage[]> {
    try {
      const response = await axios.get(`${this.baseUri}/${textId}`, {
        headers: getAuthHeaders(),
        timeout: 15000,
      });

      const result = Array.isArray(response.data) ? response.data : [];

      return result;
    } catch (error: any) {
      // If API fails, return empty array to allow fallback to static images
      // Error en GET

      return [];
    }
  }

  /**
   * Upload multiple images for a specific text using the upload endpoint.
   * Following the same pattern as PostImage and EventImage.
   */
  async uploadTextImages(
    textId: number,
    imageFiles: File[]
  ): Promise<ITextImage[]> {
    // Upload process initiated
    console.log(
      `🔍 [TextImageRepository] textId recibido:`,
      textId,
      typeof textId
    );
    console.log(
      `🔍 [TextImageRepository] imageFiles:`,
      imageFiles.length,
      "archivos"
    );

    const formData = new FormData();
    formData.append("textId", textId.toString());

    imageFiles.forEach((file, index) => {
      // Processing file
      formData.append("files", file);
    });

    // Log exhaustivo del FormData
    console.log(
      `📤 [TextImageRepository] FormData keys:`,
      Array.from(formData.keys())
    );
    for (let [key, value] of formData.entries()) {
      if (typeof value === "string") {
        // FormData entry processed
      } else if (value instanceof File) {
        console.log(
          `📤 [TextImageRepository] FormData[${key}]: File(${value.name}, ${value.size} bytes)`
        );
      }
    }

    const config: AxiosRequestConfig = {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    };

    console.log(
      `📤 [TextImageRepository] URL de envío:`,
      `${this.baseUri}/upload`
    );
    // Request headers configured

    const response: AxiosResponse<ITextImage[]> = await axios.post(
      `${this.baseUri}/upload`,
      formData,
      config
    );

    // Request completed successfully

    // Verificar si la respuesta contiene textId
    if (Array.isArray(response.data)) {
      response.data.forEach((img, index) => {
        // Image processed successfully
      });
    }

    return response.data;
  }

  /**
   * Fetch a specific text image by its ID.
   */
  async getTextImageById(imageId: number): Promise<ITextImage> {
    const response: AxiosResponse<ITextImage> = await axios.get(
      `${this.baseUri}/image/${imageId}`,
      {
        headers: getAuthHeaders(),
        timeout: 10000,
      }
    );
    return response.data;
  }

  /**
   * Create a new text image.
   */
  async createTextImage(
    textImageData: Partial<ITextImage>
  ): Promise<ITextImage> {
    const response: AxiosResponse<ITextImage> = await axios.post(
      this.baseUri,
      textImageData,
      {
        headers: getAuthHeaders(),
        timeout: 10000,
      }
    );
    return response.data;
  }

  /**
   * Delete a specific text image by its ID.
   */
  async deleteTextImage(imageId: number): Promise<void> {
    // Delete process initiated
    // Processing image deletion
    console.log(
      `🗑️ [TextImageRepository] URL: ${this.baseUri}/image/${imageId}`
    );

    await axios.delete(`${this.baseUri}/image/${imageId}`, {
      headers: getAuthHeaders(),
      timeout: 10000,
    });

    console.log(
      `✅ [TextImageRepository] Imagen ${imageId} borrada exitosamente`
    );
  }

  /**
   * Delete multiple text images by their IDs.
   */
  async deleteMultipleTextImages(imageIds: number[]): Promise<void> {
    await axios.delete(`${this.baseUri}/delete-multiple`, {
      headers: getAuthHeaders(),
      data: imageIds,
      timeout: 10000,
    });
  }

  /**
   * Delete all images for a specific text ID.
   */
  async deleteAllTextImages(textId: number): Promise<void> {
    await axios.delete(`${this.baseUri}/${textId}`, {
      headers: getAuthHeaders(),
      timeout: 10000,
    });
  }

  /**
   * Build the URL for accessing an image
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
}
