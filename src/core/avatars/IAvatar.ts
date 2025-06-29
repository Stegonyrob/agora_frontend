export default interface IAvatar {
  id: number;
  name: string;
  imagePath?: string; // Para avatares predefinidos del sistema
  isDefault: boolean; // Si es avatar por defecto del sistema
  isCustom: boolean; // Si es avatar personalizado subido por usuario
  userId?: number; // Solo para avatares personalizados
  createdAt?: string;
  updatedAt?: string;
}
