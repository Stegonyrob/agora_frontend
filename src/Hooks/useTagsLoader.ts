import { ITag } from "@/core/tags/ITag";
import { useState } from "react";

// Hook simple: solo inicializa los tags una vez y permite setTags manualmente
export function useTagsLoader(initialTags: ITag[] = []) {
  const [tags, setTags] = useState<ITag[]>(initialTags);
  // Si quieres cargar tags remotos, hazlo en otro hook o explícitamente
  return { tags, setTags };
}
