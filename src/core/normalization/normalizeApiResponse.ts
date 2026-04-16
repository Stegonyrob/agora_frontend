// Funciones genéricas para normalizar respuestas de la API (eventos, posts, usuarios, etc.)

export function normalizeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

export function normalizeString(value: string | null | undefined): string {
  return typeof value === "string" ? value : "";
}

export function normalizeDate(
  value: string | number[] | null | undefined
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    // [YYYY, MM, DD, hh, mm, ss]
    const [year, month, day, hour = 0, min = 0, sec = 0] = value;
    return new Date(year, month - 1, day, hour, min, sec).toISOString();
  }
  return "";
}

export function normalizeTags(tags: any): any[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return [];
}

/**
 * Normaliza imágenes de posts: convierte strings a objetos mock con IDs
 * para mantener consistencia con la arquitectura de eventos
 */
export function normalizePostImages(images: any, postId: number): any[] {
  if (!images) {
    return [];
  }

  if (Array.isArray(images)) {
    // Si ya son objetos con IDs (formato futuro del backend)
    if (images.length > 0 && typeof images[0] === "object" && images[0].id) {
      return images;
    }

    // Si son strings (formato actual del backend), crear objetos mock
    if (images.length > 0 && typeof images[0] === "string") {
      const mockObjects = images.map((imageName: string, index: number) => ({
        id: null, // No tenemos ID real, lo obtendremos del backend después
        imageName,
        imageData: null,
        postId,
        isMock: true, // Flag para indicar que es un objeto temporal
      }));
      return mockObjects;
    }
  }

  return [];
}

export function normalizeItem<T extends Record<string, any>>(
  raw: any,
  extraDefaults: Partial<T> = {}
): T {
  // Si viene anidado bajo 'item', usar ese objeto
  let item = raw.item ? raw.item : raw;

  // Si existe 'profile', aplanar sus propiedades en la raíz
  if (item.profile && typeof item.profile === "object") {
    item = { ...item.profile, ...item };
    delete item.profile;
  }

  // Procesar imágenes: priorizar 'image' (singular) del backend
  let processedImages;
  if (item.image) {
    processedImages = normalizePostImages(item.image, item.id);
  } else if (item.images) {
    processedImages = normalizeArray(item.images);
  } else {
    processedImages = [];
  }

  // Si existe 'user' o 'usuario', incluirlo (para comentarios y replies)
  let user = undefined;
  if (item.user) {
    user = item.user;
  } else if (item.usuario) {
    user = item.usuario;
  }

  const normalized: Record<string, any> = {
    ...item,
    user,
    tags: normalizeTags(item.tags),
    images: processedImages,
    attendees: normalizeArray(item.attendees),
    creationDate: normalizeDate(item.creationDate),
    eventDate: normalizeDate(item.eventDate),
    eventTime: normalizeString(item.eventTime),
    ...extraDefaults,
  };

  return normalized as T;
}
