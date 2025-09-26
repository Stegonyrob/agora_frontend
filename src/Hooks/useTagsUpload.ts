import { ITag } from "@/core/tags/ITag";
import TagService from "@/core/tags/TagService";

export function useTagsUpload() {
  const apiTag = new TagService();

  // Sube tags a evento
  const uploadTagsToEvent = async (
    eventId: number,
    tags: ITag[] | null | undefined
  ) => {
    if (!tags || tags.length === 0) {
      console.warn(
        "No se pueden subir tags a evento porque no se pasaron tags"
      );
      return;
    }
    try {
      if (!eventId || Number.isNaN(eventId) || eventId < 1) {
        throw new Error("El id del evento debe ser un número mayor a 0");
      }
      if (!Array.isArray(tags)) {
        throw new Error("Las tags deben ser un array");
      }
      if (tags.some((tag) => !tag || !tag.id || !tag.name)) {
        throw new Error("Las tags deben tener id y name");
      }
      await apiTag.addTagsToEvent(eventId, tags);
    } catch (error) {
      console.error("Error al subir tags a evento:", error);
    }
  };

  // Sube tags a post
  const uploadTagsToPost = async (
    postId: number,
    tags: ITag[] | null | undefined
  ) => {
    if (!tags || tags.length === 0) {
      console.warn("No se pueden subir tags a post porque no se pasaron tags");
      return;
    }
    try {
      if (!postId || Number.isNaN(postId) || postId < 1) {
        throw new Error("El id del post debe ser un número mayor a 0");
      }
      if (!Array.isArray(tags)) {
        throw new Error("Las tags deben ser un array");
      }
      if (tags.some((tag) => !tag || !tag.id || !tag.name)) {
        throw new Error("Las tags deben tener id y name");
      }
      await apiTag.addTagsToPost(postId, tags);
    } catch (error) {
      console.error("Error al subir tags a post:", error);
    }
  };

  return { uploadTagsToEvent, uploadTagsToPost };
}
