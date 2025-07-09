import { ITag } from "./ITag";
import { ITagDTO } from "./ITagDTO";
import TagRepository from "./TagRepository";

class TagService {
  private tagRepository: TagRepository;

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

  constructor() {
    this.tagRepository = new TagRepository();
  }

  /**
   * Obtener todas las tags disponibles
   */
  async getAllTags(): Promise<ITag[]> {
    try {
      console.log("🏷️ TagService - Obteniendo todas las tags...");

      const tags = await this.tagRepository.getAllTags();

      console.log("✅ TagService - Tags obtenidas del backend:", {
        cantidad: tags.length,
        primerasTags: tags.slice(0, 3).map((tag) => tag.name),
      });

      return tags;
    } catch (error) {
      console.error("❌ TagService - Error obteniendo tags:", error);
      throw error;
    }
  }

  /**
   * Obtener tags activas (no archivadas)
   */
  async getActiveTags(): Promise<ITag[]> {
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
  async getPopularTags(): Promise<ITag[]> {
    try {
      console.log("🔥 TagService - Obteniendo tags populares...");

      // Intentar obtener tags del backend con timeout corto
      const backendTags = await Promise.race([
        this.getActiveTags(),
        new Promise<ITag[]>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 3000)
        ),
      ]);

      // Crear un mapa de tags existentes por nombre
      const backendTagsMap = new Map<string, ITag>();
      backendTags.forEach((tag) => {
        backendTagsMap.set(tag.name.toLowerCase(), tag);
      });

      // Combinar tags populares predefinidas con las del backend
      const popularTagsResult: ITag[] = [];

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
      const fallbackTags: ITag[] = this.popularTags
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
  async createTag(tagData: ITagDTO): Promise<ITag> {
    try {
      console.log("🏷️ TagService - Creando nueva tag:", tagData);

      const createRequest = {
        name: tagData.name,
        archived: tagData.archived || false,
      };

      const iTagResponse = await this.tagRepository.createTag(createRequest);

      console.log("✅ TagService - Tag creada exitosamente:", {
        tagCreada: iTagResponse,
      });

      return iTagResponse;
    } catch (error) {
      console.error("❌ TagService - Error creando tag:", error);
      throw error;
    }
  }

  /**
   * Buscar tag por nombre
   */
  async findTagByName(name: string): Promise<ITag | null> {
    try {
      console.log("🔍 TagService - Buscando tag por nombre:", name);

      // Intentar obtener tags del backend con timeout
      const allTags = await Promise.race([
        this.getAllTags(),
        new Promise<ITag[]>((_, reject) =>
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
        const virtualTag: ITag = {
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
  async getOrCreateTag(name: string): Promise<ITag> {
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
      const virtualTag: ITag = {
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
  async getOrCreateTags(names: string[]): Promise<ITag[]> {
    try {
      console.log("🏷️ TagService - Procesando múltiples tags:", names);

      const tags: ITag[] = [];

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
  async archiveTag(tagId: number, archived: boolean): Promise<ITag> {
    try {
      console.log("🗃️ TagService - Archivando tag:", { tagId, archived });

      const iTag = await this.tagRepository.archiveTag(tagId, archived);

      console.log("✅ TagService - Tag archivada exitosamente:", iTag);
      return iTag;
    } catch (error) {
      console.error("❌ TagService - Error archivando tag:", error);
      throw error;
    }
  }

  /**
   * Obtener tags de un evento específico
   */
  async getTagsByEvent(eventId: number): Promise<ITag[]> {
    try {
      console.log("🏷️ TagService - Obteniendo tags del evento:", eventId);
      return await this.tagRepository.getTagsByEvent(eventId);
    } catch (error) {
      console.error("❌ TagService - Error obteniendo tags del evento:", error);
      return []; // Retornar array vacío si falla
    }
  }

  /**
   * Obtener tags de un post específico
   */
  async getTagsByPost(postId: number): Promise<ITag[]> {
    try {
      console.log("🏷️ TagService - Obteniendo tags del post:", postId);
      return await this.tagRepository.getTagsByPost(postId);
    } catch (error) {
      console.error("❌ TagService - Error obteniendo tags del post:", error);
      return []; // Retornar array vacío si falla
    }
  }

  /**
   * Obtener posts por tag
   */
  async getPostsByTag(tagName: string): Promise<any[]> {
    try {
      console.log("🏷️ TagService - Obteniendo posts por tag:", tagName);
      return await this.tagRepository.getPostsByTag(tagName);
    } catch (error) {
      console.error("❌ TagService - Error obteniendo posts por tag:", error);
      throw error;
    }
  }

  /**
   * Obtener eventos por tag
   */
  async getEventsByTag(tagName: string): Promise<any[]> {
    try {
      console.log("🏷️ TagService - Obteniendo eventos por tag:", tagName);
      return await this.tagRepository.getEventsByTag(tagName);
    } catch (error) {
      console.error("❌ TagService - Error obteniendo eventos por tag:", error);
      throw error;
    }
  }

  /**
   * Añadir tag a evento
   */
  async addTagToEvent(eventId: number, tagName: string): Promise<void> {
    try {
      console.log("🏷️ TagService - Añadiendo tag a evento:", {
        eventId,
        tagName,
      });
      await this.tagRepository.addTagToEvent(eventId, tagName);
    } catch (error) {
      console.error("❌ TagService - Error añadiendo tag a evento:", error);
      throw error;
    }
  }

  /**
   * Añadir tag a post
   */
  async addTagToPost(postId: number, tagName: string): Promise<void> {
    try {
      console.log("🏷️ TagService - Añadiendo tag a post:", { postId, tagName });
      await this.tagRepository.addTagToPost(postId, tagName);
    } catch (error) {
      console.error("❌ TagService - Error añadiendo tag a post:", error);
      throw error;
    }
  }

  /**
   * Eliminar tag de evento
   */
  async removeTagFromEvent(eventId: number, tagName: string): Promise<void> {
    try {
      console.log("🏷️ TagService - Eliminando tag de evento:", {
        eventId,
        tagName,
      });
      await this.tagRepository.removeTagFromEvent(eventId, tagName);
    } catch (error) {
      console.error("❌ TagService - Error eliminando tag de evento:", error);
      throw error;
    }
  }

  /**
   * Eliminar tag de post
   */
  async removeTagFromPost(postId: number, tagName: string): Promise<void> {
    try {
      console.log("🏷️ TagService - Eliminando tag de post:", {
        postId,
        tagName,
      });
      await this.tagRepository.removeTagFromPost(postId, tagName);
    } catch (error) {
      console.error("❌ TagService - Error eliminando tag de post:", error);
      throw error;
    }
  }
}

export default TagService;
