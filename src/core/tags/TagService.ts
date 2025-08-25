import { ITag } from "./ITag";
import { ITagDTO } from "./ITagDTO";
import TagRepository from "./TagRepository";

class TagService {
  /**
   * Asocia varias tags a un evento usando el endpoint batch.
   */
  async addTagsToEvent(
    eventId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void> {
    return this.tagRepository.addTagsToEvent(eventId, tags);
  }

  /**
   * Asocia varias tags a un post usando el endpoint batch.
   */
  async addTagsToPost(
    postId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void> {
    return this.tagRepository.addTagsToPost(postId, tags);
  }
  private tagRepository: TagRepository;

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

  async getAllTags(): Promise<ITag[]> {
    return await this.tagRepository.getAllTags();
  }

  async getActiveTags(): Promise<ITag[]> {
    const allTags = await this.getAllTags();
    return allTags.filter((tag) => !tag.archived);
  }

  async getPopularTags(): Promise<ITag[]> {
    try {
      const backendTags = await Promise.race([
        this.getActiveTags(),
        new Promise<ITag[]>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 3000)
        ),
      ]);

      const backendTagsMap = new Map<string, ITag>();
      backendTags.forEach((tag) => {
        backendTagsMap.set(tag.name.toLowerCase(), tag);
      });

      const popularTagsResult: ITag[] = [];

      this.popularTags.forEach((tagName) => {
        const existingTag = backendTagsMap.get(tagName.toLowerCase());
        if (existingTag) {
          popularTagsResult.push(existingTag);
          backendTagsMap.delete(tagName.toLowerCase());
        }
      });

      const remainingBackendTags = Array.from(backendTagsMap.values());
      popularTagsResult.push(
        ...remainingBackendTags.slice(0, 15 - popularTagsResult.length)
      );

      return popularTagsResult;
    } catch (error) {
      const fallbackTags: ITag[] = this.popularTags
        .slice(0, 10)
        .map((name, index) => ({
          id: -(index + 1),
          name,
          archived: false,
        }));
      return fallbackTags;
    }
  }

  async createTag(tagData: ITagDTO): Promise<ITag> {
    const createRequest = {
      name: tagData.name,
      archived: tagData.archived || false,
    };

    return await this.tagRepository.createTag(createRequest);
  }

  async findTagByName(name: string): Promise<ITag | null> {
    try {
      const allTags = await Promise.race([
        this.getAllTags(),
        new Promise<ITag[]>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout buscando tags")), 2000)
        ),
      ]);

      const tag = allTags.find(
        (tag) => tag.name.toLowerCase() === name.toLowerCase()
      );

      return tag || null;
    } catch (error) {
      const predefinedTag = this.popularTags.find(
        (tagName) => tagName.toLowerCase() === name.toLowerCase()
      );

      if (predefinedTag) {
        const virtualTag: ITag = {
          id: -Math.floor(Math.random() * 1000),
          name: predefinedTag,
          archived: false,
        };
        return virtualTag;
      }

      return null;
    }
  }

  async getOrCreateTag(name: string): Promise<ITag> {
    let tag = await this.findTagByName(name);

    if (tag) {
      return tag;
    }

    tag = await this.createTag({ name, archived: false });

    return tag;
  }

  async getOrCreateTags(names: string[]): Promise<ITag[]> {
    const tags: ITag[] = [];

    for (const name of names) {
      if (name.trim()) {
        const tag = await this.getOrCreateTag(name.trim());
        tags.push(tag);
      }
    }

    return tags;
  }

  async archiveTag(tagId: number, archived: boolean): Promise<ITag> {
    return await this.tagRepository.archiveTag(tagId, archived);
  }

  async getTagsByEvent(eventId: number): Promise<ITag[]> {
    return await this.tagRepository.getTagsByEvent(eventId);
  }

  async getTagsByPost(postId: number): Promise<ITag[]> {
    return await this.tagRepository.getTagsByPost(postId);
  }

  async getPostsByTag(tagName: string): Promise<any[]> {
    return await this.tagRepository.getPostsByTag(tagName);
  }

  async getEventsByTag(tagName: string): Promise<any[]> {
    return await this.tagRepository.getEventsByTag(tagName);
  }

  async addTagToEvent(eventId: number, tagName: string): Promise<void> {
    await this.tagRepository.addTagsToEvent(eventId, [
      { id: 0, name: tagName, archived: false },
    ]);
  }

  async addTagToPost(postId: number, tagName: string): Promise<void> {
    await this.tagRepository.addTagToPost(postId, tagName);
  }

  async removeTagFromEvent(eventId: number, tagName: string): Promise<void> {
    await this.tagRepository.removeTagFromEvent(eventId, tagName);
  }

  async removeTagFromPost(postId: number, tagName: string): Promise<void> {
    await this.tagRepository.removeTagFromPost(postId, tagName);
  }

  /**
   * Reemplaza completamente las tags de un post.
   * Método más eficiente que eliminar una por una y luego agregar.
   */
  async replaceTagsInPost(
    postId: number,
    tags: { id: number; name: string; archived: boolean }[]
  ): Promise<void> {
    return await this.tagRepository.replaceTagsInPost(postId, tags);
  }
}

export default TagService;
