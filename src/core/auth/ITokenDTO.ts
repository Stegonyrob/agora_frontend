export interface ITokenDTO {
  userId: number;
  role: string;
  accessToken: string;
  refreshToken: string;
  userName: string;
  isLoggedIn: boolean;
  useremail: string;
}
