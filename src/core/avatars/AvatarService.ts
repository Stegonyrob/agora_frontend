import { AvatarRepository } from "./AvatarRepository";
import IAvatar from "./IAvatar";

export default class AvatarService {
  repository: AvatarRepository;

  constructor(repository = new AvatarRepository()) {
    this.repository = repository;
  }

  /**
   * Obtiene todos los avatares disponibles para el selector
   */
  async getAvatarsForSelector(): Promise<IAvatar[]> {
    return await this.repository.getAvatarsForSelector();
  }

  /**
   * Obtiene el avatar por defecto del sistema
   */
  async getDefaultAvatar(): Promise<IAvatar> {
    return await this.repository.getDefaultAvatar();
  }

  /**
   * Obtiene un avatar por ID
   */
  async getAvatarById(id: number): Promise<IAvatar> {
    return await this.repository.getById(id);
  }

  /**
   * Obtiene la URL de imagen de un avatar
   * Para avatares personalizados, devuelve la URL del endpoint de imagen binaria
   * Para avatares del sistema, devuelve la ruta estática
   */
  async getAvatarImageUrl(avatar: IAvatar): Promise<string> {
    if (avatar.isCustom) {
      // Para avatares personalizados, usar el endpoint de imagen binaria
      const baseURL = import.meta.env.VITE_API_ENDPOINT_AVATARS;
      return `${baseURL}/${avatar.id}/image`;
    } else {
      // Para avatares del sistema, usar la ruta estática
      return avatar.imagePath || "/images/avatars/default.png";
    }
  }

  /**
   * Obtiene la imagen binaria de un avatar personalizado
   */
  async getAvatarImageBlob(id: number): Promise<Blob> {
    return await this.repository.getAvatarImage(id);
  }

  /**
   * Obtiene un avatar por nombre de imagen
   */
  async getAvatarByImageName(imageName: string): Promise<IAvatar> {
    return await this.repository.getByImageName(imageName);
  }

  /**
   * Sube un nuevo avatar personalizado
   */
  async uploadCustomAvatar(file: File, userId: number): Promise<IAvatar> {
    // Avatar upload initiated

    const formData = new FormData();
    formData.append("file", file); // Backend expects @RequestParam("file")

    // El backend también acepta displayName como parámetro opcional
    const displayName = `Avatar personalizado - ${file.name}`;
    formData.append("displayName", displayName);

    // FormData prepared
    // Sending file and displayName to backend

    return await this.repository.uploadCustomAvatar(formData);
  }

  /**
   * Elimina un avatar personalizado
   * Solo se pueden eliminar avatares personalizados del usuario
   */
  async deleteCustomAvatar(id: number): Promise<void> {
    return await this.repository.deleteCustomAvatar(id);
  }

  /**
   * Valida si un archivo es una imagen válida para avatar
   */
  validateAvatarFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Formato de imagen no válido. Usa JPG, PNG, GIF o WebP.",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "La imagen es demasiado grande. Máximo 5MB.",
      };
    }

    return { isValid: true };
  }
}
