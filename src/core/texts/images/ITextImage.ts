// Interface para imágenes de textos (frontend)
export interface ITextImage {
  id: number | null; // Permitir null para objetos mock temporales
  imageName: string;
  imageData?: string; // Base64 encoded image data
  textId: number;
  isMock?: boolean; // Flag para objetos temporales creados desde strings del backend
}

// Response type para las APIs de imágenes de textos (backend response)
export interface TextImageResponse {
  id: number;
  textId: number;
  imageName: string;
  imageType: string;
  imageData: string; // Base64 data
  createdAt: string;
}

// Upload response exactamente como documenta el backend
export interface TextImageUploadResponse {
  id: number;
  textId: number;
  imageName: string;
  imageType: string;
  imageData: string; // Base64 encoded
  createdAt: string;
}
