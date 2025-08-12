import { IPost } from "./IPost";
import { IPostDTO } from "./IPostDTO";
import PostRepository, { Page } from "./PostRepository";
import { IPostImage } from "./images/IPostImage";
import { PostImageService } from "./images/PostImageService";

export default class PostService {
  repository: PostRepository;
  private imageService: PostImageService;

  constructor(repository = new PostRepository()) {
    this.repository = repository;
    this.imageService = new PostImageService();
  }

  async getAllPosts(page = 0, size = 10): Promise<Page<IPost>> {
    console.log(
      `🚀 [PostService] Loading posts - page: ${page}, size: ${size}`
    );

    const postsPage = await this.repository.getAll(page, size);

    console.log(`📊 [PostService] Raw posts from repository:`, {
      totalElements: postsPage.totalElements,
      totalPages: postsPage.totalPages,
      contentLength: postsPage.content.length,
      posts: postsPage.content.map((post) => ({
        id: post.id,
        title: post.title,
        hasImages: !!post.images,
        imagesType: typeof post.images,
        imagesLength: Array.isArray(post.images) ? post.images.length : 0,
        imagesData: post.images,
      })),
    });

    // Ahora que tenemos los endpoints de Swagger, intentar cargar imágenes reales
    const postsWithRealImages = await Promise.all(
      postsPage.content.map(async (post, index) => {
        console.log(
          `🔄 [PostService] Processing post ${index + 1}/${
            postsPage.content.length
          } - ID: ${post.id}`
        );

        if (
          post.images &&
          Array.isArray(post.images) &&
          post.images.length > 0
        ) {
          console.log(
            `🖼️ [PostService] Post ${post.id} has ${post.images.length} images in data`
          );
          const firstImage = post.images[0];

          console.log(
            `🔍 [PostService] First image analysis for post ${post.id}:`,
            {
              imageType: typeof firstImage,
              isObject: typeof firstImage === "object",
              isMock:
                typeof firstImage === "object"
                  ? (firstImage as any).isMock
                  : false,
              hasId:
                typeof firstImage === "object"
                  ? !!(firstImage as any).id
                  : false,
              imageData: firstImage,
            }
          );

          // Si es un objeto mock (sin ID real), intentar obtener imágenes reales del backend
          if (typeof firstImage === "object" && (firstImage as any).isMock) {
            try {
              console.log(
                `🎯 [PostService] DETECTED MOCK IMAGES - Will call backend endpoint for post ${post.id}`
              );
              console.log(
                `� [PostService] About to call: this.imageService.getPostImages(${post.id})`
              );
              console.log(
                `📞 [PostService] This will trigger: GET /api/v1/post-images/post/${post.id}`
              );

              const realImages = await this.imageService.getPostImages(post.id);

              console.log(
                `📥 [PostService] Backend returned for post ${post.id}:`,
                {
                  realImagesType: typeof realImages,
                  realImagesLength: realImages?.length || 0,
                  realImagesData: realImages,
                }
              );

              if (realImages && realImages.length > 0) {
                console.log(
                  `✅ [PostService] Replacing mock images with ${realImages.length} real images for post ${post.id}`
                );
                post.images = realImages;
              } else {
                console.log(
                  `ℹ️ [PostService] No real images found for post ${post.id}, keeping mock objects for fallbacks`
                );
              }
            } catch (error) {
              console.warn(
                `⚠️ [PostService] Failed to load real images for post ${post.id}:`,
                {
                  error: (error as any).message,
                  fullError: error,
                }
              );
              // Mantener los objetos mock para que funcionen los fallbacks
            }
          } else if (typeof firstImage === "string") {
            console.log(
              `🎯 [PostService] DETECTED STRING IMAGES - Will call backend endpoint for post ${post.id}`
            );
            console.log(
              `🚀 [PostService] About to call: this.imageService.getPostImages(${post.id})`
            );
            console.log(
              `📞 [PostService] This will trigger: GET /api/v1/post-images/post/${post.id}`
            );

            try {
              const realImages = await this.imageService.getPostImages(post.id);

              console.log(
                `📥 [PostService] Backend returned for post ${post.id} (string images):`,
                {
                  realImagesType: typeof realImages,
                  realImagesLength: realImages?.length || 0,
                  realImagesData: realImages,
                }
              );

              if (realImages && realImages.length > 0) {
                console.log(
                  `✅ [PostService] Replacing string images with ${realImages.length} real images for post ${post.id}`
                );
                post.images = realImages;
              } else {
                console.log(
                  `ℹ️ [PostService] No real images found for post ${post.id}, keeping string images`
                );
              }
            } catch (error) {
              console.warn(
                `⚠️ [PostService] Failed to load real images for post ${post.id} (string images):`,
                {
                  error: (error as any).message,
                  fullError: error,
                }
              );
            }
          } else {
            console.log(
              `ℹ️ [PostService] Post ${post.id} images are not mock objects or strings, skipping backend call`
            );
          }
        } else {
          console.log(
            `📭 [PostService] Post ${post.id} has no images or images is not an array`
          );
          console.log(
            `🎯 [PostService] NO IMAGES DETECTED - Will try backend endpoint for post ${post.id}`
          );
          console.log(
            `🚀 [PostService] About to call: this.imageService.getPostImages(${post.id})`
          );
          console.log(
            `📞 [PostService] This will trigger: GET /api/v1/post-images/post/${post.id}`
          );

          try {
            const realImages = await this.imageService.getPostImages(post.id);

            console.log(
              `📥 [PostService] Backend returned for post ${post.id} (no images):`,
              {
                realImagesType: typeof realImages,
                realImagesLength: realImages?.length || 0,
                realImagesData: realImages,
              }
            );

            if (realImages && realImages.length > 0) {
              console.log(
                `✅ [PostService] Adding ${realImages.length} real images to post ${post.id} that had no images`
              );
              post.images = realImages;
            } else {
              console.log(
                `ℹ️ [PostService] No real images found for post ${post.id} that had no images`
              );
            }
          } catch (error) {
            console.warn(
              `⚠️ [PostService] Failed to load real images for post ${post.id} (no images):`,
              {
                error: (error as any).message,
                fullError: error,
              }
            );
          }
        }

        return post;
      })
    );

    console.log(
      `🏁 [PostService] Final result - Posts processed with image integration:`,
      {
        totalProcessed: postsWithRealImages.length,
        posts: postsWithRealImages.map((post) => ({
          id: post.id,
          title: post.title,
          finalImagesCount: Array.isArray(post.images) ? post.images.length : 0,
          hasRealImages:
            Array.isArray(post.images) &&
            post.images.length > 0 &&
            typeof post.images[0] === "object" &&
            !(post.images[0] as any)?.isMock,
        })),
      }
    );

    return {
      ...postsPage,
      content: postsWithRealImages,
    };
  }

  async getPostById(id: number): Promise<IPost> {
    console.log(`🔍 [PostService] Loading single post by ID: ${id}`);

    const post = await this.repository.getById(id);

    console.log(`📊 [PostService] Raw post data from repository:`, {
      id: post.id,
      title: post.title,
      hasImages: !!post.images,
      imagesType: typeof post.images,
      imagesLength: Array.isArray(post.images) ? post.images.length : 0,
      imagesData: post.images,
    });

    // Si el post tiene objetos mock o strings, intentar obtener imágenes reales
    if (post.images && Array.isArray(post.images) && post.images.length > 0) {
      const firstImage = post.images[0];

      console.log(`🔍 [PostService] Single post ${id} first image analysis:`, {
        imageType: typeof firstImage,
        isObject: typeof firstImage === "object",
        isMock:
          typeof firstImage === "object" ? (firstImage as any).isMock : false,
        hasId:
          typeof firstImage === "object" ? !!(firstImage as any).id : false,
        imageData: firstImage,
      });

      if (typeof firstImage === "object" && (firstImage as any).isMock) {
        try {
          console.log(
            `🎯 [PostService] SINGLE POST DETECTED MOCK IMAGES - Will call backend endpoint for post ${id}`
          );
          console.log(
            `🚀 [PostService] About to call: this.imageService.getPostImages(${id})`
          );
          console.log(
            `📞 [PostService] This will trigger: GET /api/v1/post-images/post/${id}`
          );

          const realImages = await this.imageService.getPostImages(post.id);

          console.log(
            `📥 [PostService] Backend returned for single post ${id}:`,
            {
              realImagesType: typeof realImages,
              realImagesLength: realImages?.length || 0,
              realImagesData: realImages,
            }
          );

          if (realImages && realImages.length > 0) {
            post.images = realImages;
            console.log(
              `✅ [PostService] Replaced mock with ${realImages.length} real images for single post ${id}`
            );
          } else {
            console.log(
              `ℹ️ [PostService] No real images found for single post ${id}`
            );
          }
        } catch (error) {
          console.warn(
            `⚠️ [PostService] Could not load real images for single post ${id}:`,
            {
              error: (error as any).message,
              fullError: error,
            }
          );
        }
      } else if (typeof firstImage === "string") {
        try {
          console.log(
            `🎯 [PostService] SINGLE POST DETECTED STRING IMAGES - Will call backend endpoint for post ${id}`
          );
          console.log(
            `🚀 [PostService] About to call: this.imageService.getPostImages(${id})`
          );
          console.log(
            `📞 [PostService] This will trigger: GET /api/v1/post-images/post/${id}`
          );

          const realImages = await this.imageService.getPostImages(post.id);

          console.log(
            `📥 [PostService] Backend returned for single post ${id} (string images):`,
            {
              realImagesType: typeof realImages,
              realImagesLength: realImages?.length || 0,
              realImagesData: realImages,
            }
          );

          if (realImages && realImages.length > 0) {
            post.images = realImages;
            console.log(
              `✅ [PostService] Replaced string with ${realImages.length} real images for single post ${id}`
            );
          } else {
            console.log(
              `ℹ️ [PostService] No real images found for single post ${id} (string images)`
            );
          }
        } catch (error) {
          console.warn(
            `⚠️ [PostService] Could not load real images for single post ${id} (string images):`,
            {
              error: (error as any).message,
              fullError: error,
            }
          );
        }
      } else {
        console.log(
          `ℹ️ [PostService] Single post ${id} images are not mock objects or strings, skipping backend call`
        );
      }
    } else {
      console.log(
        `📭 [PostService] Single post ${id} has no images or images is not an array`
      );
      console.log(
        `🎯 [PostService] SINGLE POST NO IMAGES - Will try backend endpoint for post ${id}`
      );
      console.log(
        `🚀 [PostService] About to call: this.imageService.getPostImages(${id})`
      );
      console.log(
        `� [PostService] This will trigger: GET /api/v1/post-images/post/${id}`
      );

      try {
        const realImages = await this.imageService.getPostImages(post.id);

        console.log(
          `📥 [PostService] Backend returned for single post ${id} (no images):`,
          {
            realImagesType: typeof realImages,
            realImagesLength: realImages?.length || 0,
            realImagesData: realImages,
          }
        );

        if (realImages && realImages.length > 0) {
          post.images = realImages;
          console.log(
            `✅ [PostService] Added ${realImages.length} real images to single post ${id} that had no images`
          );
        } else {
          console.log(
            `ℹ️ [PostService] No real images found for single post ${id} that had no images`
          );
        }
      } catch (error) {
        console.warn(
          `⚠️ [PostService] Could not load real images for single post ${id} (no images):`,
          {
            error: (error as any).message,
            fullError: error,
          }
        );
      }
    }

    console.log(`🏁 [PostService] Final single post result:`, {
      id: post.id,
      title: post.title,
      finalImagesCount: Array.isArray(post.images) ? post.images.length : 0,
      hasRealImages:
        Array.isArray(post.images) &&
        post.images.length > 0 &&
        typeof post.images[0] === "object" &&
        !(post.images[0] as any)?.isMock,
    });

    return post;
  }

  // CRUD (solo admin, el backend valida el rol)
  async createPost(post: IPostDTO): Promise<IPost> {
    return await this.repository.create(post);
  }

  async updatePost(postId: number, post: IPostDTO): Promise<IPost> {
    return await this.repository.update(postId, post);
  }

  async deletePost(p0: IPostDTO, postId: number): Promise<void> {
    return await this.repository.delete(postId);
  }

  async archivePost(postId: number, archive: boolean): Promise<void> {
    return await this.repository.archive(postId, archive);
  }

  async unArchivePost(postId: number): Promise<void> {
    return await this.repository.archive(postId, false);
  }

  /**
   * Servicio específico para obtener imágenes de un post
   */
  async getPostImages(postId: number): Promise<IPostImage[]> {
    console.log(
      `📸 [PostService] Direct getPostImages call for post ${postId}`
    );
    console.log(
      `📞 [PostService] This will trigger: GET /api/v1/post-images/post/${postId}`
    );
    return await this.imageService.getPostImages(postId);
  }

  /**
   * Servicio específico para obtener una imagen por ID
   */
  async getPostImageById(imageId: number): Promise<IPostImage> {
    console.log(
      `🖼️ [PostService] Direct getPostImageById call for image ${imageId}`
    );
    console.log(
      `📞 [PostService] This will trigger: GET /api/v1/post-images/${imageId}`
    );
    return await this.imageService.getPostImageById(imageId);
  }

  /**
   * Servicio específico para crear una nueva imagen (SOLO ADMIN)
   */
  async createPostImage(
    postImageData: Partial<IPostImage>
  ): Promise<IPostImage> {
    console.log(`➕ [PostService] Direct createPostImage call`);
    console.log(`📞 [PostService] This will trigger: POST /api/v1/post-images`);
    return await this.imageService.createPostImage(postImageData);
  }

  /**
   * Servicio específico para subir imágenes a un post (SOLO ADMIN)
   */
  async uploadPostImages(
    postId: number,
    imageFiles: File[]
  ): Promise<IPostImage[]> {
    console.log(
      `📤 [PostService] Direct uploadPostImages call for post ${postId} with ${imageFiles.length} files`
    );
    console.log(
      `📞 [PostService] This will trigger: POST /api/v1/post-images/upload`
    );
    return await this.imageService.uploadPostImages(postId, imageFiles);
  }

  /**
   * Servicio específico para actualizar una imagen (SOLO ADMIN)
   */
  async updatePostImage(
    imageId: number,
    imageData: Partial<IPostImage>
  ): Promise<IPostImage> {
    console.log(
      `✏️ [PostService] Direct updatePostImage call for image ${imageId}`
    );
    console.log(
      `📞 [PostService] This will trigger: PUT /api/v1/post-images/${imageId}`
    );
    return await this.imageService.updatePostImage(imageId, imageData);
  }

  /**
   * Servicio específico para eliminar una imagen (SOLO ADMIN)
   */
  async deletePostImage(imageId: number): Promise<void> {
    console.log(
      `🗑️ [PostService] Direct deletePostImage call for image ${imageId}`
    );
    console.log(
      `📞 [PostService] This will trigger: DELETE /api/v1/post-images/${imageId}`
    );
    return await this.imageService.deletePostImage(imageId);
  }

  /**
   * Servicio específico para eliminar múltiples imágenes (SOLO ADMIN)
   */
  async deleteMultiplePostImages(imageIds: number[]): Promise<void> {
    console.log(
      `🗑️ [PostService] Direct deleteMultiplePostImages call for ${imageIds.length} images`
    );
    console.log(
      `📞 [PostService] This will trigger: DELETE /api/v1/post-images/delete-multiple`
    );
    return await this.imageService.deleteMultiplePostImages(imageIds);
  }
}
