export default interface IUser {
  id: number;
  username: string;
  email: string;
  acceptedRules: boolean;
  firstName: string | null;
  lastName1: string | null;
  lastName2: string | null;
  avatarId: number | null;
  avatarUrl: string | null;
  avatarDisplayName: string | null;
  roles: string[];
  banReason: string | null;
  fullName: string;
  banned: boolean;
  admin: boolean;
}
