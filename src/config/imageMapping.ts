/**
 * Configuration for mapping categories and text IDs to available images
 * Based on the images available in the backend's temp_images directory
 */

// Available images in temp_images directory
export const AVAILABLE_IMAGES = [
  "abaco.jpg",
  "adolescentesGrupal.jpg",
  "alumnosOrdenador.jpg",
  "cubos.jpg",
  "diccionario.jpg",
  "escritorio.jpg",
  "fachada.jpg",
  "ficha.jpg",
  "ivan.jpg",
  "leyendo.jpg",
  "libros.jpg",
  "ninaFicha.jpg",
  "ninoCascos.jpg",
  "niñoCascos.jpg",
  "niñoCuento.jpg",
  "niñoFichas.jpg",
  "niñoPuzzle.jpg",
  "niños.jpg",
  "pintando.jpg",
];

// Mapping of categories to their preferred images
export const CATEGORY_IMAGE_MAPPING: Record<string, string[]> = {
  nosotros: ["fachada.jpg", "ivan.jpg", "escritorio.jpg"],
  servicios: [
    "adolescentesGrupal.jpg",
    "alumnosOrdenador.jpg",
    "niñoPuzzle.jpg",
    "libros.jpg",
  ],
  equipo: ["ivan.jpg", "escritorio.jpg"],
  neurodiversidad: ["niños.jpg", "niñoCuento.jpg", "niñoFichas.jpg"],
  cea: ["niñoCascos.jpg", "niñoFichas.jpg", "cubos.jpg"],
  atencion: ["ninoCascos.jpg", "libros.jpg", "leyendo.jpg"],
  aprendizaje: ["abaco.jpg", "diccionario.jpg", "ficha.jpg", "ninaFicha.jpg"],
  desarrollo: ["niñoPuzzle.jpg", "cubos.jpg", "pintando.jpg"],
  comunicacion: ["leyendo.jpg", "niñoCuento.jpg", "diccionario.jpg"],
  educacion: ["alumnosOrdenador.jpg", "libros.jpg", "abaco.jpg"],
  talleres: ["pintando.jpg", "cubos.jpg", "ficha.jpg"],
};

// Specific mapping of text IDs to images (based on your content structure)
export const TEXT_IMAGE_MAPPING: Record<number, string> = {
  1: "fachada.jpg", // ¿Quiénes Somos?
  2: "fachada.jpg", // Dónde Estamos
  3: "adolescentesGrupal.jpg", // Nuestros Servicios
  4: "alumnosOrdenador.jpg", // Reeducación Pedagógica
  5: "niñoPuzzle.jpg", // Educación Psicomotriz
  6: "leyendo.jpg", // Refuerzo de Inglés
  7: "libros.jpg", // Refuerzo Educativo
  8: "pintando.jpg", // Talleres Temáticos
  9: "cubos.jpg", // Taller Juegos de Mesa
  10: "niños.jpg", // Escuela de Familias
  11: "ivan.jpg", // Equipo Profesional
  12: "diccionario.jpg", // Apoyo en Lenguaje
  13: "abaco.jpg", // Apoyo Matemático
  14: "niñoCascos.jpg", // Atención Especializada
  15: "escritorio.jpg", // Servicios Generales
};

/**
 * Get the primary image for a category
 * @param category - Category name
 * @param index - Index of the image in the category (default: 0)
 * @returns Image filename or null if not found
 */
export const getImageForCategory = (
  category: string,
  index: number = 0
): string | null => {
  const images = CATEGORY_IMAGE_MAPPING[category.toLowerCase()];
  return images && images[index] ? images[index] : null;
};

/**
 * Get all images for a category
 * @param category - Category name
 * @returns Array of image filenames
 */
export const getImagesForCategory = (category: string): string[] => {
  return CATEGORY_IMAGE_MAPPING[category.toLowerCase()] || [];
};

/**
 * Get specific image for a text ID
 * @param textId - Text ID
 * @returns Image filename or null if not found
 */
export const getImageForText = (textId: number): string | null => {
  return TEXT_IMAGE_MAPPING[textId] || null;
};

/**
 * Get fallback images for a text based on category and ID
 * @param textId - Text ID
 * @param category - Category name
 * @returns Array of potential image filenames in order of preference
 */
export const getFallbackImages = (
  textId: number,
  category: string
): string[] => {
  const candidates: string[] = [];

  // First try specific text mapping
  const textImage = getImageForText(textId);
  if (textImage) candidates.push(textImage);

  // Then try category images
  const categoryImages = getImagesForCategory(category);
  candidates.push(...categoryImages);

  // Add generic fallbacks
  candidates.push("fachada.jpg"); // Generic fallback

  // Remove duplicates while preserving order
  return [...new Set(candidates)];
};

export default {
  AVAILABLE_IMAGES,
  CATEGORY_IMAGE_MAPPING,
  TEXT_IMAGE_MAPPING,
  getImageForCategory,
  getImagesForCategory,
  getImageForText,
  getFallbackImages,
};
