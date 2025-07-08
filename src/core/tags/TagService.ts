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
  private baseUrl = "http://localhost:8080/api/v1/any/tags"; // Usar el endpoint que funciona
  private legacyUrl = "http://localhost:8080/api/v1/tags"; // Mantener el original como fallback

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
      console.log(
        "🏷️ TagService - Obteniendo todas las tags desde:",
        this.baseUrl
      );

      const response = await axios.get(this.baseUrl, {
        headers: getAuthHeaders(),
      });

      console.log("✅ TagService - Tags obtenidas del backend:", {
        cantidad: response.data?.length || 0,
        endpoint: this.baseUrl,
        primerasTags:
          response.data?.slice(0, 3)?.map((tag: Tag) => tag.name) || [],
      });

      return response.data || [];
    } catch (error) {
      console.error(
        "❌ TagService - Error obteniendo tags desde:",
        this.baseUrl,
        error
      );
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

      // Intentar obtener tags del backend con timeout corto
      const backendTags = await Promise.race([
        this.getActiveTags(),
        new Promise<Tag[]>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 3000)
        ),
      ]);

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

      console.log("✅ TagService - Tags populares obtenidas del backend:", {
        predefinidas: this.popularTags.length,
        delBackend: backendTags.length,
        combinadas: popularTagsResult.length,
        tags: popularTagsResult.map((t) => t.name),
      });

      return popularTagsResult;
    } catch (error) {
      console.warn(
        "⚠️ TagService - Backend no disponible, usando fallback:",
        error instanceof Error ? error.message : String(error)
      );

      // Fallback: crear tags virtuales con las predefinidas
      const fallbackTags: Tag[] = this.popularTags
        .slice(0, 10)
        .map((name, index) => ({
          id: -(index + 1), // IDs negativos para tags virtuales
          name,
          archived: false,
        }));

      console.log(
        "✅ TagService - Tags predefinidas cargadas (modo offline):",
        fallbackTags.map((t) => t.name)
      );
      return fallbackTags;
    }
  }

  /**
   * Crear una nueva tag
   */
  async createTag(tagData: TagDTO): Promise<Tag> {
    try {
      console.log(
        "🏷️ TagService - Creando nueva tag en:",
        this.baseUrl,
        tagData
      );

      const response = await axios.post(this.baseUrl, tagData, {
        headers: getAuthHeaders(),
      });

      console.log("✅ TagService - Tag creada exitosamente:", {
        endpoint: this.baseUrl,
        tagCreada: response.data,
        status: response.status,
      });

      return response.data;
    } catch (error) {
      console.error(
        "❌ TagService - Error creando tag en:",
        this.baseUrl,
        error
      );
      throw error;
    }
  }

  /**
   * Buscar tag por nombre
   */
  async findTagByName(name: string): Promise<Tag | null> {
    try {
      console.log("🔍 TagService - Buscando tag por nombre:", name);

      // Intentar obtener tags del backend con timeout
      const allTags = await Promise.race([
        this.getAllTags(),
        new Promise<Tag[]>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout buscando tags")), 2000)
        ),
      ]);

      const tag = allTags.find(
        (tag) => tag.name.toLowerCase() === name.toLowerCase()
      );

      console.log("🔍 TagService - Resultado búsqueda:", {
        nombre: name,
        encontrada: !!tag,
        tag: tag,
      });

      return tag || null;
    } catch (error) {
      console.warn(
        "⚠️ TagService - Error buscando tag, backend no disponible:",
        {
          name,
          error: error instanceof Error ? error.message : String(error),
        }
      );

      // Si hay error, verificar en las tags predefinidas localmente
      const predefinedTag = this.popularTags.find(
        (tagName) => tagName.toLowerCase() === name.toLowerCase()
      );

      if (predefinedTag) {
        const virtualTag: Tag = {
          id: -Math.floor(Math.random() * 1000),
          name: predefinedTag,
          archived: false,
        };
        console.log("✅ TagService - Tag predefinida encontrada:", virtualTag);
        return virtualTag;
      }

      return null;
    }
  }

  /**
   * Obtener o crear tag por nombre
   */
  async getOrCreateTag(name: string): Promise<Tag> {
    try {
      console.log("🔍 TagService - Intentando obtener/crear tag:", name);

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
      console.warn("⚠️ TagService - Error con backend, creando tag virtual:", {
        name,
        error: error instanceof Error ? error.message : String(error),
      });

      // Fallback: crear tag virtual con ID negativo
      const virtualTag: Tag = {
        id: -Math.floor(Math.random() * 10000), // ID negativo aleatorio
        name: name.trim(),
        archived: false,
      };

      console.log("✅ TagService - Tag virtual creada:", virtualTag);
      return virtualTag;
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
