import ImageService from "../../../services/ImageService";
import { logger } from "../../logging/LoggerService";
import { IPostImage } from "./IPostImage";
import { PostImageRepository } from "./PostImageRepository";

/**
 * PostImageService - Gestiona las imágenes de posts con soporte para imagePath y fallbacks
 *
 * Este servicio maneja:
 * 1. Carga de imágenes desde el repositorio de posts
 * 2. Construcción de URLs usando imagePath cuando está disponible
 * 3. Fallback a sistema blob cuando imagePath no existe
 * 4. Integración con ImageService para imágenes estáticas
 */
export class PostImageService {
  private postImageRepo: PostImageRepository;
  private imageService: ImageService;
  static buildImageUrlFromFilename: any;

  constructor() {
    this.postImageRepo = new PostImageRepository();
    this.imageService = new ImageService();
  }

  /**
   * Obtiene las imágenes de un post con URLs procesadas
   */
  async getPostImagesWithUrls(postId: number): Promise<IPostImage[]> {
    try {
      logger.debug(
        "PostImageService: Obteniendo imágenes de post",
        {
          postId,
        },
        {
          component: "PostImageService",
        }
      );

      // Obtener imágenes del repositorio
      const images = await this.postImageRepo.getImagesByPostId(postId);

      logger.debug(
        "PostImageService: Imágenes obtenidas del repositorio",
        {
          postId,
          imageCount: images.length,
          images: images.map((img) => ({
            id: img.id,
            imageName: img.imageName,
            hasImagePath: !!img.imagePath,
          })),
        },
        {
          component: "PostImageService",
        }
      );

      // Procesar cada imagen para generar la URL correcta
      const processedImages = await Promise.all(
        images.map(async (image) => {
          try {
            // Priorizar imagePath si está disponible (sin verificar existencia para evitar CORS)
            if (image.imagePath) {
              const staticUrl = this.postImageRepo.buildImageUrl(
                image.imagePath
              );

              logger.debug(
                "PostImageService: Usando imagen estática (sin verificación CORS)",
                {
                  imageId: image.id,
                  imagePath: image.imagePath,
                  staticUrl,
                },
                {
                  component: "PostImageService",
                }
              );

              return {
                ...image,
                url: staticUrl,
              };
            }

            // Fallback: usar sistema blob tradicional (legacy)
            const blobUrl = this.postImageRepo.buildImageUrlLegacy(image.id!);

            logger.debug(
              "PostImageService: Usando sistema blob como fallback",
              {
                imageId: image.id,
                blobUrl,
              },
              {
                component: "PostImageService",
              }
            );

            return {
              ...image,
              url: blobUrl,
            };
          } catch (error) {
            logger.error(
              "PostImageService: Error procesando imagen individual",
              {
                imageId: image.id,
                imageName: image.imageName,
                error: error instanceof Error ? error.message : String(error),
              },
              {
                component: "PostImageService",
              }
            );

            // En caso de error, devolver la imagen sin URL
            return {
              ...image,
              url: undefined,
            };
          }
        })
      );

      logger.info(
        `PostImageService: Procesadas ${processedImages.length} imágenes para post ${postId}`,
        {},
        {
          component: "PostImageService",
        }
      );

      return processedImages;
    } catch (error) {
      logger.error(
        "PostImageService: Error obteniendo imágenes de post",
        {
          postId,
          error: error instanceof Error ? error.message : String(error),
        },
        {
          component: "PostImageService",
        }
      );

      throw error;
    }
  }

  /**
   * Método legacy para compatibilidad - redirige a getPostImagesWithUrls
   */
  async getPostImages(postId: number): Promise<IPostImage[]> {
    return this.getPostImagesWithUrls(postId);
  }

  /**
   * Método de conveniencia para obtener solo las URLs de las imágenes
   */
  async getPostImageUrls(postId: number): Promise<string[]> {
    try {
      const images = await this.getPostImagesWithUrls(postId);
      return images.filter((img) => img.url).map((img) => img.url!);
    } catch (error) {
      logger.error(
        "PostImageService: Error obteniendo URLs de imágenes de post",
        {
          postId,
          error: error instanceof Error ? error.message : String(error),
        },
        {
          component: "PostImageService",
        }
      );

      return [];
    }
  }

  /**
   * Proxy methods para operaciones del repositorio que no requieren procesamiento de URLs
   */
  async uploadPostImages(
    postId: number,
    imageFiles: File[]
  ): Promise<IPostImage[]> {
    return this.postImageRepo.uploadPostImages(postId, imageFiles);
  }

  async getPostImageById(imageId: number): Promise<IPostImage> {
    return this.postImageRepo.getPostImageById(imageId);
  }

  async createPostImage(
    postImageData: Partial<IPostImage>
  ): Promise<IPostImage> {
    return this.postImageRepo.createPostImage(postImageData);
  }

  async deletePostImage(imageId: number): Promise<void> {
    return this.postImageRepo.deletePostImage(imageId);
  }

  async deleteMultiplePostImages(imageIds: number[]): Promise<void> {
    return this.postImageRepo.deleteMultiplePostImages(imageIds);
  }

  /**
   * Construir URL para imagen física basada en imagePath
   */
  buildImageUrl(imagePath: string): string {
    return this.postImageRepo.buildImageUrl(imagePath);
  }

  /**
   * Legacy methods para compatibilidad con IDs
   * @deprecated Usar buildImageUrl(imagePath) en su lugar
   */
  buildImageUrlLegacy(imageId: number): string {
    return this.postImageRepo.buildImageUrlLegacy(imageId);
  }

  buildPublicImageUrl(imageId: number): string {
    return this.postImageRepo.buildImageUrlLegacy(imageId);
  }
}

export default PostImageService;
