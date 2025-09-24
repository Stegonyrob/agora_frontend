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
    console.log(`🔍 [TextImageRepository] === GET IMAGES ===`);
    console.log(`🔍 [TextImageRepository] textId:`, textId);
    console.log(`🔍 [TextImageRepository] URL:`, `${this.baseUri}/${textId}`);

    try {
      const response = await axios.get(`${this.baseUri}/${textId}`, {
        headers: getAuthHeaders(),
        timeout: 15000,
      });

      console.log(`✅ [TextImageRepository] Respuesta GET:`, response.data);
      console.log(`✅ [TextImageRepository] Status:`, response.status);

      const result = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ [TextImageRepository] Resultado final:`, result);

      return result;
    } catch (error: any) {
      // If API fails, return empty array to allow fallback to static images
      console.error(`❌ [TextImageRepository] Error en GET:`, error);
      console.log(
        `API request failed for text ${textId}, will use static images`
      );
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
    console.log(`🔍 [TextImageRepository] === UPLOAD DEBUG ===`);
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
      console.log(`📎 [TextImageRepository] Archivo ${index + 1}:`, file.name);
      formData.append("files", file);
    });

    // Log exhaustivo del FormData
    console.log(
      `📤 [TextImageRepository] FormData keys:`,
      Array.from(formData.keys())
    );
    for (let [key, value] of formData.entries()) {
      if (typeof value === "string") {
        console.log(`📤 [TextImageRepository] FormData[${key}]: "${value}"`);
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
    console.log(`📤 [TextImageRepository] Headers:`, config.headers);

    const response: AxiosResponse<ITextImage[]> = await axios.post(
      `${this.baseUri}/upload`,
      formData,
      config
    );

    console.log(
      `✅ [TextImageRepository] Respuesta del backend:`,
      response.data
    );
    console.log(
      `✅ [TextImageRepository] Respuesta completa:`,
      JSON.stringify(response.data, null, 2)
    );

    // Verificar si la respuesta contiene textId
    if (Array.isArray(response.data)) {
      response.data.forEach((img, index) => {
        console.log(`✅ [TextImageRepository] Imagen ${index + 1}:`, {
          id: img.id,
          textId: img.textId,
          imageName: img.imageName,
          imagePath: img.imagePath,
        });
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
    console.log(`🗑️ [TextImageRepository] === DELETE IMAGE ===`);
    console.log(`🗑️ [TextImageRepository] imageId: ${imageId}`);
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
