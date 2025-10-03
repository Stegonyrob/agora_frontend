import { log } from "@/core/logging/LoggerService";
import { ITag } from "@/core/tags/ITag";
import TagService from "@/core/tags/TagService";

export function useTagsUploadPost() {
  const apiTag = new TagService();

  /**
   * Calcula las diferencias entre tags actuales y nuevas
   */
  const calculateTagDifferences = (
    currentTags: ITag[],
    newTags: ITag[]
  ): { toAdd: ITag[]; toRemove: ITag[]; toKeep: ITag[] } => {
    const currentIds = new Set(currentTags.map((tag) => tag.id));
    const newIds = new Set(newTags.map((tag) => tag.id));

    const toAdd = newTags.filter((tag) => !currentIds.has(tag.id));
    const toRemove = currentTags.filter((tag) => !newIds.has(tag.id));
    const toKeep = currentTags.filter((tag) => newIds.has(tag.id));

    return { toAdd, toRemove, toKeep };
  };

  /**
   * Actualiza las tags de un post de forma inteligente.
   * - Para posts nuevos: solo agrega tags
   * - Para posts existentes: calcula diferencias y aplica solo cambios necesarios
   */
  const uploadTagsToPost = async (
    postId: number,
    newTags: ITag[] | null | undefined,
    isNewPost: boolean = false
  ) => {
    if (!newTags) {
      newTags = [];
    }

    // 🚨 LOG CRÍTICO: Detectar llamadas con arrays vacíos
    if (newTags.length === 0) {
      console.error(
        "🚨 [useTagsUploadPost] ALERTA: uploadTagsToPost llamado con array vacío!"
      );
      // Post ID validation
      console.error("   📍 IsNewPost:", isNewPost);
      console.error("   📍 Stack trace:", new Error().stack);
      console.error("   📍 Tiempo:", new Date().toISOString());
    }

    try {
      if (!postId || Number.isNaN(postId) || postId < 1) {
        throw new Error("El id del post debe ser un número mayor a 0");
      }

      if (!Array.isArray(newTags)) {
        throw new Error("Las tags deben ser un array");
      }

      if (isNewPost) {
        // Para posts nuevos: solo agregar tags (no eliminar)
        log.info("useTagsUploadPost - Agregando tags a post nuevo:", {
          postId,
          newTags: newTags.map((t) => ({ id: t.id, name: t.name })),
        });

        if (newTags.length > 0) {
          await apiTag.addTagsToPost(postId, newTags);
        }

        log.info(
          "useTagsUploadPost - Tags agregadas exitosamente a post nuevo"
        );
      } else {
        // Para posts existentes: aplicar cambios diferenciales
        log.info("useTagsUploadPost - Actualizando tags en post existente:", {
          postId,
          newTags: newTags.map((t) => ({ id: t.id, name: t.name })),
        });

        // Obtener tags actuales del post
        const currentTags = await apiTag.getTagsByPost(postId);

        // 🔍 DEBUG DETALLADO
        // Processing tags
        console.log(
          "   📦 Current tags:",
          currentTags.map((t) => ({ id: t.id, name: t.name }))
        );
        console.log(
          "   🆕 New tags:",
          newTags.map((t) => ({ id: t.id, name: t.name }))
        );

        // Calcular diferencias
        const { toAdd, toRemove, toKeep } = calculateTagDifferences(
          currentTags,
          newTags
        );

        // 🔍 DEBUG DIFERENCIAS
        console.log(
          "   ➕ To ADD:",
          toAdd.map((t) => ({ id: t.id, name: t.name }))
        );
        console.log(
          "   ➖ To REMOVE:",
          toRemove.map((t) => ({ id: t.id, name: t.name }))
        );
        console.log(
          "   ✅ To KEEP:",
          toKeep.map((t) => ({ id: t.id, name: t.name }))
        );

        log.info("useTagsUploadPost - Análisis de cambios:", {
          current: currentTags.length,
          new: newTags.length,
          toAdd: toAdd.length,
          toRemove: toRemove.length,
          toKeep: toKeep.length,
        });

        // Aplicar cambios solo si es necesario
        if (toRemove.length > 0) {
          log.info(
            "useTagsUploadPost - Eliminando tags obsoletas:",
            toRemove.map((t) => ({ id: t.id, name: t.name }))
          );
          // Eliminar tags una por una usando el método disponible
          for (const tag of toRemove) {
            await apiTag.removeTagFromPost(postId, tag.name);
          }
        }

        if (toAdd.length > 0) {
          log.info(
            "useTagsUploadPost - Agregando nuevas tags:",
            toAdd.map((t) => ({ id: t.id, name: t.name }))
          );
          await apiTag.addTagsToPost(postId, toAdd);
        }

        if (toAdd.length === 0 && toRemove.length === 0) {
          log.info("useTagsUploadPost - No hay cambios necesarios en las tags");
        }

        log.info(
          "useTagsUploadPost - Actualización diferencial completada exitosamente"
        );
      }
    } catch (error) {
      log.error(
        "useTagsUploadPost - Error al actualizar tags del post:",
        error
      );
      throw error;
    }
  };

  return { uploadTagsToPost };
}
