export interface IPostImageDTO {
  id: number;
  postId: number;
  imageName: string;
  imageType: string;
  imageData?: string; // Base64 o URL opcional
  file?: File; // Para subir archivos
  mainImage: boolean;
}
