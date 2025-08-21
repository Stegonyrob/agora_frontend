import { getAuthHeaders } from "@/core/auth/AuthHeaders";
import axios from "axios";
import { ICreateTagRequest, ICreateTagResponse } from "./ICreateTagRequest";
import { ITag } from "./ITag";

export interface ITagRepository {
  // Endpoints públicos
  getAllTags(): Promise<ITag[]>;
  getEventsByTag(tagName: string): Promise<any[]>;
  getTagsByEvent(eventId: number): Promise<ITag[]>;

  // Endpoints privados (requieren autenticación)
  getPostsByTag(tagName: string): Promise<any[]>;
  getTagsByPost(postId: number): Promise<ITag[]>;
  createTag(request: ICreateTagRequest): Promise<ICreateTagResponse>;
  addTagToEvent(eventId: number, tagName: string): Promise<void>;
  addTagToPost(postId: number, tagName: string): Promise<void>;
  removeTagFromEvent(eventId: number, tagName: string): Promise<void>;
  removeTagFromPost(postId: number, tagName: string): Promise<void>;
  archiveTag(tagId: number, archived: boolean): Promise<ITag>;

  // Métodos de reemplazo masivo
  replaceTagsInPost(
    postId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void>;
}

class TagRepository implements ITagRepository {
  /**
   * Asocia varias tags a un evento usando el endpoint batch.
   * POST /api/v1/any/tags/events/{eventId}/tags
   */
  async addTagsToEvent(
    eventId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void> {
    try {
      console.log("🏷️ TagRepository - Asociando varias tags al evento:", {
        eventId,
        tags,
      });
      const headers = getAuthHeaders();
      // El endpoint espera { tags: [...] }
      const url = `${this.eventTagsUrl}/events/${eventId}/tags`;
      await axios.post(url, { tags }, { headers });
      console.log("✅ TagRepository - Tags asociadas al evento exitosamente");
    } catch (error) {
      console.error(
        "❌ TagRepository - Error al asociar tags al evento:",
        error
      );
      throw error;
    }
  }

  /**
   * Asocia varias tags a un post usando el endpoint batch.
   * POST /api/v1/any/tags/posts/{postId}/tags
   */
  async addTagsToPost(
    postId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void> {
    try {
      console.log("🏷️ TagRepository - Asociando varias tags al post:", {
        postId,
        tags,
      });
      const headers = getAuthHeaders();
      // El endpoint espera { tags: [...] }
      const url = `${this.eventTagsUrl}/posts/${postId}/tags`;
      await axios.post(url, { tags }, { headers });
      console.log("✅ TagRepository - Tags asociadas al post exitosamente");
    } catch (error) {
      console.error("❌ TagRepository - Error al asociar tags al post:", error);
      throw error;
    }
  }
  // URLs específicas para cada endpoint según las variables de entorno
  private readonly publicTagsUrl = import.meta.env
    .VITE_API_ENDPOINT_TAGS_BY_EVENT_PUBLIC;
  private readonly privateEventTagsUrl = import.meta.env
    .VITE_API_ENDPOINT_TAGS_BY_EVENT_PRIVATE;
  private readonly postTagsUrl = import.meta.env.VITE_API_ENDPOINT_TAGS_POST;
  private readonly tagsUrl = import.meta.env.VITE_API_ENDPOINT_TAGS;
  private readonly eventTagsUrl = import.meta.env.VITE_API_ENDPOINT_EVENT_TAGS;

  // Endpoints públicos (no requieren autenticación)
  async getAllTags(): Promise<ITag[]> {
    try {
      const response = await axios.get(this.publicTagsUrl);
      return response.data || [];
    } catch (error) {
      throw error;
    }
  }

  async getEventsByTag(tagName: string): Promise<any[]> {
    try {
      console.log("🏷️ TagRepository - Obteniendo eventos por tag:", tagName);
      // Usar la URL específica para eventos por tag (pública)
      const url = this.privateEventTagsUrl.replace(
        "{tagName}",
        encodeURIComponent(tagName)
      );
      const response = await axios.get(url);

      console.log("✅ TagRepository - Eventos obtenidos por tag:", {
        tag: tagName,
        cantidad: response.data?.length || 0,
      });

      return response.data || [];
    } catch (error) {
      console.error(
        "❌ TagRepository - Error al obtener eventos por tag:",
        error
      );
      throw error;
    }
  }

  async getTagsByEvent(eventId: number): Promise<ITag[]> {
    try {
      console.log("🏷️ TagRepository - Obteniendo tags del evento:", eventId);
      const response = await axios.get(`${this.eventTagsUrl}/${eventId}/tags`);

      console.log("✅ TagRepository - Tags del evento obtenidas:", {
        eventId,
        cantidad: response.data?.length || 0,
        tags: response.data,
      });

      return response.data || [];
    } catch (error: any) {
      console.error(
        "❌ TagRepository - Error al obtener tags del evento:",
        error
      );
      // Si no encuentra tags, retornar array vacío en lugar de fallar
      if (error.response?.status === 404) {
        console.warn(
          `⚠️ TagRepository - No se encontraron tags para el evento ${eventId}`
        );
        return [];
      }
      throw error;
    }
  }

  // Endpoints privados (requieren autenticación)
  async getPostsByTag(tagName: string): Promise<any[]> {
    try {
      console.log("🏷️ TagRepository - Obteniendo posts por tag:", tagName);
      const headers = getAuthHeaders();
      const response = await axios.get(
        `${this.postTagsUrl}/${encodeURIComponent(tagName)}`,
        { headers }
      );

      console.log("✅ TagRepository - Posts obtenidos por tag:", {
        tag: tagName,
        cantidad: response.data?.length || 0,
      });

      return response.data || [];
    } catch (error) {
      console.error(
        "❌ TagRepository - Error al obtener posts por tag:",
        error
      );
      throw error;
    }
  }

  async getTagsByPost(postId: number): Promise<ITag[]> {
    try {
      console.log("🏷️ TagRepository - Obteniendo tags del post:", postId);
      const headers = getAuthHeaders();
      const response = await axios.get(
        `${this.eventTagsUrl}/posts/${postId}/tags`,
        {
          headers,
        }
      );

      console.log("✅ TagRepository - Tags del post obtenidas:", {
        postId,
        cantidad: response.data?.length || 0,
        tags: response.data,
      });

      return response.data || [];
    } catch (error: any) {
      console.error(
        "❌ TagRepository - Error al obtener tags del post:",
        error
      );
      // Si no encuentra tags, retornar array vacío en lugar de fallar
      if (error.response?.status === 404) {
        console.warn(
          `⚠️ TagRepository - No se encontraron tags para el post ${postId}`
        );
        return [];
      }
      throw error;
    }
  }

  async createTag(request: ICreateTagRequest): Promise<ICreateTagResponse> {
    try {
      console.log("🏷️ TagRepository - Creando tag:", request);
      const headers = getAuthHeaders();
      const response = await axios.post(this.tagsUrl, request, { headers });

      console.log("✅ TagRepository - Tag creado:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ TagRepository - Error al crear tag:", error);
      throw error;
    }
  }

  async addTagToEvent(eventId: number, tagName: string): Promise<void> {
    try {
      console.log("🏷️ TagRepository - Añadiendo tag a evento:", {
        eventId,
        tagName,
      });
      const headers = getAuthHeaders();
      await axios.post(
        `${this.eventTagsUrl}/${eventId}/tags/${encodeURIComponent(tagName)}`,
        {},
        { headers }
      );

      console.log("✅ TagRepository - Tag añadido a evento exitosamente");
    } catch (error) {
      console.error("❌ TagRepository - Error al añadir tag a evento:", error);
      throw error;
    }
  }

  async addTagToPost(postId: number, tagName: string): Promise<void> {
    try {
      console.log("🏷️ TagRepository - Añadiendo tag a post:", {
        postId,
        tagName,
      });
      const headers = getAuthHeaders();
      await axios.post(
        `${this.eventTagsUrl}/posts/${postId}/tags/${encodeURIComponent(
          tagName
        )}`,
        {},
        { headers }
      );

      console.log("✅ TagRepository - Tag añadido a post exitosamente");
    } catch (error) {
      console.error("❌ TagRepository - Error al añadir tag a post:", error);
      throw error;
    }
  }

  async removeTagFromEvent(eventId: number, tagName: string): Promise<void> {
    try {
      console.log("🏷️ TagRepository - Eliminando tag de evento:", {
        eventId,
        tagName,
      });
      const headers = getAuthHeaders();
      await axios.delete(
        `${this.eventTagsUrl}/${eventId}/tags/${encodeURIComponent(tagName)}`,
        { headers }
      );

      console.log("✅ TagRepository - Tag eliminado de evento exitosamente");
    } catch (error) {
      console.error(
        "❌ TagRepository - Error al eliminar tag de evento:",
        error
      );
      throw error;
    }
  }

  async removeTagFromPost(postId: number, tagName: string): Promise<void> {
    try {
      console.log("🏷️ TagRepository - Eliminando tag de post:", {
        postId,
        tagName,
      });
      const headers = getAuthHeaders();
      await axios.delete(
        `${this.eventTagsUrl}/posts/${postId}/tags/${encodeURIComponent(
          tagName
        )}`,
        { headers }
      );

      console.log("✅ TagRepository - Tag eliminado de post exitosamente");
    } catch (error) {
      console.error("❌ TagRepository - Error al eliminar tag de post:", error);
      throw error;
    }
  }

  /**
   * Elimina todas las tags asociadas a un post.
   * POST /api/v1/any/tags/posts/{postId}/tags/clear
   */
  async clearTagsFromPost(postId: number): Promise<void> {
    try {
      console.log(
        "🏷️ TagRepository - Limpiando todas las tags del post:",
        postId
      );
      const headers = getAuthHeaders();
      await axios.delete(`${this.eventTagsUrl}/posts/${postId}/tags`, {
        headers,
      });
      console.log("✅ TagRepository - Tags del post limpiadas exitosamente");
    } catch (error) {
      console.error(
        "❌ TagRepository - Error al limpiar tags del post:",
        error
      );
      throw error;
    }
  }

  /**
   * Reemplaza completamente las tags de un post.
   * Usa un enfoque optimista: intenta agregar directamente las nuevas tags.
   * Solo elimina tags existentes si la operación directa falla.
   */
  async replaceTagsInPost(
    postId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void> {
    try {
      console.log("🏷️ TagRepository - Reemplazando tags del post:", {
        postId,
        newTagsCount: tags.length,
        tags,
      });

      // Estrategia optimista: Intentar agregar las nuevas tags directamente
      if (tags.length > 0) {
        try {
          await this.addTagsToPost(postId, tags);
          console.log(
            "✅ TagRepository - Tags agregadas exitosamente (modo optimista)"
          );
          return;
        } catch (addError: any) {
          // Solo si falla la adición directa, intentamos limpiar primero
          console.warn(
            "⚠️ TagRepository - Adición directa falló, limpiando tags existentes primero:",
            addError?.response?.status || addError.message
          );
        }
      }

      // Estrategia 1: Intentar limpiar todas las tags existentes con el endpoint específico
      let clearSuccessful = false;
      try {
        await this.clearTagsFromPost(postId);
        clearSuccessful = true;
        console.log(
          "✅ TagRepository - Tags existentes limpiadas con endpoint específico"
        );
      } catch (clearError: any) {
        console.warn(
          "⚠️ TagRepository - Endpoint de limpieza falló (esto es normal si el servidor no lo soporta):",
          clearError?.response?.status || clearError.message
        );

        // Estrategia 2: Solo intentar eliminación individual si tenemos tags y clearTag falló
        if (tags.length > 0) {
          try {
            const currentTags = await this.getTagsByPost(postId);
            if (currentTags.length > 0) {
              console.log(
                "📋 TagRepository - Eliminando tags actuales una por una:",
                currentTags.length
              );

              for (const tag of currentTags) {
                try {
                  await this.removeTagFromPost(postId, tag.name);
                  console.log(`✅ TagRepository - Tag eliminada: ${tag.name}`);
                } catch (removeError) {
                  console.warn(
                    `⚠️ TagRepository - No se pudo eliminar tag ${tag.name}:`,
                    removeError
                  );
                }
              }
              clearSuccessful = true;
            }
          } catch (getTagsError: any) {
            console.warn(
              "⚠️ TagRepository - No se pudieron obtener tags actuales (esto es normal):",
              getTagsError?.response?.status || getTagsError.message
            );
            // Continuamos sin limpiar, las nuevas tags se agregarán de todas formas
          }
        }
      }

      // Agregar las nuevas tags (solo si no se agregaron en el modo optimista)
      if (tags.length > 0) {
        await this.addTagsToPost(postId, tags);
        console.log("✅ TagRepository - Nuevas tags agregadas exitosamente");
      } else if (clearSuccessful) {
        console.log(
          "✅ TagRepository - Tags del post limpiadas (sin nuevas tags para agregar)"
        );
      }

      console.log("✅ TagRepository - Tags del post reemplazadas exitosamente");
    } catch (error) {
      console.error(
        "❌ TagRepository - Error al reemplazar tags del post:",
        error
      );
      throw error;
    }
  }

  async archiveTag(tagId: number, archived: boolean): Promise<ITag> {
    try {
      console.log("🏷️ TagRepository - Archivando tag:", { tagId, archived });
      const headers = getAuthHeaders();
      const response = await axios.patch(
        `${this.tagsUrl}/${tagId}/archive`,
        { archived },
        { headers }
      );

      console.log(
        "✅ TagRepository - Tag archivada exitosamente:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error("❌ TagRepository - Error al archivar tag:", error);
      throw error;
    }
  }
}

export default TagRepository;
