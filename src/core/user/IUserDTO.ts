export default interface IUserDTO {
  // Campos básicos que pueden ser actualizados
  username?: string;
  email?: string;
  firstName?: string | null;
  lastName1?: string | null;
  lastName2?: string | null;

  // Avatar
  avatarId?: number | null;

  // Estados y reglas
  acceptedRules?: boolean;
  banned?: boolean;
  banReason?: string | null;

  // Roles - formato simplificado para envío
  roles?: string[];
}
