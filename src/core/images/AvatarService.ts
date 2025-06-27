/**
 * Servicio para generar avatares diversos e inclusivos usando DiceBear API
 * Incluye avatares de diferentes razas, edades y estilos tipo LEGO/cartoon
 */

export interface AvatarOptions {
  seed?: string;
  style?:
    | "avataaars"
    | "personas"
    | "big-ears"
    | "bottts"
    | "pixel-art"
    | "miniavs"
    | "fun-emoji";
  size?: number;
  backgroundColor?: string;
}

export class AvatarService {
  private readonly baseUrl = "https://api.dicebear.com/7.x";
  private readonly defaultAvatarPath = "/images/avatarGeneric.png";
  private readonly adminAvatarPath = "/images/agoraLogoTrasBlanco.png"; // Avatar del logo para admin

  /**
   * Verifica si un usuario es administrador
   */
  private isAdmin(username: string): boolean {
    const adminUsernames = [
      "admin",
      "administrator",
      "agora-admin",
      "superuser",
    ];
    return adminUsernames.includes(username.toLowerCase());
  }

  /**
   * Obtiene el avatar del administrador (logo de Ágora)
   */
  getAdminAvatar(): string {
    return this.adminAvatarPath;
  }

  /**
   * Obtiene el avatar por defecto cuando falla la librería
   */
  getDefaultAvatar(): string {
    return this.defaultAvatarPath;
  }

  /**
   * Verifica si una URL de avatar es válida
   */
  async validateAvatarUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene una URL de avatar usando la API de DiceBear con fallback
   */
  getAvatarUrl(
    seed: string,
    style: string = "avataaars",
    size: number = 200,
    backgroundColor?: string
  ): string {
    try {
      const params = new URLSearchParams({
        seed: seed,
        size: size.toString(),
        ...(backgroundColor && { backgroundColor }),
      });

      return `${this.baseUrl}/${style}/svg?${params.toString()}`;
    } catch (error) {
      console.warn("Error generating avatar URL, using default:", error);
      return this.getDefaultAvatar();
    }
  }

  /**
   * Obtiene un avatar con fallback automático para casos de error
   */
  async getAvatarUrlWithFallback(
    seed: string,
    style: string = "avataaars",
    size: number = 200,
    backgroundColor?: string
  ): Promise<string> {
    // Si es admin, devolver avatar del logo
    if (this.isAdmin(seed)) {
      return this.getAdminAvatar();
    }

    try {
      const avatarUrl = this.getAvatarUrl(seed, style, size, backgroundColor);

      // Verificar si la URL es accesible
      const isValid = await this.validateAvatarUrl(avatarUrl);

      if (isValid) {
        return avatarUrl;
      } else {
        console.warn("Avatar URL not accessible, using default");
        return this.getDefaultAvatar();
      }
    } catch (error) {
      console.warn("Error getting avatar, using default:", error);
      return this.getDefaultAvatar();
    }
  }

  /**
   * Genera un avatar específico para niños/jóvenes (estilo cartoon)
   */
  getKidAvatar(seed: string): string {
    return this.getAvatarUrl(seed, "big-ears", 150);
  }

  /**
   * Genera un avatar específico para jóvenes/adultos (estilo LEGO)
   */
  getAdultAvatar(seed: string): string {
    return this.getAvatarUrl(seed, "avataaars", 200);
  }

  /**
   * Genera un avatar más realista para adultos profesionales
   */
  getProfessionalAvatar(seed: string): string {
    return this.getAvatarUrl(seed, "personas", 200);
  }

  /**
   * Genera un avatar tipo robot/mascota
   */
  getBotAvatar(seed: string): string {
    return this.getAvatarUrl(seed, "bottts", 200);
  }

  /**
   * Genera un avatar estilo pixel art/retro
   */
  getPixelAvatar(seed: string): string {
    return this.getAvatarUrl(seed, "pixel-art", 200);
  }

  /**
   * Genera un avatar estilo emoji divertido
   */
  getFunAvatar(seed: string): string {
    return this.getAvatarUrl(seed, "fun-emoji", 200);
  }

  /**
   * Genera un avatar minimalista
   */
  getMiniAvatar(seed: string): string {
    return this.getAvatarUrl(seed, "miniavs", 200);
  }

  /**
   * Obtiene múltiples URLs de avatares para galería con fallbacks
   */
  getAvatarGalleryUrls(
    count: number = 16,
    baseUsername: string = "user"
  ): string[] {
    const avatars: string[] = [];
    const styles = [
      "avataaars",
      "personas",
      "big-ears",
      "bottts",
      "pixel-art",
      "miniavs",
      "fun-emoji",
    ];

    try {
      for (let i = 0; i < count; i++) {
        const style = styles[i % styles.length];
        const seed = `${baseUsername}-${i}-${Date.now()}`;

        try {
          avatars.push(this.getAvatarUrl(seed, style));
        } catch (error) {
          console.warn(`Error generating avatar ${i}, using default`);
          avatars.push(this.getDefaultAvatar());
        }
      }
    } catch (error) {
      console.warn("Error generating avatar gallery, using defaults:", error);
      // Fallback: llenar con avatares por defecto
      for (let i = avatars.length; i < count; i++) {
        avatars.push(this.getDefaultAvatar());
      }
    }

    return avatars;
  }

  /**
   * Genera avatares predefinidos con diversidad étnica, de edad y estilos + fallbacks
   */
  getPredefinedAvatars(): {
    id: string;
    name: string;
    url: string;
    category: string;
    style: string;
  }[] {
    const avatars = [
      // Avatar especial del administrador
      {
        id: "admin",
        name: "Administrador Ágora",
        url: this.getAdminAvatar(),
        category: "admin",
        style: "logo",
      },

      // Niños diversos - Estilo Big Ears (cartoon)
      {
        id: "1",
        name: "Niña Alegre",
        url: this.getKidAvatar("happy-girl-child"),
        category: "children",
        style: "big-ears",
      },
      {
        id: "2",
        name: "Niño Aventurero",
        url: this.getKidAvatar("adventure-boy-child"),
        category: "children",
        style: "big-ears",
      },
      {
        id: "3",
        name: "Niña Estudiosa",
        url: this.getKidAvatar("studious-girl-child"),
        category: "children",
        style: "big-ears",
      },
      {
        id: "4",
        name: "Niño Deportista",
        url: this.getKidAvatar("sporty-boy-child"),
        category: "children",
        style: "big-ears",
      },

      // ...existing avatars...
      {
        id: "5",
        name: "Joven Creativo",
        url: this.getAdultAvatar("creative-young-person"),
        category: "youth",
        style: "avataaars",
      },
      {
        id: "6",
        name: "Estudiante",
        url: this.getAdultAvatar("student-young-person"),
        category: "youth",
        style: "avataaars",
      },
      {
        id: "7",
        name: "Artista Joven",
        url: this.getAdultAvatar("artist-young-person"),
        category: "youth",
        style: "avataaars",
      },
      {
        id: "8",
        name: "Gamer",
        url: this.getAdultAvatar("gamer-young-person"),
        category: "youth",
        style: "avataaars",
      },

      // Adultos diversos - Estilo Personas (realista)
      {
        id: "9",
        name: "Profesional Ejecutiva",
        url: this.getProfessionalAvatar("executive-woman"),
        category: "adults",
        style: "personas",
      },
      {
        id: "10",
        name: "Ingeniero",
        url: this.getProfessionalAvatar("engineer-man"),
        category: "adults",
        style: "personas",
      },
      {
        id: "11",
        name: "Doctora",
        url: this.getProfessionalAvatar("doctor-woman"),
        category: "adults",
        style: "personas",
      },
      {
        id: "12",
        name: "Profesor",
        url: this.getProfessionalAvatar("teacher-man"),
        category: "adults",
        style: "personas",
      },

      // Diversidad cultural - Estilo Avataaars
      {
        id: "13",
        name: "Persona con Hijab",
        url: this.getAdultAvatar("hijab-person"),
        category: "cultural",
        style: "avataaars",
      },
      {
        id: "14",
        name: "Persona con Turbante",
        url: this.getAdultAvatar("turban-person"),
        category: "cultural",
        style: "avataaars",
      },
      {
        id: "15",
        name: "Persona Afro",
        url: this.getAdultAvatar("afro-person"),
        category: "cultural",
        style: "avataaars",
      },
      {
        id: "16",
        name: "Persona Asiática",
        url: this.getAdultAvatar("asian-person"),
        category: "cultural",
        style: "avataaars",
      },

      // Personas mayores - Estilo Avataaars
      {
        id: "17",
        name: "Abuela Sabia",
        url: this.getAdultAvatar("wise-grandmother"),
        category: "seniors",
        style: "avataaars",
      },
      {
        id: "18",
        name: "Abuelo Cariñoso",
        url: this.getAdultAvatar("caring-grandfather"),
        category: "seniors",
        style: "avataaars",
      },

      // Avatares divertidos y únicos
      {
        id: "19",
        name: "Robot Amigable",
        url: this.getBotAvatar("friendly-robot"),
        category: "bots",
        style: "bottts",
      },
      {
        id: "20",
        name: "Personaje Pixel",
        url: this.getPixelAvatar("pixel-hero"),
        category: "pixel",
        style: "pixel-art",
      },
      {
        id: "21",
        name: "Emoji Feliz",
        url: this.getFunAvatar("happy-emoji"),
        category: "fun",
        style: "fun-emoji",
      },
      {
        id: "22",
        name: "Avatar Minimal",
        url: this.getMiniAvatar("minimal-person"),
        category: "minimal",
        style: "miniavs",
      },

      // Profesiones diversas
      {
        id: "23",
        name: "Chef",
        url: this.getAdultAvatar("chef-person"),
        category: "professions",
        style: "avataaars",
      },
      {
        id: "24",
        name: "Bombero",
        url: this.getAdultAvatar("firefighter-person"),
        category: "professions",
        style: "avataaars",
      },
      {
        id: "25",
        name: "Artista",
        url: this.getAdultAvatar("artist-person"),
        category: "professions",
        style: "avataaars",
      },
      {
        id: "26",
        name: "Científico",
        url: this.getAdultAvatar("scientist-person"),
        category: "professions",
        style: "avataaars",
      },

      // Avatar por defecto para casos de error
      {
        id: "default",
        name: "Avatar Por Defecto",
        url: this.getDefaultAvatar(),
        category: "default",
        style: "generic",
      },
    ];

    return avatars;
  }

  /**
   * Genera un avatar consistente basado en el nombre de usuario con fallbacks
   */
  getUserAvatar(
    username: string,
    style: AvatarOptions["style"] = "avataaars"
  ): string {
    // Si es admin, devolver avatar del logo
    if (this.isAdmin(username)) {
      return this.getAdminAvatar();
    }

    // Para usuarios normales, usar DiceBear con fallback
    try {
      return this.getAvatarUrl(username, style);
    } catch (error) {
      console.warn(
        `Error getting avatar for user ${username}, using default:`,
        error
      );
      return this.getDefaultAvatar();
    }
  }

  /**
   * Versión async del getUserAvatar con validación de URL
   */
  async getUserAvatarSafe(
    username: string,
    style: AvatarOptions["style"] = "avataaars"
  ): Promise<string> {
    return this.getAvatarUrlWithFallback(username, style);
  }

  /**
   * Genera un seed aleatorio para nuevos avatares
   */
  generateRandomSeed(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Obtiene categorías de avatares organizadas
   */
  getAvatarCategories() {
    return {
      admin: {
        name: "Administrador",
        description: "Avatar especial del administrador (logo Ágora)",
      },
      children: {
        name: "Niños",
        description: "Avatares estilo cartoon para los más pequeños",
      },
      youth: {
        name: "Jóvenes",
        description: "Avatares modernos para adolescentes y jóvenes adultos",
      },
      adults: {
        name: "Adultos",
        description: "Avatares profesionales y realistas",
      },
      seniors: {
        name: "Personas Mayores",
        description: "Avatares dignos para personas de la tercera edad",
      },
      cultural: {
        name: "Diversidad Cultural",
        description: "Avatares que representan diferentes culturas",
      },
      professions: {
        name: "Profesiones",
        description: "Avatares que representan diferentes trabajos",
      },
      bots: { name: "Robots", description: "Avatares tipo robot o mascota" },
      fun: { name: "Divertidos", description: "Avatares únicos y creativos" },
      pixel: { name: "Retro", description: "Avatares estilo pixel art" },
      minimal: {
        name: "Minimalistas",
        description: "Avatares con diseño limpio y simple",
      },
      default: {
        name: "Por Defecto",
        description: "Avatar de respaldo cuando hay errores",
      },
    };
  }

  /**
   * Obtiene información del estado del servicio
   */
  async getServiceStatus(): Promise<{ online: boolean; message: string }> {
    try {
      const testUrl = this.getAvatarUrl("test-connectivity");
      const isOnline = await this.validateAvatarUrl(testUrl);

      return {
        online: isOnline,
        message: isOnline
          ? "Servicio de avatares funcionando correctamente"
          : "Servicio de avatares no disponible, usando avatares por defecto",
      };
    } catch (error) {
      return {
        online: false,
        message: "Error al verificar el servicio de avatares",
      };
    }
  }
}
