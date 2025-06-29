import { AvatarRepository } from "./AvatarRepository";
import IAvatar from "./IAvatar";

// Datos de prueba para cuando el backend no esté disponible
const MOCK_AVATARS: IAvatar[] = [
  {
    id: 1,
    name: "Avatar Aventurero",
    imagePath: "/images/avatars/1.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 2,
    name: "Avatar Creativo",
    imagePath: "/images/avatars/2.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 3,
    name: "Avatar Explorador",
    imagePath: "/images/avatars/3.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 4,
    name: "Avatar Genial",
    imagePath: "/images/avatars/4.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 5,
    name: "Avatar Brillante",
    imagePath: "/images/avatars/5.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 6,
    name: "Avatar Amigable",
    imagePath: "/images/avatars/6.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 7,
    name: "Avatar Divertido",
    imagePath: "/images/avatars/7.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 8,
    name: "Avatar Curioso",
    imagePath: "/images/avatars/8.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 9,
    name: "Avatar Alegre",
    imagePath: "/images/avatars/9.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 10,
    name: "Avatar Ingenioso",
    imagePath: "/images/avatars/10.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 11,
    name: "Avatar Estudioso",
    imagePath: "/images/avatars/11.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 12,
    name: "Avatar Entusiasta",
    imagePath: "/images/avatars/12.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 13,
    name: "Avatar Optimista",
    imagePath: "/images/avatars/13.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 14,
    name: "Avatar Colaborativo",
    imagePath: "/images/avatars/14.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 15,
    name: "Avatar Motivado",
    imagePath: "/images/avatars/15.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 16,
    name: "Avatar Innovador",
    imagePath: "/images/avatars/16.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 17,
    name: "Avatar Sonriente",
    imagePath: "/images/avatars/17.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 18,
    name: "Avatar Energético",
    imagePath: "/images/avatars/18.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 19,
    name: "Avatar Pensativo",
    imagePath: "/images/avatars/19.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 20,
    name: "Avatar Inspirador",
    imagePath: "/images/avatars/20.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 21,
    name: "Avatar Empático",
    imagePath: "/images/avatars/21.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 22,
    name: "Avatar Reflexivo",
    imagePath: "/images/avatars/22.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 23,
    name: "Avatar Determinado",
    imagePath: "/images/avatars/23.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 24,
    name: "Avatar Perseverante",
    imagePath: "/images/avatars/24.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 25,
    name: "Avatar Sociable",
    imagePath: "/images/avatars/25.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 26,
    name: "Avatar Paciente",
    imagePath: "/images/avatars/26.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 27,
    name: "Avatar Valiente",
    imagePath: "/images/avatars/27.png",
    isDefault: false,
    isCustom: false,
  },
  {
    id: 28,
    name: "Avatar Sabio",
    imagePath: "/images/avatars/28.png",
    isDefault: true,
    isCustom: false,
  },
];

export default class AvatarService {
  repository: AvatarRepository;

  constructor(repository = new AvatarRepository()) {
    this.repository = repository;
  }

  /**
   * Obtiene todos los avatares disponibles para el selector
   */
  async getAvatarsForSelector(): Promise<IAvatar[]> {
    try {
      console.log(
        "🔄 AvatarService - Intentando obtener avatares del backend..."
      );
      return await this.repository.getAvatarsForSelector();
    } catch (error) {
      console.log(
        "⚠️ AvatarService - Backend no disponible, usando datos mock:",
        error
      );
      return MOCK_AVATARS;
    }
  }

  /**
   * Obtiene el avatar por defecto del sistema
   */
  async getDefaultAvatar(): Promise<IAvatar> {
    try {
      console.log(
        "🔄 AvatarService - Intentando obtener avatar por defecto del backend..."
      );
      return await this.repository.getDefaultAvatar();
    } catch (error) {
      console.log(
        "⚠️ AvatarService - Backend no disponible, usando avatar por defecto mock:",
        error
      );
      return MOCK_AVATARS.find((a) => a.isDefault) || MOCK_AVATARS[0];
    }
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
      return `/api/avatars/${avatar.id}/image`;
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
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("userId", userId.toString());

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
