import ImageService from "../../../services/ImageService";
import { logger } from "../../logging/LoggerService";
import { EventImageRepository } from "./EventImageRepository";
import { IEventImage } from "./IEventImage";

/**
 * EventImageService - Gestiona las imágenes de eventos con soporte para imagePath y fallbacks
 *
 * Este servicio maneja:
 * 1. Carga de imágenes desde el repositorio de eventos
 * 2. Construcción de URLs usando imagePath cuando está disponible
 * 3. Fallback a sistema blob cuando imagePath no existe
 * 4. Fallback a imágenes estáticas cuando todo falla
 */
export class EventImageService {
  private eventImageRepo: EventImageRepository;
  private imageService: ImageService;

  // Mapeo de eventos a imágenes de fallback
  private eventImageFallbacks: Record<number, string[]> = {
    1: ["cubos.jpg", "niñoPuzzle.jpg", "pintando.jpg"], // Taller de Juegos de Mesa
    2: ["niños.jpg", "adolescentesGrupal.jpg", "ivan.jpg"], // Escuela de Padres
    3: ["alumnosOrdenador.jpg", "libros.jpg", "leyendo.jpg"], // Eventos educativos
    4: ["fachada.jpg", "escritorio.jpg", "ivan.jpg"], // Eventos generales
  };

  constructor() {
    this.eventImageRepo = new EventImageRepository();
    this.imageService = new ImageService();
  }

  /**
   * Obtiene las imágenes de un evento con URLs procesadas
   */
  async getEventImagesWithUrls(
    eventId: number,
    isAdminContext: boolean = false
  ): Promise<IEventImage[]> {
    try {
      logger.debug(
        "EventImageService: Obteniendo imágenes de evento",
        {
          eventId,
          isAdminContext,
        },
        {
          component: "EventImageService",
        }
      );

      let images: IEventImage[] = [];

      try {
        // Intentar obtener imágenes del repositorio
        images = isAdminContext
          ? await this.eventImageRepo.getEventImages(eventId)
          : await this.eventImageRepo.getPublicEventImages(eventId);

        logger.debug(
          "EventImageService: Imágenes obtenidas del repositorio",
          {
            eventId,
            imageCount: images.length,
            images: images.map((img) => ({
              id: img.id,
              imageName: img.imageName,
              hasImagePath: !!img.imagePath,
            })),
          },
          {
            component: "EventImageService",
          }
        );
      } catch (repositoryError) {
        logger.warn(
          "EventImageService: Error al obtener imágenes del repositorio, usando fallbacks",
          {
            eventId,
            error:
              repositoryError instanceof Error
                ? repositoryError.message
                : String(repositoryError),
          },
          {
            component: "EventImageService",
          }
        );

        // Crear imágenes mock usando fallbacks
        images = await this.createFallbackImages(eventId);
      }

      // Procesar cada imagen para generar la URL correcta
      const processedImages = await Promise.all(
        images.map(async (image) => {
          try {
            // Si es una imagen mock (fallback), usar la URL directamente
            if (image.isMock && image.url) {
              return image;
            }

            // Priorizar imagePath si está disponible (sin verificar existencia para evitar CORS)
            if (image.imagePath) {
              const filename =
                image.imagePath.split("/").pop() || image.imagePath;
              const staticUrl = this.imageService.getImageUrl(filename);

              logger.debug(
                "EventImageService: Usando imagen estática (sin verificación CORS)",
                {
                  imageId: image.id,
                  filename,
                  staticUrl,
                },
                {
                  component: "EventImageService",
                }
              );

              return {
                ...image,
                url: staticUrl,
              };
            }

            // Fallback: usar sistema blob tradicional (solo si no es mock)
            if (!image.isMock && image.id) {
              try {
                const blobUrl = isAdminContext
                  ? this.eventImageRepo.buildImageUrl(image.id)
                  : this.eventImageRepo.buildPublicImageUrl(image.id);

                logger.debug(
                  "EventImageService: Usando sistema blob como fallback",
                  {
                    imageId: image.id,
                    blobUrl,
                  },
                  {
                    component: "EventImageService",
                  }
                );

                return {
                  ...image,
                  url: blobUrl,
                };
              } catch (blobError) {
                logger.error(
                  "EventImageService: Error con sistema blob",
                  {
                    imageId: image.id,
                    error:
                      blobError instanceof Error
                        ? blobError.message
                        : String(blobError),
                  },
                  {
                    component: "EventImageService",
                  }
                );
              }
            }

            // Último fallback: imagen genérica
            return {
              ...image,
              url: this.imageService.getImageUrl("fachada.jpg"),
            };
          } catch (error) {
            logger.error(
              "EventImageService: Error procesando imagen individual",
              {
                imageId: image.id,
                imageName: image.imageName,
                error: error instanceof Error ? error.message : String(error),
              },
              {
                component: "EventImageService",
              }
            );

            // En caso de error, usar imagen genérica
            return {
              ...image,
              url: this.imageService.getImageUrl("fachada.jpg"),
            };
          }
        })
      );

      logger.info(
        "EventImageService: Imágenes de evento procesadas exitosamente",
        {
          eventId,
          totalImages: processedImages.length,
          imagesWithUrls: processedImages.filter((img) => img.url).length,
          imagesWithoutUrls: processedImages.filter((img) => !img.url).length,
        },
        {
          component: "EventImageService",
        }
      );

      return processedImages;
    } catch (error) {
      logger.error(
        "EventImageService: Error general obteniendo imágenes de evento",
        {
          eventId,
          isAdminContext,
          error: error instanceof Error ? error.message : String(error),
        },
        {
          component: "EventImageService",
        }
      );

      // En caso de error total, crear al menos una imagen fallback
      return await this.createFallbackImages(eventId);
    }
  }

  /**
   * Crea imágenes de fallback cuando la API falla
   */
  private async createFallbackImages(eventId: number): Promise<IEventImage[]> {
    const fallbackFilenames = this.eventImageFallbacks[eventId] || [
      "fachada.jpg",
    ];
    const fallbackImages: IEventImage[] = [];

    // Usar directamente la primera imagen sin verificar existencia para evitar problemas de CORS
    const filename = fallbackFilenames[0];

    fallbackImages.push({
      id: null,
      eventId,
      imageName: filename,
      imagePath: `/temp_images/${filename}`,
      url: this.imageService.getImageUrl(filename),
      isMock: true,
      createdAt: new Date().toISOString(),
    });

    logger.info(
      "EventImageService: Imágenes fallback creadas (sin verificación CORS)",
      {
        eventId,
        fallbackCount: fallbackImages.length,
        selectedImage: filename,
      },
      {
        component: "EventImageService",
      }
    );

    return fallbackImages;
  }

  /**
   * Método legacy para compatibilidad - redirige a getEventImagesWithUrls
   */
  async getEventImages(
    eventId: number,
    category?: string
  ): Promise<IEventImage[]> {
    return this.getEventImagesWithUrls(eventId, false);
  }

  /**
   * Método de conveniencia para obtener solo las URLs de las imágenes
   */
  async getEventImageUrls(
    eventId: number,
    isAdminContext: boolean = false
  ): Promise<string[]> {
    try {
      const images = await this.getEventImagesWithUrls(eventId, isAdminContext);
      return images.filter((img) => img.url).map((img) => img.url!);
    } catch (error) {
      logger.error(
        "EventImageService: Error obteniendo URLs de imágenes de evento",
        {
          eventId,
          isAdminContext,
          error: error instanceof Error ? error.message : String(error),
        },
        {
          component: "EventImageService",
        }
      );

      // En caso de error, devolver al menos una URL genérica
      return [this.imageService.getImageUrl("fachada.jpg")];
    }
  }

  /**
   * Proxy methods para operaciones del repositorio que no requieren procesamiento de URLs
   */
  async uploadEventImages(
    eventId: number,
    imageFiles: File[]
  ): Promise<IEventImage[]> {
    return this.eventImageRepo.uploadEventImages(eventId, imageFiles);
  }

  async deleteEventImage(imageId: number): Promise<void> {
    return this.eventImageRepo.deleteEventImage(imageId);
  }

  /**
   * Build the URL for accessing an image from imagePath (legacy method).
   */
  buildImageUrlFromPath(imagePath: string): string {
    const filename = imagePath.split("/").pop() || imagePath;
    return this.imageService.getImageUrl(filename);
  }

  /**
   * Build the URL for accessing an image by ID (legacy method).
   */
  buildImageUrl(imageId: number): string {
    return this.eventImageRepo.buildImageUrl(imageId);
  }
}

export default EventImageService;
