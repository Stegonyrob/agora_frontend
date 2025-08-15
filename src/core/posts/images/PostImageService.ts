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

  async getPostImages(postId: number): Promise<IPostImage[]> {
    if (!postId) {
      throw new Error("Post ID is required");
    }

    try {
      const images = await this.repository.getImagesByPostId(postId);

      if (images && images.length > 0) {
        return images;
      } else {
        return [];
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }

      throw new Error(
        `Error fetching post images: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

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
      const uploadedImages = await this.repository.uploadPostImages(
        postId,
        imageFiles
      );

      return uploadedImages;
    } catch (error: any) {
      throw new Error(
        `Error uploading post images: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async getPostImageById(imageId: number): Promise<IPostImage> {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    try {
      const image = await this.repository.getPostImageById(imageId);

      return image;
    } catch (error: any) {
      throw new Error(
        `Error fetching post image: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async createPostImage(
    postImageData: Partial<IPostImage>
  ): Promise<IPostImage> {
    try {
      const createdImage = await this.repository.createPostImage(postImageData);

      return createdImage;
    } catch (error: any) {
      throw new Error(
        `Error creating post image: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async updatePostImage(
    imageId: number,
    imageData: Partial<IPostImage>
  ): Promise<IPostImage> {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    try {
      const updatedImage = await this.repository.updatePostImage(
        imageId,
        imageData
      );

      return updatedImage;
    } catch (error: any) {
      throw new Error(
        `Error updating post image: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async deletePostImage(imageId: number): Promise<void> {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    try {
      await this.repository.deletePostImage(imageId);
    } catch (error: any) {
      throw new Error(
        `Error deleting post image: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  async deleteMultiplePostImages(imageIds: number[]): Promise<void> {
    if (!imageIds || imageIds.length === 0) {
      throw new Error("Image IDs are required");
    }

    try {
      await this.repository.deleteMultiplePostImages(imageIds);
    } catch (error: any) {
      throw new Error(
        `Error deleting multiple post images: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  buildImageUrl(imageId: number): string {
    return this.repository.buildImageUrl(imageId);
  }

  buildPublicImageUrl(imageId: number): string {
    return this.repository.buildImageUrl(imageId);
  }
}

export default PostImageService;
