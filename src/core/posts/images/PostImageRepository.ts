import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthHeaders } from "../../auth/AuthHeaders";
import { IPostImage } from "./IPostImage";

export class PostImageRepository {
  private uri: string =
    import.meta.env.VITE_API_ENDPOINT_POST_IMAGES ||
    "http://localhost:8080/api/v1/post-images";

  async getImagesByPostId(postId: number): Promise<IPostImage[]> {
    const response = await axios.get(`${this.uri}/post/${postId}`, {
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
      `${this.uri}/upload`,
      formData,
      config
    );
    return response.data;
  }

  async getPostImageById(imageId: number): Promise<IPostImage> {
    const response: AxiosResponse<IPostImage> = await axios.get(
      `${this.uri}/${imageId}`,
      {
        headers: getAuthHeaders(),
        timeout: 10000,
      }
    );
    return response.data;
  }

  async createPostImage(
    postImageData: Partial<IPostImage>
  ): Promise<IPostImage> {
    const response: AxiosResponse<IPostImage> = await axios.post(
      this.uri,
      postImageData,
      {
        headers: getAuthHeaders(),
        timeout: 10000,
      }
    );
    return response.data;
  }

  async updatePostImage(
    imageId: number,
    imageData: Partial<IPostImage>
  ): Promise<IPostImage> {
    const response: AxiosResponse<IPostImage> = await axios.put(
      `${this.uri}/${imageId}`,
      imageData,
      {
        headers: getAuthHeaders(),
        timeout: 10000,
      }
    );
    return response.data;
  }

  async deletePostImage(imageId: number): Promise<void> {
    await axios.delete(`${this.uri}/${imageId}`, {
      headers: getAuthHeaders(),
      timeout: 10000,
    });
  }

  async deleteMultiplePostImages(imageIds: number[]): Promise<void> {
    await axios.delete(`${this.uri}/delete-multiple`, {
      headers: getAuthHeaders(),
      data: { imageIds },
      timeout: 10000,
    });
  }

  buildImageUrl(imageId: number): string {
    const baseUrl = `${this.uri}/${imageId}/data`;

    const token = sessionStorage.getItem("accessToken");
    if (token) {
      return `${baseUrl}?token=${encodeURIComponent(token)}`;
    }

    return baseUrl;
  }

  async getImageAsBlob(imageId: number): Promise<string> {
    const response = await axios.get(`${this.uri}/${imageId}/data`, {
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
