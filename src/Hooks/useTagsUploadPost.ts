import { ITag } from "@/core/tags/ITag";
import TagService from "@/core/tags/TagService";

export function useTagsUploadPost() {
  const apiTag = new TagService();

  /**
   * Actualiza completamente las tags de un post usando el método de reemplazo optimizado.
   */
  const uploadTagsToPost = async (
    postId: number,
    newTags: ITag[] | null | undefined
  ) => {
    if (!newTags) {
      newTags = [];
    }

    try {
      if (!postId || Number.isNaN(postId) || postId < 1) {
        throw new Error("El id del post debe ser un número mayor a 0");
      }

      if (!Array.isArray(newTags)) {
        throw new Error("Las tags deben ser un array");
      }

      console.log("🏷️ useTagsUploadPost - Actualizando tags del post:", {
        postId,
        newTags: newTags.map((t) => ({ id: t.id, name: t.name })),
      });

      // Usar el método de reemplazo directo que es más eficiente
      await apiTag.replaceTagsInPost(postId, newTags);

      console.log(
        "✅ useTagsUploadPost - Actualización completa de tags exitosa"
      );
    } catch (error) {
      console.error(
        "❌ useTagsUploadPost - Error al actualizar tags del post:",
        error
      );
      throw error;
    }
  };

  return { uploadTagsToPost };
}
