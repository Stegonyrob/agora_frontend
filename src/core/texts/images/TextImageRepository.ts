import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { imageService } from "../../../services/ImageService";
import { getAuthHeaders } from "../../auth/AuthHeaders";
import { ITextImage } from "./ITextImage";

export class TextImageRepository {
  private uri: string =
    import.meta.env.VITE_API_ENDPOINT_TEXT_IMAGES ||
    "http://localhost:8080/api/v1/text-images";

  /**
   * Fetch all images associated with a specific text ID.
   * Returns normalized response that can be either single object or array
   */
  async getImagesByTextId(textId: number): Promise<ITextImage | ITextImage[]> {
    try {
      const response = await axios.get(`${this.uri}/${textId}`, {
        headers: getAuthHeaders(),
        timeout: 15000,
      });

      // Return the raw response data - let the service handle normalization
      return response.data;
    } catch (error: any) {
      // If API fails, return empty array to allow fallback to static images
      console.log(
        `API request failed for text ${textId}, will use static images`
      );
      return [];
    }
  }

  /**
   * Upload multiple images for a specific post.
   */
  async uploadPostImages(
    postId: number,
    imageFiles: File[]
  ): Promise<ITextImage[]> {
    const formData = new FormData();
    formData.append("textId", postId.toString()); // Corrected to match backend's `textId` parameter

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

    const response: AxiosResponse<ITextImage[]> = await axios.post(
      `${this.uri}/upload`,
      formData,
      config
    );
    return response.data;
  }

  /**
   * Fetch a specific text image by its ID.
   */
  async getTextImageById(imageId: number): Promise<ITextImage> {
    const response: AxiosResponse<ITextImage> = await axios.get(
      `${this.uri}/${imageId}`,
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
      this.uri,
      textImageData,
      {
        headers: getAuthHeaders(),
        timeout: 10000,
      }
    );
    return response.data;
  }

  /**
   * Update an existing text image.
   */
  async updateTextImage(
    imageId: number,
    imageData: Partial<ITextImage>
  ): Promise<ITextImage> {
    const response: AxiosResponse<ITextImage> = await axios.put(
      `${this.uri}/${imageId}`,
      imageData,
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
    await axios.delete(`${this.uri}/${imageId}`, {
      headers: getAuthHeaders(),
      timeout: 10000,
    });
  }

  /**
   * Delete multiple text images by their IDs.
   */
  async deleteMultipleTextImages(imageIds: number[]): Promise<void> {
    await axios.delete(`${this.uri}/delete-multiple`, {
      headers: getAuthHeaders(),
      data: { imageIds },
      timeout: 10000,
    });
  }

  /**
   * Build the URL for accessing an image using the static image service
   */
  buildImageUrl(imagePath: string): string {
    // Extract filename from imagePath (e.g., "/temp_images/fachada.jpg" -> "fachada.jpg")
    const filename = imagePath.split("/").pop() || imagePath;
    return imageService.getImageUrl(filename);
  }

  /**
   * Get image URL using the static image service
   */
  async getImageAsBlob(imagePath: string): Promise<string> {
    // Extract filename from imagePath
    const filename = imagePath.split("/").pop() || imagePath;
    return imageService.getImageUrl(filename);
  }
}
