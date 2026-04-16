// Interface para imágenes de posts
export interface IPostImage {
  id: number | null; // Permitir null para objetos mock temporales
  imageName: string;
  imagePath: string; // Updated to use imagePath instead of imageData
  postId: number;
  url?: string; // URL completa para acceder a la imagen
  isMock?: boolean; // Flag para objetos temporales creados desde strings del backend
}

// Response type para las APIs de imágenes de posts
export interface PostImageResponse {
  id: number;
  imageName: string;
  imageType: string;
  imageData: string; // Base64 data
  postId: number;
}
