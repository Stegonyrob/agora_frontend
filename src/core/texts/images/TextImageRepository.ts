import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthHeaders } from "../../auth/AuthHeaders";
import { ITextImage } from "./ITextImage";

export class TextImageRepository {
  private uri: string =
    import.meta.env.VITE_API_ENDPOINT_TEXT_IMAGES ||
    "http://localhost:8080/api/v1/text-images";

  async getImagesByTextId(textId: number): Promise<ITextImage[]> {
    const response = await axios.get(`${this.uri}/text/${textId}`, {
      headers: getAuthHeaders(),
      timeout: 15000,
    });

    const images: ITextImage[] = response.data;

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
  ): Promise<ITextImage[]> {
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

    const response: AxiosResponse<ITextImage[]> = await axios.post(
      `${this.uri}/upload`,
      formData,
      config
    );
    return response.data;
  }

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

  async deleteTextImage(imageId: number): Promise<void> {
    await axios.delete(`${this.uri}/${imageId}`, {
      headers: getAuthHeaders(),
      timeout: 10000,
    });
  }

  async deleteMultipleTextImages(imageIds: number[]): Promise<void> {
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
