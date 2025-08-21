import { ITag } from "@/core/tags/ITag";
import TagService from "@/core/tags/TagService";

export function useTagsUploadPost() {
  const apiTag = new TagService();

  /**
   * Sube las tags asociadas a un post (batch).
   * Sigue el mismo patrón que useTagsUpload para eventos
   */
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

      console.log("🏷️ useTagsUploadPost - Subiendo tags al post:", {
        postId,
        tags: tags.map((t) => ({ id: t.id, name: t.name })),
      });

      await apiTag.addTagsToPost(postId, tags);

      console.log("✅ useTagsUploadPost - Tags subidas exitosamente al post");
    } catch (error) {
      console.error(
        "❌ useTagsUploadPost - Error al subir tags a post:",
        error
      );
      throw error;
    }
  };

  return { uploadTagsToPost };
}
