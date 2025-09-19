import { getAuthHeaders } from "@/core/auth/AuthHeaders";
import axios from "axios";
import { ICreateTagRequest, ICreateTagResponse } from "./ICreateTagRequest";
import { ITag } from "./ITag";

export interface ITagRepository {
  // Endpoints públicos
  getAllTags(): Promise<ITag[]>;

  // Endpoints privados (requieren autenticación)
  getPostsByTag(tagName: string): Promise<any[]>;
  getTagsByPost(postId: number): Promise<ITag[]>;
  getTagsByEvent(eventId: number): Promise<ITag[]>;
  createTag(request: ICreateTagRequest): Promise<ICreateTagResponse>;
  addTagToPost(postId: number, tagName: string): Promise<void>;
  removeTagFromPost(postId: number, tagName: string): Promise<void>;
  removeTagFromEvent(eventId: number, tagName: string): Promise<void>;
  archiveTag(tagId: number, archived: boolean): Promise<ITag>;

  // Métodos de reemplazo masivo para posts
  replaceTagsInPost(
    postId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void>;
  clearTagsFromPost(postId: number): Promise<void>;
  addTagsToPost(
    postId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void>;

  // Métodos de reemplazo masivo para eventos
  replaceTagsInEvent(
    eventId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void>;
  clearTagsFromEvent(eventId: number): Promise<void>;
  addTagsToEvent(
    eventId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void>;
}

class TagRepository implements ITagRepository {
  getPostsByTag(tagName: string): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  addTagToPost(postId: number, tagName: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  private readonly publicTagsUrl = import.meta.env
    .VITE_API_ENDPOINT_TAGS_BY_EVENT_PUBLIC;
  private readonly privateEventTagsUrl = import.meta.env
    .VITE_API_ENDPOINT_TAGS_BY_EVENT_PRIVATE;
  private readonly postTagsUrl = import.meta.env.VITE_API_ENDPOINT_POST_TAGS;
  private readonly tagsUrl = import.meta.env.VITE_API_ENDPOINT_TAGS;
  private readonly eventTagsUrl = import.meta.env.VITE_API_ENDPOINT_EVENT_TAGS;

  // 🔧 Helper para construir URLs correctas usando variables de entorno con fallback
  // URL pattern: /api/v1/any/tags/events/{eventId}/tags
  private getEventTagsUrl(eventId: number): string {
    const baseUrl =
      this.eventTagsUrl ||
      `${import.meta.env.VITE_API_ENDPOINT_GENERAL}/any/tags`;
    return `${baseUrl}/events/${eventId}/tags`;
  }

  private getPostTagsUrl(postId: number): string {
    const baseUrl =
      this.postTagsUrl ||
      `${import.meta.env.VITE_API_ENDPOINT_GENERAL}/any/tags`;
    return `${baseUrl}/posts/${postId}/tags`;
  }

  // URL pattern: /api/v1/any/tags/events/{eventId}/tags/{tagName}
  private getEventTagRemoveUrl(eventId: number, tagName: string): string {
    const baseUrl =
      this.eventTagsUrl ||
      `${import.meta.env.VITE_API_ENDPOINT_GENERAL}/any/tags`;
    return `${baseUrl}/events/${eventId}/tags/${encodeURIComponent(tagName)}`;
  }

  private getPostTagRemoveUrl(postId: number, tagName: string): string {
    const baseUrl =
      this.postTagsUrl ||
      `${import.meta.env.VITE_API_ENDPOINT_GENERAL}/any/tags`;
    return `${baseUrl}/posts/${postId}/tags/${encodeURIComponent(tagName)}`;
  }

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
      const headers = getAuthHeaders();
      const response = await axios.get(
        `${this.privateEventTagsUrl}/${encodeURIComponent(tagName)}`,
        { headers }
      );
      return response.data || [];
    } catch (error) {
      throw error;
    }
  }

  async getTagsByEvent(eventId: number): Promise<ITag[]> {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(this.getEventTagsUrl(eventId), {
        headers,
      });
      return response.data || [];
    } catch (error) {
      throw error;
    }
  }

  async getTagsByPost(postId: number): Promise<ITag[]> {
    try {
      const headers = getAuthHeaders();
      const url = this.getPostTagsUrl(postId);
      const timestamp = new Date().toISOString();

      console.log(`🚀🚀🚀 [TagRepository] GET TAGS POST ${postId}`);
      console.log(`⏰ Timestamp: ${timestamp}`);
      console.log(`📍 URL: ${url}`);
      console.log(`🔐 Headers:`, headers);

      // Logging de contexto de llamada
      const stackTrace = new Error().stack;
      const callerInfo = stackTrace?.split("\n")[2]?.trim() || "Unknown caller";
      console.log(`📞 Called from: ${callerInfo}`);

      const response = await axios.get(url, { headers });

      console.log(`📥📥📥 [TagRepository] RESPUESTA BACKEND POST ${postId}:`);
      console.log(`   ⏰ Response time: ${new Date().toISOString()}`);
      console.log(`   📊 Status: ${response.status}`);
      console.log(`   📊 Status Text: ${response.statusText}`);
      console.log(`   📦 Data:`, response.data);
      console.log(`   📋 Data type:`, typeof response.data);
      console.log(
        `   📏 Data length:`,
        Array.isArray(response.data) ? response.data.length : "No es array"
      );
      console.log(`   🔍 Response headers:`, response.headers);

      const result = response.data || [];

      if (Array.isArray(result) && result.length === 0) {
        console.error(
          `❌❌❌ [TagRepository] BACKEND DEVOLVIÓ ARRAY VACÍO PARA POST ${postId}`
        );
        console.error(`❌ Timestamp: ${timestamp}`);
        console.error(`❌ URL utilizada: ${url}`);
        console.error(`❌ Headers enviados:`, headers);
        console.error(`❌ Response completa:`, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
        });
        console.error(
          `❌ Esto indica un problema en el BACKEND, no en el frontend`
        );
      } else if (Array.isArray(result) && result.length > 0) {
        console.log(
          `✅✅✅ [TagRepository] BACKEND DEVOLVIÓ ${result.length} TAGS PARA POST ${postId}`
        );
        console.log(
          `✅ Tags recibidos:`,
          result.map((tag) => ({ id: tag.id, name: tag.name }))
        );
      }

      return result;
    } catch (error: any) {
      console.error(`💥💥💥 [TagRepository] ERROR GET POST ${postId}:`, error);
      if (error.response) {
        console.error(`💥 Response status: ${error.response.status}`);
        console.error(`💥 Response data:`, error.response.data);
        console.error(`💥 Response headers:`, error.response.headers);
      }
      throw error;
    }
  }

  async createTag(request: ICreateTagRequest): Promise<ICreateTagResponse> {
    try {
      const headers = getAuthHeaders();
      const response = await axios.post(this.tagsUrl, request, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addTagsToEvent(
    eventId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void> {
    try {
      const headers = getAuthHeaders();
      const response = await axios.post(
        this.getEventTagsUrl(eventId),
        { tags },
        { headers }
      );
    } catch (error) {
      throw error;
    }
  }

  async addTagsToPost(
    postId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void> {
    try {
      const headers = getAuthHeaders();
      const url = this.getPostTagsUrl(postId);
      const payload = { tags };
      const timestamp = new Date().toISOString();

      console.log(`➕➕➕ [TagRepository] AGREGANDO TAGS POST ${postId}`);
      console.log(`⏰ Timestamp: ${timestamp}`);
      console.log(`📍 POST URL: ${url}`);
      console.log(`📦 Payload:`, payload);
      console.log(`📋 Tags count: ${tags.length}`);
      console.log(
        `🏷️ Tags details:`,
        tags.map((t) => ({ id: t.id, name: t.name }))
      );
      console.log(`🔐 Headers:`, headers);

      if (tags.length === 0) {
        console.warn(
          `⚠️⚠️⚠️ [TagRepository] AGREGANDO ARRAY VACÍO A POST ${postId} - ¿Es esto intencional?`
        );
      }

      const response = await axios.post(url, payload, { headers });

      console.log(
        `✅ [TagRepository] Tags agregadas exitosamente POST ${postId}`
      );
      console.log(`📊 Response status: ${response.status}`);
      console.log(`📊 Response data:`, response.data);
    } catch (error: any) {
      console.error(
        `💥 [TagRepository] ERROR AGREGANDO TAGS POST ${postId}:`,
        error
      );
      if (error.response) {
        console.error(`💥 Add Error Response status: ${error.response.status}`);
        console.error(`💥 Add Error Response data:`, error.response.data);
      }
      throw error;
    }
  }

  async removeTagFromEvent(eventId: number, tagName: string): Promise<void> {
    try {
      const headers = getAuthHeaders();
      await axios.delete(this.getEventTagRemoveUrl(eventId, tagName), {
        headers,
      });
    } catch (error) {
      throw error;
    }
  }

  async removeTagFromPost(postId: number, tagName: string): Promise<void> {
    try {
      const headers = getAuthHeaders();
      await axios.delete(this.getPostTagRemoveUrl(postId, tagName), {
        headers,
      });
    } catch (error) {
      throw error;
    }
  }

  async clearTagsFromPost(postId: number): Promise<void> {
    try {
      const headers = getAuthHeaders();
      const url = this.getPostTagsUrl(postId);
      const timestamp = new Date().toISOString();

      console.log(
        `🗑️🗑️🗑️ [TagRepository] LIMPIANDO TODAS LAS TAGS POST ${postId}`
      );
      console.log(`⏰ Timestamp: ${timestamp}`);
      console.log(`📍 DELETE URL: ${url}`);
      console.log(`🔐 Headers:`, headers);

      const response = await axios.delete(url, { headers });

      console.log(
        `✅ [TagRepository] Tags eliminadas exitosamente POST ${postId}`
      );
      console.log(`📊 Response status: ${response.status}`);
      console.log(`📊 Response data:`, response.data);
    } catch (error: any) {
      console.error(
        `💥 [TagRepository] ERROR LIMPIANDO TAGS POST ${postId}:`,
        error
      );
      if (error.response) {
        console.error(
          `💥 Clear Error Response status: ${error.response.status}`
        );
        console.error(`💥 Clear Error Response data:`, error.response.data);
      }
      throw error;
    }
  }

  async replaceTagsInPost(
    postId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void> {
    try {
      const timestamp = new Date().toISOString();

      console.log(`🔄🔄🔄 [TagRepository] REEMPLAZANDO TAGS POST ${postId}`);
      console.log(`⏰ Timestamp: ${timestamp}`);
      console.log(`📊 Operación: CLEAR + ADD`);
      console.log(
        `🏷️ Tags a establecer (${tags.length}):`,
        tags.map((t) => ({ id: t.id, name: t.name }))
      );

      console.log(`🗑️ PASO 1: Limpiando tags existentes...`);
      await this.clearTagsFromPost(postId);

      console.log(`➕ PASO 2: Agregando nuevas tags...`);
      await this.addTagsToPost(postId, tags);

      console.log(`✅✅✅ [TagRepository] REEMPLAZO COMPLETADO POST ${postId}`);
      console.log(`⏰ Completado en: ${new Date().toISOString()}`);

      // Verificación inmediata para debugging
      console.log(
        `🔍 VERIFICACIÓN: Consultando tags inmediatamente después del reemplazo...`
      );
      const verificationTags = await this.getTagsByPost(postId);
      console.log(
        `🔍 VERIFICACIÓN: Tags encontrados después del reemplazo:`,
        verificationTags
      );
    } catch (error: any) {
      console.error(
        `💥💥💥 [TagRepository] ERROR REEMPLAZANDO TAGS POST ${postId}:`,
        error
      );
      if (error.response) {
        console.error(
          `💥 Replace Error Response status: ${error.response.status}`
        );
        console.error(`💥 Replace Error Response data:`, error.response.data);
      }
      throw error;
    }
  }

  async clearTagsFromEvent(eventId: number): Promise<void> {
    try {
      const headers = getAuthHeaders();
      const url = this.getEventTagsUrl(eventId);
      const timestamp = new Date().toISOString();

      console.log(
        `🗑️🗑️🗑️ [TagRepository] LIMPIANDO TODAS LAS TAGS EVENT ${eventId}`
      );
      console.log(`⏰ Timestamp: ${timestamp}`);
      console.log(`📍 DELETE URL: ${url}`);
      console.log(`🔐 Headers:`, headers);

      const response = await axios.delete(url, { headers });

      console.log(
        `✅ [TagRepository] Tags eliminadas exitosamente EVENT ${eventId}`
      );
      console.log(`📊 Response status: ${response.status}`);
      console.log(`📊 Response data:`, response.data);
    } catch (error: any) {
      console.error(
        `💥 [TagRepository] ERROR LIMPIANDO TAGS EVENT ${eventId}:`,
        error
      );
      if (error.response) {
        console.error(
          `💥 Clear Error Response status: ${error.response.status}`
        );
        console.error(`💥 Clear Error Response data:`, error.response.data);
      }
      throw error;
    }
  }

  async replaceTagsInEvent(
    eventId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void> {
    try {
      const timestamp = new Date().toISOString();

      console.log(`🔄🔄🔄 [TagRepository] REEMPLAZANDO TAGS EVENT ${eventId}`);
      console.log(`⏰ Timestamp: ${timestamp}`);
      console.log(`📊 Operación: CLEAR + ADD`);
      console.log(
        `🏷️ Tags a establecer (${tags.length}):`,
        tags.map((t) => ({ id: t.id, name: t.name }))
      );

      console.log(`🗑️ PASO 1: Limpiando tags existentes...`);
      await this.clearTagsFromEvent(eventId);

      console.log(`➕ PASO 2: Agregando nuevas tags...`);
      await this.addTagsToEvent(eventId, tags);

      console.log(
        `✅✅✅ [TagRepository] REEMPLAZO COMPLETADO EVENT ${eventId}`
      );
      console.log(`⏰ Completado en: ${new Date().toISOString()}`);

      // Verificación inmediata para debugging
      console.log(
        `🔍 VERIFICACIÓN: Consultando tags inmediatamente después del reemplazo...`
      );
      const verificationTags = await this.getTagsByEvent(eventId);
      console.log(
        `🔍 VERIFICACIÓN: Tags encontrados después del reemplazo:`,
        verificationTags
      );
    } catch (error: any) {
      console.error(
        `💥💥💥 [TagRepository] ERROR REEMPLAZANDO TAGS EVENT ${eventId}:`,
        error
      );
      if (error.response) {
        console.error(
          `💥 Replace Error Response status: ${error.response.status}`
        );
        console.error(`💥 Replace Error Response data:`, error.response.data);
      }
      throw error;
    }
  }

  async archiveTag(tagId: number, archived: boolean): Promise<ITag> {
    try {
      const headers = getAuthHeaders();
      const response = await axios.patch(
        `${this.tagsUrl}/${tagId}/archive`,
        { archived },
        { headers }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default TagRepository;
