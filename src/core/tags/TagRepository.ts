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
    tags: { id: number; name: string; archived: boolean }[],
  ): Promise<void>;
  clearTagsFromPost(postId: number): Promise<void>;
  addTagsToPost(
    postId: number,
    tags: { id: number; name: string; archived: boolean }[],
  ): Promise<void>;

  // Métodos de reemplazo masivo para eventos
  replaceTagsInEvent(
    eventId: number,
    tags: { id: number; name: string; archived: boolean }[],
  ): Promise<void>;
  clearTagsFromEvent(eventId: number): Promise<void>;
  addTagsToEvent(
    eventId: number,
    tags: { id: number; name: string; archived: boolean }[],
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
    const headers = getAuthHeaders();
    const response = await axios.get(this.publicTagsUrl, { headers });
    return response.data || [];
  }

  async getEventsByTag(tagName: string): Promise<any[]> {
    const headers = getAuthHeaders();
    const response = await axios.get(
      `${this.privateEventTagsUrl}/${encodeURIComponent(tagName)}`,
      { headers },
    );
    return response.data || [];
  }

  async getTagsByEvent(eventId: number): Promise<ITag[]> {
    const headers = getAuthHeaders();
    const response = await axios.get(this.getEventTagsUrl(eventId), {
      headers,
    });
    return response.data || [];
  }

  async getTagsByPost(postId: number): Promise<ITag[]> {
    const headers = getAuthHeaders();
    const url = this.getPostTagsUrl(postId);
    const response = await axios.get(url, { headers });
    return response.data || [];
  }

  async createTag(request: ICreateTagRequest): Promise<ICreateTagResponse> {
    const headers = getAuthHeaders();
    const response = await axios.post(this.tagsUrl, request, { headers });
    return response.data;
  }

  async addTagsToEvent(
    eventId: number,
    tags: { id: number; name: string; archived: boolean }[],
  ): Promise<void> {
    const headers = getAuthHeaders();
    await axios.post(this.getEventTagsUrl(eventId), tags, { headers });
  }

  async addTagsToPost(
    postId: number,
    tags: { id: number; name: string; archived: boolean }[],
  ): Promise<void> {
    const headers = getAuthHeaders();
    const url = this.getPostTagsUrl(postId);
    await axios.post(url, tags, { headers });
  }

  async removeTagFromEvent(eventId: number, tagName: string): Promise<void> {
    const headers = getAuthHeaders();
    await axios.delete(this.getEventTagRemoveUrl(eventId, tagName), {
      headers,
    });
  }

  async removeTagFromPost(postId: number, tagName: string): Promise<void> {
    const headers = getAuthHeaders();
    await axios.delete(this.getPostTagRemoveUrl(postId, tagName), {
      headers,
    });
  }

  async clearTagsFromPost(postId: number): Promise<void> {
    const headers = getAuthHeaders();
    const url = this.getPostTagsUrl(postId);
    await axios.delete(url, { headers });
  }

  async replaceTagsInPost(
    postId: number,
    tags: { id: number; name: string; archived: boolean }[],
  ): Promise<void> {
    await this.clearTagsFromPost(postId);
    await this.addTagsToPost(postId, tags);
    await this.getTagsByPost(postId);
  }

  async clearTagsFromEvent(eventId: number): Promise<void> {
    const headers = getAuthHeaders();
    const url = this.getEventTagsUrl(eventId);
    await axios.delete(url, { headers });
  }

  async replaceTagsInEvent(
    eventId: number,
    tags: { id: number; name: string; archived: boolean }[],
  ): Promise<void> {
    try {
      await this.clearTagsFromEvent(eventId);
    } catch {
      // Bulk DELETE endpoint may not be available on the backend;
      // proceed so addTagsToEvent still runs.
    }
    await this.addTagsToEvent(eventId, tags);
  }

  async archiveTag(tagId: number, archived: boolean): Promise<ITag> {
    const headers = getAuthHeaders();
    const response = await axios.patch(
      `${this.tagsUrl}/${tagId}/archive`,
      { archived },
      { headers },
    );
    return response.data;
  }
}

export default TagRepository;
