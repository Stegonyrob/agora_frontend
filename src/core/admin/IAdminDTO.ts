export interface IAdminDTO {
  // Campos OBLIGATORIOS según documentación
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  firstName: string;
  lastName1: string;

  // Campos OPCIONALES
  lastName2?: string;
  city?: string;
  country?: string;
  relationship?: string;
  avatarId?: number | null;
}
