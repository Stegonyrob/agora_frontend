import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";

export interface EventImageResponse {
  id: number;
  eventId: number;
  imageName: string;
  imageType: string;
  imageData: string; // Base64 encoded image data
  createdAt: string;
}

export default class EventImageService {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_EVENT_IMAGES;

  // Upload images to event
  async uploadEventImages(
    eventId: number,
    imageFiles: File[]
  ): Promise<EventImageResponse[]> {
    if (!eventId) {
      throw new Error("Event ID is required for image upload");
    }

    if (!imageFiles || imageFiles.length === 0) {
      return [];
    }

    const formData = new FormData();
    formData.append("eventId", eventId.toString());
    imageFiles.forEach((file) => formData.append("files", file));

    const config: AxiosRequestConfig = {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    };

    try {
      const response: AxiosResponse<EventImageResponse[]> = await axios.post(
        `${this.uri}/upload`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Error uploading event images:", error.message);
      throw new Error(`Error uploading event images: ${error.message}`);
    }
  }

  // Get all images for an event
  async getEventImages(eventId: number): Promise<EventImageResponse[]> {
    if (!eventId) {
      throw new Error("Event ID is required");
    }

    try {
      const response: AxiosResponse<EventImageResponse[]> = await axios.get(
        `${this.uri}/event/${eventId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return []; // No images found
      }
      console.error("Error fetching event images:", error.message);
      throw new Error(`Error fetching event images: ${error.message}`);
    }
  }

  // Delete single image
  async deleteEventImage(imageId: number): Promise<void> {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    try {
      await axios.delete(`${this.uri}/${imageId}`, {
        headers: getAuthHeaders(),
        timeout: 10000,
      });
    } catch (error: any) {
      console.error("Error deleting event image:", error.message);
      throw new Error(`Error deleting event image: ${error.message}`);
    }
  }

  // Delete multiple images
  async deleteMultipleEventImages(ids: number[]): Promise<void> {
    const url = `${this.uri}/delete-multiple`;

    if (!ids || ids.length === 0) {
      return;
    }

    try {
      console.log(
        `🗑️ EventImageService - Attempting to delete images with IDs:`,
        ids
      );
      // Axios requires the body for a DELETE request to be in the `data` property.
      // The backend endpoint expects a JSON object like: { "imageIds": [1, 2, 3] }
      await axios.delete(url, {
        headers: getAuthHeaders(),
        data: { imageIds: ids },
      });
      console.log(
        `✅ EventImageService - Images with IDs ${ids.join(
          ", "
        )} deleted successfully.`
      );
    } catch (error: any) {
      console.error("Error deleting multiple images:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = `Server error (${error.response?.status}): ${
          error.response?.data?.message || error.message
        }`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
      throw new Error("An unexpected error occurred while deleting images.");
    }
  }

  // Build image URL for direct access
  buildImageUrl(imageId: number): string {
    if (!imageId) return "";
    return `${this.uri}/${imageId}/data`;
  }
}
