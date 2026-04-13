import { ITag } from "@/core/tags/ITag";
import TagService from "@/core/tags/TagService";

export function useTagsUpload() {
  const apiTag = new TagService();

  // Resuelve tags con IDs negativos (creadas localmente como fallback) obteniendo/creando en backend
  const resolveTagIds = async (tags: ITag[]): Promise<ITag[]> => {
    const resolved: ITag[] = [];
    for (const tag of tags) {
      if (tag.id > 0) {
        resolved.push(tag);
      } else {
        const realTag = await apiTag.getOrCreateTag(tag.name);
        resolved.push(realTag);
      }
    }
    return resolved;
  };

  // Sube tags a evento
  const uploadTagsToEvent = async (
    eventId: number,
    tags: ITag[] | null | undefined,
  ) => {
    if (!tags || tags.length === 0) {
      console.warn(
        "No se pueden subir tags a evento porque no se pasaron tags",
      );
      return;
    }
    try {
      if (!eventId || Number.isNaN(eventId) || eventId < 1) {
        throw new TypeError("El id del evento debe ser un número mayor a 0");
      }
      if (!Array.isArray(tags)) {
        throw new TypeError("Las tags deben ser un array");
      }
      if (tags.some((tag) => !tag?.name)) {
        throw new TypeError("Las tags deben tener name");
      }
      const resolvedTags = await resolveTagIds(tags);
      await apiTag.addTagsToEvent(eventId, resolvedTags);
    } catch (error) {
      console.error("Error al subir tags a evento:", error);
    }
  };

  // Sube tags a post
  const uploadTagsToPost = async (
    postId: number,
    tags: ITag[] | null | undefined,
  ) => {
    if (!tags || tags.length === 0) {
      console.warn("No se pueden subir tags a post porque no se pasaron tags");
      return;
    }
    try {
      if (!postId || Number.isNaN(postId) || postId < 1) {
        throw new TypeError("El id del post debe ser un número mayor a 0");
      }
      if (!Array.isArray(tags)) {
        throw new TypeError("Las tags deben ser un array");
      }
      if (tags.some((tag) => !tag?.name)) {
        throw new TypeError("Las tags deben tener name");
      }
      const resolvedTags = await resolveTagIds(tags);
      await apiTag.addTagsToPost(postId, resolvedTags);
    } catch (error) {
      console.error("Error al subir tags a post:", error);
    }
  };

  return { uploadTagsToEvent, uploadTagsToPost };
}
