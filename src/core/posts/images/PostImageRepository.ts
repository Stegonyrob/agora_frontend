import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthHeaders } from "../../auth/AuthHeaders";
import { IPostImage } from "./IPostImage";

export class PostImageRepository {
  private baseUri: string = `${
    import.meta.env.VITE_API_ENDPOINT_GENERAL
  }/post-images`;

  /**
   * Obtener todas las imágenes de un post (REQUIERE AUTENTICACIÓN)
   * Endpoint: GET /api/v1/post-images/{postId}
   */
  async getImagesByPostId(postId: number): Promise<IPostImage[]> {
    const response = await axios.get(`${this.baseUri}/${postId}`, {
      headers: getAuthHeaders(),
      timeout: 15000,
    });

    const images: IPostImage[] = response.data;

    const invalidImages = images.filter((img) => !img.id || !img.imageName);
    if (invalidImages.length > 0) {
      throw new Error(
        `Found ${invalidImages.length} images with missing data: ${invalidImages}`
      );
    }

    return images;
  }

  /**
   * Obtener una imagen específica por ID (REQUIERE AUTENTICACIÓN)
   * Endpoint: GET /api/v1/post-images/{id}
   */
  async getPostImageById(imageId: number): Promise<IPostImage> {
    const response: AxiosResponse<IPostImage> = await axios.get(
      `${this.baseUri}/${imageId}`,
      {
        headers: getAuthHeaders(),
        timeout: 10000,
      }
    );
    return response.data;
  }

  /**
   * Subir imágenes a un post (REQUIERE AUTENTICACIÓN)
   * Endpoint: POST /api/v1/post-images/upload
   */
  async uploadPostImages(
    postId: number,
    imageFiles: File[]
  ): Promise<IPostImage[]> {
    const formData = new FormData();
    formData.append("postId", postId.toString());

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

    const response: AxiosResponse<IPostImage[]> = await axios.post(
      `${this.baseUri}/upload`,
      formData,
      config
    );
    return response.data;
  }

  /**
   * Crear una nueva imagen de post (REQUIERE AUTENTICACIÓN)
   * Endpoint: POST /api/v1/post-images
   */
  async createPostImage(
    postImageData: Partial<IPostImage>
  ): Promise<IPostImage> {
    const response: AxiosResponse<IPostImage> = await axios.post(
      this.baseUri,
      postImageData,
      {
        headers: getAuthHeaders(),
        timeout: 10000,
      }
    );
    return response.data;
  }

  /**
   * Eliminar una imagen de post (REQUIERE AUTENTICACIÓN)
   * Endpoint: DELETE /api/v1/post-images/{id}
   */
  async deletePostImage(imageId: number): Promise<void> {
    await axios.delete(`${this.baseUri}/${imageId}`, {
      headers: getAuthHeaders(),
      timeout: 10000,
    });
  }

  /**
   * Eliminar múltiples imágenes de post (REQUIERE AUTENTICACIÓN)
   * Endpoint: DELETE /api/v1/post-images/delete-multiple
   */
  async deleteMultiplePostImages(imageIds: number[]): Promise<void> {
    await axios.delete(`${this.baseUri}/delete-multiple`, {
      headers: getAuthHeaders(),
      data: imageIds,
      timeout: 10000,
    });
  }

  /**
   * Construir URL para imagen física basada en imagePath
   * Ejemplo: imagePath="/temp_images/post1.jpg" -> "http://localhost:8080/temp_images/post1.jpg"
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
   * Método legacy para compatibilidad con blob URLs (OBSOLETO)
   * @deprecated Usar buildImageUrl(imagePath) en su lugar
   */
  buildImageUrlLegacy(imageId: number): string {
    const baseUrl = `${this.baseUri}/${imageId}/data`;

    const token = sessionStorage.getItem("accessToken");
    if (token) {
      return `${baseUrl}?token=${encodeURIComponent(token)}`;
    }

    return baseUrl;
  }

  /**
   * Obtener imagen como blob (OBSOLETO)
   * @deprecated Las imágenes ahora se sirven directamente desde imagePath
   */
  async getImageAsBlob(imageId: number): Promise<string> {
    const response = await axios.get(`${this.baseUri}/${imageId}/data`, {
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
    return blobUrl;
  }
}
