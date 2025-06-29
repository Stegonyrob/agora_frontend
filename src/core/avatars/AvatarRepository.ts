import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import IAvatar from "./IAvatar";

export class AvatarRepository {
  private baseURL = "/api/avatars";

  /**
   * Obtiene lista de avatares para el selector del frontend
   */
  async getAvatarsForSelector(): Promise<IAvatar[]> {
    const headers = getAuthHeaders();
    console.log("🔐 AvatarRepository - Headers de autenticación:", headers);

    const response = await axios.get(`${this.baseURL}/selector`, {
      headers,
    });
    console.log(
      "✅ AvatarRepository - Respuesta getAvatarsForSelector:",
      response.data
    );
    return response.data;
  }

  /**
   * Obtiene el avatar por defecto del sistema
   */
  async getDefaultAvatar(): Promise<IAvatar> {
    const headers = getAuthHeaders();
    console.log(
      "🔐 AvatarRepository - Headers de autenticación (default):",
      headers
    );

    const response = await axios.get(`${this.baseURL}/default`, {
      headers,
    });
    console.log(
      "✅ AvatarRepository - Respuesta getDefaultAvatar:",
      response.data
    );
    return response.data;
  }

  /**
   * Obtiene un avatar específico por ID
   */
  async getById(id: number): Promise<IAvatar> {
    const response = await axios.get(`${this.baseURL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  /**
   * Obtiene la imagen binaria de un avatar personalizado
   */
  async getAvatarImage(id: number): Promise<Blob> {
    const response = await axios.get(`${this.baseURL}/${id}/image`, {
      responseType: "blob",
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  /**
   * Obtiene un avatar por nombre de imagen
   */
  async getByImageName(imageName: string): Promise<IAvatar> {
    const response = await axios.get(`${this.baseURL}/name/${imageName}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  /**
   * Sube un avatar personalizado
   */
  async uploadCustomAvatar(formData: FormData): Promise<IAvatar> {
    const response = await axios.post(`${this.baseURL}/upload`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  /**
   * Elimina un avatar personalizado
   */
  async deleteCustomAvatar(id: number): Promise<void> {
    await axios.delete(`${this.baseURL}/${id}`, {
      headers: getAuthHeaders(),
    });
  }
}
