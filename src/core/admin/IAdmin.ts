export interface IAdmin {
  id: number;
  username: string;
  email: string;
  phone: string;
  roles: string[];
}

export interface IAdminDTO {
  username: string;
  email: string;
  password: string;
  phone: string;
}
