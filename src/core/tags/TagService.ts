import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";

export interface Tag {
  id: number;
  name: string;
  archived: boolean;
}

export interface TagDTO {
  id?: number;
  name: string;
  archived?: boolean;
}

class TagService {
  private baseUrl = "http://localhost:8080/api/v1/tags";

  // Tags populares predefinidas que siempre deben aparecer como sugerencias
  private popularTags = [
    "Taller",
    "Escuela de padres",
    "Neurodiversidad",
    "Educación",
    "Recomendado",
    "Taller escuela",
    "Conferencia",
    "Recursos",
    "Apoyo",
    "Aprendizaje",
    "TEA",
    "Debates",
    "Inclusión",
    "Psicología",
    "Pedagogía",
    "Tecnología",
    "Reflexión",
    "Eventos",
    "Actividades",
  ];

  /**
   * Obtener todas las tags disponibles
   */
  async getAllTags(): Promise<Tag[]> {
    try {
      console.log("🏷️ TagService - Obteniendo todas las tags...");

      const response = await axios.get(this.baseUrl, {
        headers: getAuthHeaders(),
      });

      console.log("✅ TagService - Tags obtenidas:", {
        cantidad: response.data?.length || 0,
        tags: response.data,
      });

      return response.data || [];
    } catch (error) {
      console.error("❌ TagService - Error obteniendo tags:", error);
      throw error;
    }
  }

  /**
   * Obtener tags activas (no archivadas)
   */
  async getActiveTags(): Promise<Tag[]> {
    try {
      const allTags = await this.getAllTags();
      const activeTags = allTags.filter((tag) => !tag.archived);

      console.log("✅ TagService - Tags activas:", {
        total: allTags.length,
        activas: activeTags.length,
      });

      return activeTags;
    } catch (error) {
      console.error("❌ TagService - Error obteniendo tags activas:", error);
      throw error;
    }
  }

  /**
   * Obtener tags populares combinando predefinidas y del backend
   */
  async getPopularTags(): Promise<Tag[]> {
    try {
      console.log("🔥 TagService - Obteniendo tags populares...");

      // Obtener tags del backend
      const backendTags = await this.getActiveTags();

      // Crear un mapa de tags existentes por nombre
      const backendTagsMap = new Map<string, Tag>();
      backendTags.forEach((tag) => {
        backendTagsMap.set(tag.name.toLowerCase(), tag);
      });

      // Combinar tags populares predefinidas con las del backend
      const popularTagsResult: Tag[] = [];

      // Primero añadir las populares predefinidas que existen en el backend
      this.popularTags.forEach((tagName) => {
        const existingTag = backendTagsMap.get(tagName.toLowerCase());
        if (existingTag) {
          popularTagsResult.push(existingTag);
          backendTagsMap.delete(tagName.toLowerCase()); // Remover para evitar duplicados
        }
      });

      // Luego añadir las restantes del backend (hasta un máximo)
      const remainingBackendTags = Array.from(backendTagsMap.values());
      popularTagsResult.push(
        ...remainingBackendTags.slice(0, 15 - popularTagsResult.length)
      );

      console.log("✅ TagService - Tags populares obtenidas:", {
        predefinidas: this.popularTags.length,
        delBackend: backendTags.length,
        combinadas: popularTagsResult.length,
        tags: popularTagsResult.map((t) => t.name),
      });

      return popularTagsResult;
    } catch (error) {
      console.error("❌ TagService - Error obteniendo tags populares:", error);

      // Fallback: crear tags virtuales con las predefinidas
      const fallbackTags: Tag[] = this.popularTags
        .slice(0, 10)
        .map((name, index) => ({
          id: -(index + 1), // IDs negativos para tags virtuales
          name,
          archived: false,
        }));

      console.log(
        "⚠️ TagService - Usando tags predefinidas como fallback:",
        fallbackTags
      );
      return fallbackTags;
    }
  }

  /**
   * Crear una nueva tag
   */
  async createTag(tagData: TagDTO): Promise<Tag> {
    try {
      console.log("🏷️ TagService - Creando nueva tag:", tagData);

      const response = await axios.post(this.baseUrl, tagData, {
        headers: getAuthHeaders(),
      });

      console.log("✅ TagService - Tag creada exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ TagService - Error creando tag:", error);
      throw error;
    }
  }

  /**
   * Buscar tag por nombre
   */
  async findTagByName(name: string): Promise<Tag | null> {
    try {
      const allTags = await this.getAllTags();
      const tag = allTags.find(
        (tag) => tag.name.toLowerCase() === name.toLowerCase()
      );

      console.log("🔍 TagService - Buscando tag por nombre:", {
        nombre: name,
        encontrada: !!tag,
        tag: tag,
      });

      return tag || null;
    } catch (error) {
      console.error("❌ TagService - Error buscando tag:", error);
      return null;
    }
  }

  /**
   * Obtener o crear tag por nombre
   */
  async getOrCreateTag(name: string): Promise<Tag> {
    try {
      // Primero buscar si existe
      let tag = await this.findTagByName(name);

      if (tag) {
        console.log("✅ TagService - Tag existente encontrada:", tag);
        return tag;
      }

      // Si no existe, crear nueva
      console.log("🆕 TagService - Creando nueva tag:", name);
      tag = await this.createTag({ name, archived: false });

      return tag;
    } catch (error) {
      console.error("❌ TagService - Error obteniendo/creando tag:", error);
      throw error;
    }
  }

  /**
   * Obtener múltiples tags por nombres (crear si no existen)
   */
  async getOrCreateTags(names: string[]): Promise<Tag[]> {
    try {
      console.log("🏷️ TagService - Procesando múltiples tags:", names);

      const tags: Tag[] = [];

      for (const name of names) {
        if (name.trim()) {
          const tag = await this.getOrCreateTag(name.trim());
          tags.push(tag);
        }
      }

      console.log("✅ TagService - Tags procesadas:", {
        solicitadas: names.length,
        obtenidas: tags.length,
        tags: tags,
      });

      return tags;
    } catch (error) {
      console.error("❌ TagService - Error procesando múltiples tags:", error);
      throw error;
    }
  }

  /**
   * Archivar/desarchivar tag
   */
  async archiveTag(tagId: number, archived: boolean): Promise<Tag> {
    try {
      console.log("🗃️ TagService - Archivando tag:", { tagId, archived });

      const response = await axios.patch(
        `${this.baseUrl}/${tagId}/archive`,
        { archived },
        { headers: getAuthHeaders() }
      );

      console.log("✅ TagService - Tag archivada exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ TagService - Error archivando tag:", error);
      throw error;
    }
  }
}

export default TagService;
