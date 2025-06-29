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

    // Convertir formato del backend al formato del frontend
    const avatars: IAvatar[] = response.data.map((avatar: any) => ({
      id: avatar.id,
      name: avatar.displayName,
      imagePath: `/images/avatars/${avatar.imageName}`, // Convertir ruta del backend
      isDefault: false, // Para el selector, ninguno es "default"
      isCustom: false,
    }));

    console.log("🔄 AvatarRepository - Avatares convertidos:", avatars);
    return avatars;
  }

  /**
   * Obtiene el avatar por defecto del sistema
   * Temporal: usa /preloaded y filtra por default: true
   */
  async getDefaultAvatar(): Promise<IAvatar> {
    const headers = getAuthHeaders();
    console.log(
      "🔐 AvatarRepository - Headers de autenticación (default):",
      headers
    );

    // Temporal: usar /preloaded hasta que se arregle /default en backend
    const response = await axios.get(`${this.baseURL}/preloaded`, {
      headers,
    });

    const allAvatars = response.data;
    const defaultAvatar = allAvatars.find(
      (avatar: any) => avatar.default === true
    );

    if (!defaultAvatar) {
      throw new Error("No se encontró avatar por defecto");
    }

    // Convertir al formato esperado por el frontend
    const convertedAvatar: IAvatar = {
      id: defaultAvatar.id,
      name: defaultAvatar.displayName,
      imagePath: `/images/avatars/${defaultAvatar.imageName}`,
      isDefault: defaultAvatar.default,
      isCustom: false,
    };

    console.log(
      "✅ AvatarRepository - Avatar por defecto encontrado:",
      convertedAvatar
    );
    return convertedAvatar;
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
