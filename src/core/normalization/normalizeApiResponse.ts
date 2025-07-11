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

export function normalizeItem<T extends Record<string, any>>(
  raw: any,
  extraDefaults: Partial<T> = {}
): T {
  // Si viene anidado bajo 'item', usar ese objeto
  const item = raw.item ? raw.item : raw;
  const normalized: Record<string, any> = {
    ...item,
    tags: normalizeTags(item.tags),
    images: normalizeArray(item.images),
    attendees: normalizeArray(item.attendees),
    creationDate: normalizeDate(item.creationDate),
    eventDate: normalizeDate(item.eventDate),
    ...extraDefaults,
  };
  return normalized as T;
}

// Puedes agregar más normalizadores según el modelo
