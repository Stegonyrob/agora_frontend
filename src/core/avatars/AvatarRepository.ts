import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import IAvatar from "./IAvatar";

export class AvatarRepository {
  private baseURL = import.meta.env.VITE_API_ENDPOINT_AVATARS;

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

    // Convertir al formato esperado por el frontend
    const convertedAvatar: IAvatar = {
      id: response.data.id,
      name: response.data.displayName,
      imagePath: `/images/avatars/${response.data.imageName}`,
      isDefault: response.data.default,
      isCustom: false,
    };

    console.log(
      "✅ AvatarRepository - Avatar por defecto convertido:",
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
    console.log("📤 AvatarRepository - uploadCustomAvatar iniciado");
    console.log("📤 AvatarRepository - baseURL:", this.baseURL);
    console.log("📤 AvatarRepository - FormData entries:");

    // Log detallado del contenido del FormData
    const entries: string[] = [];
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        entries.push(
          `${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
        );
        console.log(
          `  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
        );
      } else {
        entries.push(`${key}: ${value}`);
        console.log(`  ${key}: ${value}`);
      }
    }

    console.log(
      "📤 AvatarRepository - FormData keys:",
      Array.from(formData.keys())
    );
    console.log(
      "📤 AvatarRepository - FormData has 'file':",
      formData.has("file")
    );
    console.log(
      "📤 AvatarRepository - FormData get 'file':",
      formData.get("file")
    );

    const headers = getAuthHeaders();
    console.log("📤 AvatarRepository - Headers (sin Content-Type):", headers);

    // Verificar que no tengamos Content-Type en headers (debe ser automático para FormData)
    if ("Content-Type" in headers) {
      console.warn(
        "⚠️ AvatarRepository - Content-Type detectado en headers, removiendo..."
      );
      delete headers["Content-Type"];
    }

    try {
      const response = await axios.post(`${this.baseURL}/upload`, formData, {
        headers,
      });

      console.log("✅ AvatarRepository - Upload exitoso:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ AvatarRepository - Error en upload:", error);
      if (axios.isAxiosError(error)) {
        console.error(
          "❌ AvatarRepository - Error response:",
          error.response?.data
        );
        console.error(
          "❌ AvatarRepository - Error status:",
          error.response?.status
        );
      }
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
