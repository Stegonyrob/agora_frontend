// Interface para imágenes de posts
export interface ITextImage {
  id: number | null; // Permitir null para objetos mock temporales
  imageName: string;
  imageData?: string; // Base64 encoded image data
  textId: number;
  isMock?: boolean; // Flag para objetos temporales creados desde strings del backend
}

// Response type para las APIs de imágenes de posts
export interface TextImageResponse {
  id: number;
  imageName: string;
  imageType: string;
  imageData: string; // Base64 data
  textId: number;
}
