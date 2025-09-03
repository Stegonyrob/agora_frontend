export interface ITextImageDTO {
  id: number;
  textId: number;
  category: string;
  imageName: string;
  imageType: string;
  imageData?: string; // Base64 o URL opcional
  file?: File; // Para subir archivos
}
