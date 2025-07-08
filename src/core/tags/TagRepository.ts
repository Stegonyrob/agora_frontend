import { getAuthHeaders } from "@/core/auth/AuthHeaders";
import axios from "axios";
import { ICreateTagRequest, ICreateTagResponse } from "./ICreateTagRequest";
import { ITag } from "./ITag";

export interface ITagRepository {
  // Endpoints públicos
  getAllTags(): Promise<ITag[]>;
  getEventsByTag(tagName: string): Promise<any[]>;

  // Endpoints privados (requieren autenticación)
  getPostsByTag(tagName: string): Promise<any[]>;
  createTag(request: ICreateTagRequest): Promise<ICreateTagResponse>;
  addTagToEvent(eventId: number, tagName: string): Promise<void>;
  addTagToPost(postId: number, tagName: string): Promise<void>;
  removeTagFromEvent(eventId: number, tagName: string): Promise<void>;
  removeTagFromPost(postId: number, tagName: string): Promise<void>;
  archiveTag(tagId: number, archived: boolean): Promise<ITag>;
}

class TagRepository implements ITagRepository {
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
      console.log("🏷️ TagRepository - Obteniendo todos los tags...");
      const response = await axios.get(this.publicTagsUrl);

      console.log("✅ TagRepository - Tags obtenidos:", {
        cantidad: response.data?.length || 0,
        tags: response.data,
      });

      return response.data || [];
    } catch (error) {
      console.error("❌ TagRepository - Error al obtener tags:", error);
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
        `${this.postTagsUrl}/${postId}/tags/${encodeURIComponent(tagName)}`,
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
        `${this.postTagsUrl}/${postId}/tags/${encodeURIComponent(tagName)}`,
        { headers }
      );

      console.log("✅ TagRepository - Tag eliminado de post exitosamente");
    } catch (error) {
      console.error("❌ TagRepository - Error al eliminar tag de post:", error);
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
