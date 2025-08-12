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
  console.log(`🔧 [normalizePostImages] Input:`, {
    images,
    postId,
    imagesType: typeof images,
  });

  if (!images) {
    console.log(
      `📭 [normalizePostImages] No images provided for post ${postId}`
    );
    return [];
  }

  if (Array.isArray(images)) {
    console.log(
      `📋 [normalizePostImages] Processing array of ${images.length} images for post ${postId}:`,
      images
    );

    // Si ya son objetos con IDs (formato futuro del backend)
    if (images.length > 0 && typeof images[0] === "object" && images[0].id) {
      console.log(
        `✅ [normalizePostImages] Images already have IDs (real backend format) for post ${postId}`
      );
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
      console.log(
        `🔄 [normalizePostImages] Created ${mockObjects.length} mock objects for post ${postId}:`,
        mockObjects
      );
      return mockObjects;
    }
  }

  console.log(
    `❌ [normalizePostImages] Could not process images for post ${postId}:`,
    { images, type: typeof images }
  );
  return [];
}

export function normalizeItem<T extends Record<string, any>>(
  raw: any,
  extraDefaults: Partial<T> = {}
): T {
  // Si viene anidado bajo 'item', usar ese objeto
  const item = raw.item ? raw.item : raw;

  console.log(`🔧 [normalizeItem] Processing item:`, {
    id: item.id,
    title: item.title,
    hasImage: "image" in item,
    hasImages: "images" in item,
    imageValue: item.image,
    imagesValue: item.images,
    imageType: typeof item.image,
    imagesType: typeof item.images,
    allFields: Object.keys(item),
  });

  // Procesar imágenes: priorizar 'image' (singular) del backend
  let processedImages;
  if (item.image) {
    console.log(
      `🖼️ [normalizeItem] Using 'image' field for post ${item.id}:`,
      item.image
    );
    processedImages = normalizePostImages(item.image, item.id);
  } else if (item.images) {
    console.log(
      `🖼️ [normalizeItem] Using 'images' field for post ${item.id}:`,
      item.images
    );
    processedImages = normalizeArray(item.images);
  } else {
    console.log(
      `📭 [normalizeItem] No image/images field found for post ${item.id}`
    );
    processedImages = [];
  }

  const normalized: Record<string, any> = {
    ...item,
    tags: normalizeTags(item.tags),
    images: processedImages,
    attendees: normalizeArray(item.attendees),
    creationDate: normalizeDate(item.creationDate),
    eventDate: normalizeDate(item.eventDate),
    ...extraDefaults,
  };

  console.log(`✅ [normalizeItem] Normalized result for post ${item.id}:`, {
    id: normalized.id,
    title: normalized.title,
    imagesCount: normalized.images?.length || 0,
    imagesData: normalized.images,
  });

  return normalized as T;
}

// Puedes agregar más normalizadores según el modelo
