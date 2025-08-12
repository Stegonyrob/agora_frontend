import { IPostImage } from "./IPostImage";
import { PostImageRepository } from "./PostImageRepository";

/**
 * Servicio para gestionar imágenes de posts
 * Patrón similar a EventImageService para mantener consistencia
 */
export class PostImageService {
  private repository: PostImageRepository;

  constructor() {
    this.repository = new PostImageRepository();
  }

  /**
   * Cargar imágenes de un post (privado - requiere autenticación)
   */
  async getPostImages(postId: number): Promise<IPostImage[]> {
    console.log(`🎯 [PostImageService] ===== GETPOSTIMAGES CALLED =====`);
    console.log(
      `📞 [PostImageService] Received request for post ID: ${postId}`
    );

    if (!postId) {
      console.error(
        "❌ [PostImageService] Post ID is required but was:",
        postId
      );
      throw new Error("Post ID is required");
    }

    try {
      console.log(
        "🖼️ [PostImageService] Starting to load images for post:",
        postId
      );
      console.log(
        "📞 [PostImageService] About to call repository.getImagesByPostId()"
      );
      console.log(
        "🌐 [PostImageService] This will make HTTP request to backend"
      );

      const images = await this.repository.getImagesByPostId(postId);

      console.log("📥 [PostImageService] Repository returned:", {
        dataType: typeof images,
        isArray: Array.isArray(images),
        length: images?.length || 0,
      });

      if (images && images.length > 0) {
        console.log(
          "🖼️ [PostImageService] Images received:",
          images.map((img, index) => ({
            index,
            id: img.id,
            imageName: img.imageName || "No name",
            hasImageData: !!img.imageData,
            imageDataType: typeof img.imageData,
            imageDataLength: img.imageData?.length || 0,
            isMock: img.isMock || false,
          }))
        );
      } else {
        console.log("📭 [PostImageService] No images returned from repository");
      }

      console.log(
        "✅ [PostImageService] Successfully processed images for post:",
        postId,
        {
          finalCount: images.length,
          images: images,
        }
      );

      console.log(`🎯 [PostImageService] ===== GETPOSTIMAGES COMPLETED =====`);
      return images;
    } catch (error: any) {
      console.error("💥 [PostImageService] Error in getPostImages:", {
        postId,
        errorType: typeof error,
        errorMessage: error.message,
        errorStatus: error.response?.status,
        errorData: error.response?.data,
        fullError: error,
      });

      if (error.response?.status === 404) {
        console.warn(
          "⚠️ [PostImageService] 404 - No images found for post:",
          postId,
          "- Returning empty array"
        );
        return [];
      }

      console.error("💥 [PostImageService] Throwing error for post:", postId);
      throw new Error(
        `Error fetching post images: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Subir imágenes a un post
   */
  async uploadPostImages(
    postId: number,
    imageFiles: File[]
  ): Promise<IPostImage[]> {
    if (!postId) {
      throw new Error("Post ID is required for image upload");
    }

    if (!imageFiles || imageFiles.length === 0) {
      return [];
    }

    try {
      console.log("⬆️ PostImageService - Subiendo imágenes al post:", postId);

      const uploadedImages = await this.repository.uploadPostImages(
        postId,
        imageFiles
      );

      console.log("✅ PostImageService - Imágenes subidas:", {
        postId,
        cantidad: uploadedImages.length,
        imagenes: uploadedImages.map((img) => ({
          id: img.id,
          name: img.imageName,
        })),
      });

      return uploadedImages;
    } catch (error: any) {
      console.error("💥 PostImageService - Error subiendo imágenes:", error);

      throw new Error(
        `Error uploading post images: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Obtener una imagen específica por ID (usuarios y admins)
   */
  async getPostImageById(imageId: number): Promise<IPostImage> {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    try {
      console.log("🖼️ PostImageService - Cargando imagen por ID:", imageId);

      const image = await this.repository.getPostImageById(imageId);

      console.log("✅ PostImageService - Imagen cargada:", {
        id: image.id,
        name: image.imageName,
      });

      return image;
    } catch (error: any) {
      console.error("💥 PostImageService - Error cargando imagen:", error);

      throw new Error(
        `Error fetching post image: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Crear nueva imagen de post (SOLO ADMIN)
   */
  async createPostImage(
    postImageData: Partial<IPostImage>
  ): Promise<IPostImage> {
    try {
      console.log("➕ PostImageService - Creando nueva imagen (ADMIN)");

      const createdImage = await this.repository.createPostImage(postImageData);

      console.log("✅ PostImageService - Imagen creada:", {
        id: createdImage.id,
        name: createdImage.imageName,
      });

      return createdImage;
    } catch (error: any) {
      console.error("💥 PostImageService - Error creando imagen:", error);

      throw new Error(
        `Error creating post image: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Actualizar imagen de un post (SOLO ADMIN)
   */
  async updatePostImage(
    imageId: number,
    imageData: Partial<IPostImage>
  ): Promise<IPostImage> {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    try {
      console.log(
        "🔄 PostImageService - Actualizando imagen (ADMIN):",
        imageId
      );

      const updatedImage = await this.repository.updatePostImage(
        imageId,
        imageData
      );

      console.log("✅ PostImageService - Imagen actualizada:", {
        id: updatedImage.id,
        name: updatedImage.imageName,
      });

      return updatedImage;
    } catch (error: any) {
      console.error("💥 PostImageService - Error actualizando imagen:", error);

      throw new Error(
        `Error updating post image: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Eliminar imagen de un post (SOLO ADMIN)
   */
  async deletePostImage(imageId: number): Promise<void> {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    try {
      console.log("🗑️ PostImageService - Eliminando imagen (ADMIN):", imageId);

      await this.repository.deletePostImage(imageId);

      console.log("✅ PostImageService - Imagen eliminada:", imageId);
    } catch (error: any) {
      console.error("💥 PostImageService - Error eliminando imagen:", error);

      throw new Error(
        `Error deleting post image: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Eliminar múltiples imágenes (SOLO ADMIN)
   */
  async deleteMultiplePostImages(imageIds: number[]): Promise<void> {
    if (!imageIds || imageIds.length === 0) {
      throw new Error("Image IDs are required");
    }

    try {
      console.log(
        "🗑️ PostImageService - Eliminando múltiples imágenes (ADMIN):",
        imageIds
      );

      await this.repository.deleteMultiplePostImages(imageIds);

      console.log("✅ PostImageService - Imágenes eliminadas:", imageIds);
    } catch (error: any) {
      console.error(
        "💥 PostImageService - Error eliminando múltiples imágenes:",
        error
      );

      throw new Error(
        `Error deleting multiple post images: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Construir URL para imagen privada (requiere autenticación)
   */
  buildImageUrl(imageId: number): string {
    return this.repository.buildImageUrl(imageId);
  }

  /**
   * Construir URL para imagen pública (no requiere autenticación)
   * NOTA: Los posts son privados, pero mantenemos consistencia con EventImageService
   */
  buildPublicImageUrl(imageId: number): string {
    return this.repository.buildImageUrl(imageId);
  }
}

export default PostImageService;
