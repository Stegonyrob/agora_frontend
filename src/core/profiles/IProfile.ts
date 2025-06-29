export default interface IProfile {
  id: number;
  firstName: string;
  lastName1: string;
  lastName2: string;
  relationship: string;
  email: string;
  avatar: string; // URL del avatar (para mostrar en frontend)
  avatar_id?: number; // ID del avatar (para enviar al backend)
  city: string;
  country: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
