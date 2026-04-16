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
    const postsPage = await this.repository.getAll(page, size);
    const postsWithRealImages = await Promise.all(
      postsPage.content.map(async (post) => {
        if (
          post.images &&
          Array.isArray(post.images) &&
          post.images.length > 0
        ) {
          const firstImage = post.images[0];
          if (typeof firstImage === "object" && (firstImage as any).isMock) {
            try {
              const realImages = await this.imageService.getPostImages(post.id);
              if (realImages && realImages.length > 0) {
                post.images = realImages;
              }
            } catch {}
          } else if (typeof firstImage === "string") {
            try {
              const realImages = await this.imageService.getPostImages(post.id);
              if (realImages && realImages.length > 0) {
                post.images = realImages;
              }
            } catch {}
          }
        } else {
          try {
            const realImages = await this.imageService.getPostImages(post.id);
            if (realImages && realImages.length > 0) {
              post.images = realImages;
            }
          } catch {}
        }
        return post;
      })
    );
    // Ordenar por id descendente
    const ordered = postsWithRealImages.slice().sort((a, b) => b.id - a.id);
    return {
      ...postsPage,
      content: ordered,
    };
  }

  async getPostById(id: number): Promise<IPost> {
    const post = await this.repository.getById(id);
    if (post.images && Array.isArray(post.images) && post.images.length > 0) {
      const firstImage = post.images[0];
      if (typeof firstImage === "object" && (firstImage as any).isMock) {
        try {
          const realImages = await this.imageService.getPostImages(post.id);
          if (realImages && realImages.length > 0) {
            post.images = realImages;
          }
        } catch {}
      } else if (typeof firstImage === "string") {
        try {
          const realImages = await this.imageService.getPostImages(post.id);
          if (realImages && realImages.length > 0) {
            post.images = realImages;
          }
        } catch {}
      }
    } else {
      try {
        const realImages = await this.imageService.getPostImages(post.id);
        if (realImages && realImages.length > 0) {
          post.images = realImages;
        }
      } catch {}
    }
    return post;
  }

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
    return await this.imageService.getPostImages(postId);
  }

  /**
   * Servicio específico para obtener una imagen por ID
   */
  async getPostImageById(imageId: number): Promise<IPostImage> {
    return await this.imageService.getPostImageById(imageId);
  }

  /**
   * Servicio específico para crear una nueva imagen (SOLO ADMIN)
   */
  async createPostImage(
    postImageData: Partial<IPostImage>
  ): Promise<IPostImage> {
    return await this.imageService.createPostImage(postImageData);
  }

  /**
   * Servicio específico para subir imágenes a un post (SOLO ADMIN)
   */
  async uploadPostImages(
    postId: number,
    imageFiles: File[]
  ): Promise<IPostImage[]> {
    return await this.imageService.uploadPostImages(postId, imageFiles);
  }

  /**
   * Servicio específico para actualizar una imagen (SOLO ADMIN)
   */
  async updatePostImage(
    imageId: number,
    imageData: Partial<IPostImage>
  ): Promise<IPostImage> {
    // Corregido: usar createPostImage, ya que updatePostImage no existe en PostImageService
    return await this.imageService.createPostImage({
      id: imageId,
      ...imageData,
    });
  }

  /**
   * Servicio específico para eliminar una imagen (SOLO ADMIN)
   */
  async deletePostImage(imageId: number): Promise<void> {
    return await this.imageService.deletePostImage(imageId);
  }

  /**
   * Servicio específico para eliminar múltiples imágenes (SOLO ADMIN)
   */
  async deleteMultiplePostImages(imageIds: number[]): Promise<void> {
    return await this.imageService.deleteMultiplePostImages(imageIds);
  }
}
