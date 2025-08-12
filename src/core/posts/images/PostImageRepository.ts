import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthHeaders } from "../../auth/AuthHeaders";
import { IPostImage } from "./IPostImage";

export class PostImageRepository {
  private uri: string =
    import.meta.env.VITE_API_ENDPOINT_POST_IMAGES ||
    "http://localhost:8080/api/v1/post-images";

  /**
   * Obtener imágenes por ID de post
   * Endpoint real: GET /api/v1/post-images/post/{postId}
   * Devuelve array de objetos imagen con id, mimeType, uploadTime, etc
   */
  async getImagesByPostId(postId: number): Promise<IPostImage[]> {
    try {
      console.log(
        `🎯 [PostImageRepository] Fetching images for post ${postId}`
      );
      const startTime = Date.now();

      const response = await axios.get(`${this.uri}/post/${postId}`, {
        headers: getAuthHeaders(),
        timeout: 15000,
      });

      const responseTime = Date.now() - startTime;
      console.log(
        `⚡ [PostImageRepository] Response received in ${responseTime}ms`
      );

      const images: IPostImage[] = response.data;
      console.log(
        `✅ [PostImageRepository] Loaded ${images.length} images for post ${postId}:`,
        {
          imageIds: images.map((img) => img.id),
          imageNames: images.map((img) => img.imageName),
          responseTime: `${responseTime}ms`,
          fullImageData: images.map((img) => ({
            id: img.id,
            imageName: img.imageName,
            postId: img.postId,
            // Verificar que todos los campos están presentes
            hasAllFields: !!(img.id && img.imageName && img.postId),
          })),
        }
      );

      // Verificar integridad de datos
      const invalidImages = images.filter((img) => !img.id || !img.imageName);
      if (invalidImages.length > 0) {
        console.warn(
          `⚠️ [PostImageRepository] Found ${invalidImages.length} images with missing data:`,
          invalidImages
        );
      }

      return images;
    } catch (error: any) {
      console.error(
        `❌ [PostImageRepository] Failed to load images for post ${postId}:`,
        {
          errorName: error.name,
          errorMessage: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
        }
      );
      throw error;
    }
  }

  /**
   * Crear/subir imágenes a un post (SOLO ADMIN)
   * Endpoint real: POST /api/v1/post-images/upload
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

    console.log(
      `⬆️ [PostImageRepository] Uploading ${imageFiles.length} images to post ${postId} (ADMIN)`
    );
    const response: AxiosResponse<IPostImage[]> = await axios.post(
      `${this.uri}/upload`,
      formData,
      config
    );
    console.log(
      `✅ [PostImageRepository] Successfully uploaded images to post ${postId}`
    );
    return response.data;
  }

  /**
   * Obtener una imagen específica por ID (usuarios y admins)
   * Endpoint real: GET /api/v1/post-images/{id}
   */
  async getPostImageById(imageId: number): Promise<IPostImage> {
    try {
      console.log(`🔍 [PostImageRepository] Fetching image ${imageId}`);
      const response: AxiosResponse<IPostImage> = await axios.get(
        `${this.uri}/${imageId}`,
        {
          headers: getAuthHeaders(),
          timeout: 10000,
        }
      );
      console.log(`✅ [PostImageRepository] Found image ${imageId}`);
      return response.data;
    } catch (error: any) {
      console.error(
        `❌ [PostImageRepository] Error fetching image ${imageId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Crear una imagen de post (SOLO ADMIN)
   * Endpoint real: POST /api/v1/post-images
   */
  async createPostImage(
    postImageData: Partial<IPostImage>
  ): Promise<IPostImage> {
    console.log(`➕ [PostImageRepository] Creating new post image (ADMIN)`);
    const response: AxiosResponse<IPostImage> = await axios.post(
      this.uri,
      postImageData,
      {
        headers: getAuthHeaders(),
        timeout: 10000,
      }
    );
    console.log(`✅ [PostImageRepository] Successfully created post image`);
    return response.data;
  }

  /**
   * Actualizar una imagen de post (SOLO ADMIN)
   * Nota: No hay PUT en los endpoints proporcionados, mantener por compatibilidad
   */
  async updatePostImage(
    imageId: number,
    imageData: Partial<IPostImage>
  ): Promise<IPostImage> {
    console.log(`🔄 [PostImageRepository] Updating image ${imageId} (ADMIN)`);
    // Como no tienes PUT en los endpoints, esto podría fallar
    // Considerar usar DELETE + POST como alternativa
    const response: AxiosResponse<IPostImage> = await axios.put(
      `${this.uri}/${imageId}`,
      imageData,
      {
        headers: getAuthHeaders(),
        timeout: 10000,
      }
    );
    console.log(
      `✅ [PostImageRepository] Successfully updated image ${imageId}`
    );
    return response.data;
  }

  /**
   * Eliminar una imagen de post (SOLO ADMIN)
   * Endpoint real: DELETE /api/v1/post-images/{id}
   */
  async deletePostImage(imageId: number): Promise<void> {
    console.log(`🗑️ [PostImageRepository] Deleting image ${imageId} (ADMIN)`);
    await axios.delete(`${this.uri}/${imageId}`, {
      headers: getAuthHeaders(),
      timeout: 10000,
    });
    console.log(
      `✅ [PostImageRepository] Successfully deleted image ${imageId}`
    );
  }

  /**
   * Eliminar múltiples imágenes (SOLO ADMIN)
   * Endpoint real: DELETE /api/v1/post-images/delete-multiple
   */
  async deleteMultiplePostImages(imageIds: number[]): Promise<void> {
    console.log(
      `🗑️ [PostImageRepository] Deleting multiple images: ${imageIds.join(
        ", "
      )} (ADMIN)`
    );
    await axios.delete(`${this.uri}/delete-multiple`, {
      headers: getAuthHeaders(),
      data: { imageIds },
      timeout: 10000,
    });
    console.log(
      `✅ [PostImageRepository] Successfully deleted multiple images`
    );
  }

  /**
   * Construir URL para obtener datos de imagen directamente (requiere autenticación)
   * Endpoint real: GET /api/v1/post-images/{id}/data
   */
  buildImageUrl(imageId: number): string {
    const baseUrl = `${this.uri}/${imageId}/data`;

    // Agregar token de autenticación como parámetro de query para imágenes
    // Usar la misma fuente que AuthHeaders: sessionStorage.getItem("accessToken")
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      console.log(
        `🔐 [PostImageRepository] Adding authentication token to image URL for image ${imageId}`,
        {
          tokenSource: "sessionStorage.accessToken",
          tokenLength: token.length,
          tokenStart: token.substring(0, 20) + "...",
          finalUrl: `${baseUrl}?token=...`,
        }
      );
      return `${baseUrl}?token=${encodeURIComponent(token)}`;
    }

    // Log more details about why no token was found
    console.warn(
      `⚠️ [PostImageRepository] No token found for image ${imageId}`,
      {
        checkedLocation: "sessionStorage.accessToken",
        allSessionKeys: Object.keys(sessionStorage),
        allLocalStorageKeys: Object.keys(localStorage),
        usingUrlWithoutAuth: baseUrl,
      }
    );
    return baseUrl;
  }

  /**
   * Obtener imagen como Blob URL (para display en browser con autenticación)
   * Endpoint real: GET /api/v1/post-images/{id}/data
   * Convierte imagen autenticada en blob URL que el browser puede mostrar
   */
  async getImageAsBlob(imageId: number): Promise<string> {
    try {
      console.log(
        `🎯 [PostImageRepository] Creating blob URL for image ${imageId}`
      );
      const startTime = Date.now();

      const response = await axios.get(`${this.uri}/${imageId}/data`, {
        headers: getAuthHeaders(),
        responseType: "blob",
        timeout: 15000,
      });

      const responseTime = Date.now() - startTime;
      console.log(
        `⚡ [PostImageRepository] Blob request completed in ${responseTime}ms`
      );

      // Diagnóstico detallado del blob
      const blob = response.data;
      console.log(
        `🔍 [PostImageRepository] Blob analysis for image ${imageId}:`,
        {
          blobSize: blob.size,
          blobType: blob.type,
          responseHeaders: response.headers,
          responseStatus: response.status,
          responseStatusText: response.statusText,
          isValidImageSize: blob.size > 1000, // Las imágenes reales deberían ser >1KB
        }
      );

      // Si el blob es muy pequeño, leer su contenido para debug
      if (blob.size < 1000) {
        try {
          const text = await blob.text();
          console.warn(
            `⚠️ [PostImageRepository] Suspicious small blob for image ${imageId}:`,
            {
              size: blob.size,
              content: text.substring(0, 200),
              possibleError:
                "Backend might be returning error message instead of image",
            }
          );
        } catch (readError) {
          console.warn(
            `⚠️ [PostImageRepository] Could not read small blob content:`,
            readError
          );
        }
      }

      // Crear blob URL
      const blobUrl = URL.createObjectURL(blob);
      console.log(
        `✅ [PostImageRepository] Created blob URL for image ${imageId}:`,
        {
          blobUrl: blobUrl.substring(0, 50) + "...",
          blobSize: blob.size,
          mimeType: blob.type,
          responseTime: `${responseTime}ms`,
        }
      );

      return blobUrl;
    } catch (error: any) {
      console.error(
        `❌ [PostImageRepository] Failed to create blob URL for image ${imageId}:`,
        {
          errorName: error.name,
          errorMessage: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
        }
      );
      throw error;
    }
  }
}
