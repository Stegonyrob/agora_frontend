import axios from "axios";
import mitt from "mitt";
import { getAuthHeaders } from "../auth/AuthHeaders";
import IAvatar from "./IAvatar";

const loginEventEmitter = mitt();

export const onLogin = (callback: () => void) => {
  loginEventEmitter.on("login", callback);
};

export const triggerLoginEvent = () => {
  loginEventEmitter.emit("login");
};
export const fetchAvatarsForSelector = async () => {
  try {
    const headers = getAuthHeaders();
    if (!headers.Authorization) {
      return;
    }
    const baseURL = import.meta.env.VITE_API_ENDPOINT_AVATARS;
    const response = await axios.get(`${baseURL}/selector`, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Escuchar el evento de login para disparar fetchAvatarsForSelector
onLogin(() => {
  fetchAvatarsForSelector();
});

export class AvatarRepository {
  private baseURL = import.meta.env.VITE_API_ENDPOINT_AVATARS;

  /**
   * Obtiene lista de avatares para el selector del frontend
   */
  async getAvatarsForSelector(): Promise<IAvatar[]> {
    const headers = getAuthHeaders();
    const response = await axios.get(`${this.baseURL}/selector`, {
      headers,
    });
    const avatars: IAvatar[] = response.data.map((avatar: any) => ({
      id: avatar.id,
      name: avatar.displayName,
      imagePath: `/images/avatars/${avatar.imageName}`,
      isDefault: false,
      isCustom: false,
    }));
    return avatars;
  }

  /**
   * Obtiene el avatar por defecto del sistema
   */
  async getDefaultAvatar(): Promise<IAvatar> {
    const headers = getAuthHeaders();
    const response = await axios.get(`${this.baseURL}/default`, {
      headers,
    });
    const convertedAvatar: IAvatar = {
      id: response.data.id,
      name: response.data.displayName,
      imagePath: `/images/avatars/${response.data.imageName}`,
      isDefault: response.data.default,
      isCustom: false,
    };
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
    const headers = getAuthHeaders();
    if ("Content-Type" in headers) {
      delete headers["Content-Type"];
    }
    try {
      const response = await axios.post(`${this.baseURL}/upload`, formData, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
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

// Escuchar el evento de login para disparar fetchAvatarsForSelector
onLogin(() => {
  fetchAvatarsForSelector()
    .then((data) => console.log("Avatars fetched successfully:", data))
    .catch((error) => console.error("Error fetching avatars:", error));
});
