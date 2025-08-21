import { ITag } from "@/core/tags/ITag";
import TagService from "@/core/tags/TagService";

export function useTagsUpload() {
  const apiTag = new TagService();

  /**
   * Sube las tags asociadas a un evento (batch).
   * TODO: si una de las tags falla, no sube las dem s
   */
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
        throw new Error("El id del evento debe ser un n mero mayor a 0");
      }

      if (!Array.isArray(tags)) {
        throw new Error("Las tags deben ser un array");
      }

      if (tags.some((tag) => !tag || !tag.id || !tag.name)) {
        throw new Error("Las tags deben tener id y name");
      }

      await apiTag.addTagsToEvent(eventId, tags);
    } catch (error) {
      // TODO: manejar el error de una forma m s elegante
      console.error("Error al subir tags a evento:", error);
    }
  };

  return { uploadTagsToEvent };
}
