/**
 * Utility function to build consistent image URLs for text images
 */
export function getTextImageUrl(imagePath: string): string {
  if (!imagePath) return "";

  // Si ya es una URL completa, devolverla tal como está
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Construir URL completa desde imagePath
  const baseUrl = import.meta.env.VITE_API_ENDPOINT_GENERAL.replace(
    "/api/v1",
    ""
  );
  return `${baseUrl}${imagePath}`;
}

export default getTextImageUrl;
