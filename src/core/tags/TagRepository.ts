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
  createTag(request: ICreateTagRequest): Promise<ICreateTagResponse>;
  addTagToPost(postId: number, tagName: string): Promise<void>;
  removeTagFromPost(postId: number, tagName: string): Promise<void>;
  archiveTag(tagId: number, archived: boolean): Promise<ITag>;

  // Métodos de reemplazo masivo
  replaceTagsInPost(
    postId: number,
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
      const response = await axios.get(
        `${this.privateEventTagsUrl}/${encodeURIComponent(tagName)}`
      );
      return response.data || [];
    } catch (error) {
      throw error;
    }
  }

  async getTagsByEvent(eventId: number): Promise<ITag[]> {
    try {
      const response = await axios.get(this.getEventTagsUrl(eventId));
      return response.data || [];
    } catch (error) {
      throw error;
    }
  }

  async getTagsByPost(postId: number): Promise<ITag[]> {
    try {
      const response = await axios.get(this.getPostTagsUrl(postId));
      return response.data || [];
    } catch (error) {
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
      const response = await axios.post(
        this.getPostTagsUrl(postId),
        { tags },
        { headers }
      );
    } catch (error) {
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
      await axios.delete(this.getPostTagsUrl(postId), {
        headers,
      });
    } catch (error) {
      throw error;
    }
  }

  async replaceTagsInPost(
    postId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void> {
    try {
      await this.clearTagsFromPost(postId);
      await this.addTagsToPost(postId, tags);
    } catch (error) {
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
