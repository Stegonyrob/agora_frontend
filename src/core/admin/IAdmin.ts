export interface IAdmin {
  id: number;
  userId?: number;
  username: string;
  email: string;
  phone?: string;
  roles: string[];
  admin?: boolean;
  active?: boolean;
  displayName?: string;
  firstName?: string | null;
  lastName1?: string | null;
  lastName2?: string | null;
  relationship?: string;
  password?: string;
  confirmPassword?: string;
  city?: string;
  country?: string;
  avatarId?: number | null;
  avatarUrl?: string | null;
  avatarDisplayName?: string | null;
  fullName?: string;
  fullNameWithUsername?: string;
  acceptedRules?: boolean;
  banReason?: string | null;
  banned?: boolean;
}
